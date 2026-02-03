import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { createFeishuClient } from "./client.js";
import type { FeishuConfig } from "./types.js";
import type * as Lark from "@larksuiteoapi/node-sdk";
import { FeishuCalendarSchema, type FeishuCalendarParams } from "./calendar-schema.js";
import { resolveToolsConfig } from "./tools-config.js";

// ============ Helpers ============

function json(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    details: data,
  };
}

function validateTimeRange(startTime: { date?: string; timestamp?: string }, endTime: {
  date?: string;
  timestamp?: string;
}) {
  if (!startTime.date && !startTime.timestamp) {
    throw new Error("start_time must include date or timestamp");
  }
  if (!endTime.date && !endTime.timestamp) {
    throw new Error("end_time must include date or timestamp");
  }
}

// ============ Actions ============

type CreateEventParams = Extract<FeishuCalendarParams, { action: "create" }>;
type AddAttendeesParams = Extract<FeishuCalendarParams, { action: "add_attendees" }>;
type DeleteEventParams = Extract<FeishuCalendarParams, { action: "delete" }>;

async function createEvent(client: Lark.Client, params: CreateEventParams) {
  validateTimeRange(params.start_time, params.end_time);

  const res = await client.calendar.calendarEvent.create({
    path: { calendar_id: params.calendar_id },
    params: {
      idempotency_key: params.idempotency_key,
      user_id_type: params.user_id_type,
    },
    data: {
      summary: params.summary,
      description: params.description,
      vchat: params.vchat,
      need_notification: params.need_notification,
      start_time: params.start_time,
      end_time: params.end_time,
      visibility: params.visibility,
      attendee_ability: "can_modify_event",
      free_busy_status: params.free_busy_status,
      location: params.location,
      reminders: params.reminders,
      recurrence: params.recurrence,
    },
  });
  if (res.code !== 0) throw new Error(res.msg);

  const event = res.data?.event;
  return {
    event_id: event?.event_id,
    summary: event?.summary,
    description: event?.description,
    start_time: event?.start_time,
    end_time: event?.end_time,
    app_link: event?.app_link,
  };
}

async function addEventAttendees(client: Lark.Client, params: AddAttendeesParams) {
  const res = await client.calendar.calendarEventAttendee.create({
    path: { calendar_id: params.calendar_id, event_id: params.event_id },
    data: {
      attendees: params.attendees,
      need_notification: params.need_notification,
      instance_start_time_admin: params.instance_start_time_admin,
      is_enable_admin: params.is_enable_admin,
      add_operator_to_attendee: params.add_operator_to_attendee,
    },
  });
  if (res.code !== 0) throw new Error(res.msg);

  return {
    attendees: res.data?.attendees ?? [],
  };
}

async function deleteEvent(client: Lark.Client, params: DeleteEventParams) {
  const res = await client.calendar.calendarEvent.delete({
    path: { calendar_id: params.calendar_id, event_id: params.event_id },
    params: {
      need_notification: params.need_notification,
    },
  });
  if (res.code !== 0) throw new Error(res.msg);

  return { success: true };
}

// ============ Tool Registration ============

export function registerFeishuCalendarTools(api: OpenClawPluginApi) {
  const feishuCfg = api.config?.channels?.feishu as FeishuConfig | undefined;
  if (!feishuCfg?.appId || !feishuCfg?.appSecret) {
    api.logger.debug?.("feishu_calendar: Feishu credentials not configured, skipping calendar tools");
    return;
  }

  const toolsCfg = resolveToolsConfig(feishuCfg.tools);
  if (!toolsCfg.calendar) {
    api.logger.debug?.("feishu_calendar: calendar tool disabled in config");
    return;
  }

  const getClient = () => createFeishuClient(feishuCfg);

  api.registerTool(
    {
      name: "feishu_calendar",
      label: "Feishu Calendar",
      description: "Feishu calendar operations. Actions: create, add_attendees, delete",
      parameters: FeishuCalendarSchema,
      async execute(_toolCallId, params) {
        const p = params as FeishuCalendarParams;
        try {
          switch (p.action) {
            case "create":
              return json(await createEvent(getClient(), p));
            case "add_attendees":
              return json(await addEventAttendees(getClient(), p));
            case "delete":
              return json(await deleteEvent(getClient(), p));
            default:
              return json({ error: `Unknown action: ${(p as any).action}` });
          }
        } catch (err) {
          return json({ error: err instanceof Error ? err.message : String(err) });
        }
      },
    },
    { name: "feishu_calendar" },
  );

  api.logger.info?.("feishu_calendar: Registered feishu_calendar tool");
}
