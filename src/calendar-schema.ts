import { Type, type Static } from "@sinclair/typebox";

const TimeSchema = Type.Object({
  timestamp: Type.Optional(
    Type.String({ description: "Unix timestamp in seconds (string) for event time" }),
  ),
  date: Type.Optional(Type.String({ description: "All-day date in YYYY-MM-DD format" })),
  timezone: Type.Optional(Type.String({ description: "Timezone ID, e.g. Asia/Shanghai" })),
});

const AttendeeCustomizationOptionSchema = Type.Object({
  option_key: Type.Optional(Type.String()),
  others_content: Type.Optional(Type.String()),
});

const AttendeeCustomizationSchema = Type.Object({
  index_key: Type.String({ description: "Customization field ID" }),
  input_content: Type.Optional(Type.String()),
  options: Type.Optional(Type.Array(AttendeeCustomizationOptionSchema)),
});

const AttendeeSchema = Type.Object({
  type: Type.Optional(
    Type.Union([
      Type.Literal("user"),
      Type.Literal("chat"),
      Type.Literal("resource"),
      Type.Literal("third_party"),
    ]),
  ),
  is_optional: Type.Optional(Type.Boolean()),
  user_id: Type.Optional(Type.String()),
  chat_id: Type.Optional(Type.String()),
  room_id: Type.Optional(Type.String()),
  third_party_email: Type.Optional(Type.String()),
  operate_id: Type.Optional(Type.String()),
  resource_customization: Type.Optional(Type.Array(AttendeeCustomizationSchema)),
  approval_reason: Type.Optional(Type.String()),
});

const CalendarCreateSchema = Type.Object({
  action: Type.Literal("create"),
  calendar_id: Type.String({ description: "Calendar ID (primary/shared)" }),
  summary: Type.String({ description: "Event title" }),
  description: Type.Optional(Type.String({ description: "Event description" })),
  start_time: TimeSchema,
  end_time: TimeSchema,
  vchat: Type.Optional(
    Type.Object({
      vc_type: Type.Optional(
        Type.Union([
          Type.Literal("vc"),
          Type.Literal("third_party"),
          Type.Literal("no_meeting"),
          Type.Literal("lark_live"),
          Type.Literal("unknown"),
          Type.Literal("third_party_meeting"),
        ]),
      ),
    }),
  ),
  need_notification: Type.Optional(
    Type.Boolean({ description: "Whether to send notifications to attendees" }),
  ),
  visibility: Type.Optional(
    Type.Union([Type.Literal("default"), Type.Literal("public"), Type.Literal("private")]),
  ),
  free_busy_status: Type.Optional(Type.Union([Type.Literal("busy"), Type.Literal("free")])),
  location: Type.Optional(
    Type.Object({
      name: Type.Optional(Type.String()),
      address: Type.Optional(Type.String()),
      latitude: Type.Optional(Type.Number()),
      longitude: Type.Optional(Type.Number()),
    }),
  ),
  reminders: Type.Optional(
    Type.Array(
      Type.Object({
        minutes: Type.Optional(Type.Number({ description: "Minutes before event" })),
      }),
    ),
  ),
  recurrence: Type.Optional(Type.String({ description: "RRULE string for recurring events" })),
  idempotency_key: Type.Optional(Type.String({ description: "Idempotency key" })),
  user_id_type: Type.Optional(
    Type.Union([Type.Literal("user_id"), Type.Literal("union_id"), Type.Literal("open_id")]),
  ),
});

const CalendarAddAttendeesSchema = Type.Object({
  action: Type.Literal("add_attendees"),
  calendar_id: Type.String({ description: "Calendar ID (primary/shared)" }),
  event_id: Type.String({ description: "Event ID" }),
  attendees: Type.Optional(Type.Array(AttendeeSchema)),
  need_notification: Type.Optional(Type.Boolean({ description: "Whether to notify attendees" })),
  instance_start_time_admin: Type.Optional(
    Type.String({ description: "Instance start time for recurring event (admin only)" }),
  ),
  is_enable_admin: Type.Optional(
    Type.Boolean({ description: "Enable room admin mode (rooms only)" }),
  ),
  add_operator_to_attendee: Type.Optional(
    Type.Boolean({ description: "Add room operator as attendee" }),
  ),
  user_id_type: Type.Optional(
    Type.Union([Type.Literal("user_id"), Type.Literal("union_id"), Type.Literal("open_id")]),
  ),
});

const CalendarDeleteSchema = Type.Object({
  action: Type.Literal("delete"),
  calendar_id: Type.String({ description: "Calendar ID (primary/shared)" }),
  event_id: Type.String({ description: "Event ID" }),
  need_notification: Type.Optional(
    Type.Union([Type.Literal("true"), Type.Literal("false")]),
  ),
});

export const FeishuCalendarSchema = Type.Union([
  CalendarCreateSchema,
  CalendarAddAttendeesSchema,
  CalendarDeleteSchema,
]);

export type FeishuCalendarParams = Static<typeof FeishuCalendarSchema>;
