import { Type, type Static } from "@sinclair/typebox";

const UserIdTypeSchema = Type.Optional(
  Type.Union([Type.Literal("user_id"), Type.Literal("union_id"), Type.Literal("open_id")]),
);

const GetRoomSchema = Type.Object({
  action: Type.Literal("get_room"),
  room_id: Type.String({ description: "Meeting room ID" }),
  user_id_type: UserIdTypeSchema,
});

const ListRoomsSchema = Type.Object({
  action: Type.Literal("list_rooms"),
  page_size: Type.Optional(Type.Integer({ description: "Page size (max 100)" })),
  page_token: Type.Optional(Type.String({ description: "Pagination token" })),
  room_level_id: Type.Optional(Type.String({ description: "Room level ID (optional)" })),
  user_id_type: UserIdTypeSchema,
});

export const FeishuVCSchema = Type.Union([GetRoomSchema, ListRoomsSchema]);

export type FeishuVCParams = Static<typeof FeishuVCSchema>;
