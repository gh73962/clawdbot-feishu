import { Type, type Static } from "@sinclair/typebox";

export const FeishuVCSchema = Type.Object({
  action: Type.Literal("get_room"),
  room_id: Type.String({ description: "Meeting room ID" }),
  user_id_type: Type.Optional(
    Type.Union([Type.Literal("user_id"), Type.Literal("union_id"), Type.Literal("open_id")]),
  ),
});

export type FeishuVCParams = Static<typeof FeishuVCSchema>;
