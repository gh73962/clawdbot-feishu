import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { createFeishuClient } from "./client.js";
import type { FeishuConfig } from "./types.js";
import type * as Lark from "@larksuiteoapi/node-sdk";
import { FeishuContactSchema, type FeishuContactParams } from "./contact-schema.js";
import { resolveToolsConfig } from "./tools-config.js";

// ============ Helpers ============

function json(data: unknown) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }],
    details: data,
  };
}

// ============ Actions ============

async function getDepartment(client: Lark.Client, params: FeishuContactParams) {
  const res = await client.contact.department.get({
    path: { department_id: params.department_id },
    params: {
      user_id_type: params.user_id_type,
      department_id_type: params.department_id_type,
    },
  });
  if (res.code !== 0) throw new Error(res.msg);

  return {
    department: res.data?.department,
  };
}

// ============ Tool Registration ============

export function registerFeishuContactTools(api: OpenClawPluginApi) {
  const feishuCfg = api.config?.channels?.feishu as FeishuConfig | undefined;
  if (!feishuCfg?.appId || !feishuCfg?.appSecret) {
    api.logger.debug?.("feishu_contact: Feishu credentials not configured, skipping contact tools");
    return;
  }

  const toolsCfg = resolveToolsConfig(feishuCfg.tools);
  if (!toolsCfg.contact) {
    api.logger.debug?.("feishu_contact: contact tool disabled in config");
    return;
  }

  const getClient = () => createFeishuClient(feishuCfg);

  api.registerTool(
    {
      name: "feishu_contact",
      label: "Feishu Contact",
      description: "Feishu contact directory operations. Actions: get_department",
      parameters: FeishuContactSchema,
      async execute(_toolCallId, params) {
        const p = params as FeishuContactParams;
        try {
          switch (p.action) {
            case "get_department":
              return json(await getDepartment(getClient(), p));
            default:
              return json({ error: `Unknown action: ${(p as any).action}` });
          }
        } catch (err) {
          return json({ error: err instanceof Error ? err.message : String(err) });
        }
      },
    },
    { name: "feishu_contact" },
  );

  api.logger.info?.("feishu_contact: Registered feishu_contact tool");
}
