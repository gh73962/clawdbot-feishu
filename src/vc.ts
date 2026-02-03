import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { createFeishuClient } from "./client.js";
import type { FeishuConfig } from "./types.js";
import type * as Lark from "@larksuiteoapi/node-sdk";
import { FeishuVCSchema, type FeishuVCParams } from "./vc-schema.js";
import { resolveToolsConfig } from "./tools-config.js";

// ============ Helpers ============

function json(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    details: data,
  };
}

// ============ Actions ============

async function getRoom(client: Lark.Client, params: FeishuVCParams) {
  const res = await client.vc.v1.room.get({
    path: { room_id: params.room_id },
    params: {
      user_id_type: params.user_id_type,
    },
  });
  if (res.code !== 0) throw new Error(res.msg);

  return {
    room: res.data?.room,
  };
}

// ============ Tool Registration ============

export function registerFeishuVCTools(api: OpenClawPluginApi) {
  const feishuCfg = api.config?.channels?.feishu as FeishuConfig | undefined;
  if (!feishuCfg?.appId || !feishuCfg?.appSecret) {
    api.logger.debug?.("feishu_vc: Feishu credentials not configured, skipping vc tools");
    return;
  }

  const toolsCfg = resolveToolsConfig(feishuCfg.tools);
  if (!toolsCfg.vc) {
    api.logger.debug?.("feishu_vc: vc tool disabled in config");
    return;
  }

  const getClient = () => createFeishuClient(feishuCfg);

  api.registerTool(
    {
      name: "feishu_vc",
      label: "Feishu VC",
      description: "Feishu meeting room operations. Actions: get_room",
      parameters: FeishuVCSchema,
      async execute(_toolCallId, params) {
        const p = params as FeishuVCParams;
        try {
          switch (p.action) {
            case "get_room":
              return json(await getRoom(getClient(), p));
            default:
              return json({ error: `Unknown action: ${(p as any).action}` });
          }
        } catch (err) {
          return json({ error: err instanceof Error ? err.message : String(err) });
        }
      },
    },
    { name: "feishu_vc" },
  );

  api.logger.info?.("feishu_vc: Registered feishu_vc tool");
}
