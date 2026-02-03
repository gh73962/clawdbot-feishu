import { Type, type Static } from "@sinclair/typebox";

export const FeishuContactSchema = Type.Object({
  action: Type.Literal("get_department"),
  department_id: Type.String({ description: "Department ID (matches department_id_type)" }),
  user_id_type: Type.Optional(
    Type.Union([Type.Literal("user_id"), Type.Literal("union_id"), Type.Literal("open_id")]),
  ),
  department_id_type: Type.Optional(
    Type.Union([Type.Literal("department_id"), Type.Literal("open_department_id")]),
  ),
});

export type FeishuContactParams = Static<typeof FeishuContactSchema>;
