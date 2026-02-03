---
name: feishu-calendar
description: |
  Feishu calendar event operations (create, add attendees, delete). Activate when user asks to create schedules, add attendees to events, or delete calendar events in Feishu/Lark.
---

# Feishu Calendar

Single tool `feishu_calendar` with action-based operations for Feishu calendar events.

## Actions

### Create Event

```json
{
  "action": "create",
  "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
  "summary": "Weekly Sync",
  "start_time": { "timestamp": "1713168000", "timezone": "Asia/Shanghai" },
  "end_time": { "timestamp": "1713171600", "timezone": "Asia/Shanghai" },
  "description": "Project updates"
}
```

Time rules:
- `start_time` and `end_time` must include `timestamp` or `date`
- Use `date` for all-day events (YYYY-MM-DD)

Full example (common fields):
```json
{
  "action": "create",
  "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
  "summary": "日程标题",
  "description": "日程描述",
  "start_time": {
    "timestamp": "1602504000",
    "timezone": "Asia/Shanghai"
  },
  "end_time": {
    "timestamp": "1602507600",
    "timezone": "Asia/Shanghai"
  },
  "vchat": {
    "vc_type": "no_meeting"
  },
  "visibility": "public",
  "free_busy_status": "busy",
  "reminders": [
    { "minutes": 5 }
  ]
}
```

Note:
- `attendee_ability` is fixed to `can_modify_event` in code. Do not pass it in the tool call.

### Add Attendees

```json
{
  "action": "add_attendees",
  "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
  "event_id": "xxxxxx_0",
  "attendees": [
    { "type": "user", "user_id": "ou_xxx"},
    { "type": "chat", "chat_id": "oc_xxx" },
    { "type": "resource", "room_id": "omm_xxx", "operate_id": "ou_xxx" },
    { "type": "third_party", "third_party_email": "a@b.com" }
  ],
  "need_notification": true
}
```
Doc:
名称 | 类型 | 描述
---|---|---
code | int | 错误码，非 0 表示失败
msg | string | 错误描述
data | \- | \-
attendees | calendar.event.attendee\[\] | 添加参与人后，日程参与人列表信息。
type | string | 参与人类型。<br>**可选值有**：<br>- user：用户<br>- chat：群组<br>- resource：会议室<br>- third_party：外部邮箱
attendee_id | string | 参与人 ID。日程参与人在当前日程内的唯一标识，后续可通过该 ID 删除日程参与人，或用于查询群组类型参与人的群成员信息。
rsvp_status | string | 参与人 RSVP 状态，即日程回复状态。<br>**可选值有**：<br>- needs_action：参与人尚未回复状态，或表示会议室预约中<br>- accept：参与人回复接受，或表示会议室预约成功<br>- tentative：参与人回复待定<br>- decline：参与人回复拒绝，或表示会议室预约失败<br>- removed：参与人或会议室已经从日程中被移除
is_optional | boolean | 参与人是否为可选参加，该参数值对群组的群成员不生效。
is_organizer | boolean | 参与人是否为日程组织者。
is_external | boolean | 参与人是否为外部参与人。外部参与人不支持编辑。
display_name | string | 参与人名称。
chat_members | attendee_chat_member\[\] | 群成员，当参与人类型为群组（type 为 chat）时有效。群成员不支持编辑。
rsvp_status | string | 参与人 RSVP 状态。<br>**可选值有**：<br>- needs_action：参与人尚未回复状态，或表示会议室预约中<br>- accept：参与人回复接受，或表示会议室预约成功<br>- tentative：参与人回复待定<br>- decline：参与人回复拒绝，或表示会议室预约失败<br>- removed：参与人或会议室已经从日程中被移除
is_optional | boolean | 参与人是否为可选参加。
display_name | string | 参与人名称。
is_organizer | boolean | 参与人是否为日程组织者。
is_external | boolean | 参与人是否为外部参与人。
user_id | string | 用户类型参与人的用户 ID，ID 类型与 user_id_type 的值保持一致。关于用户 ID 可参见[用户相关的 ID 概念](https://open.feishu.cn/document/home/user-identity-introduction/introduction)。<br>**注意**：当 is_external 返回为 true 时，此字段只会返回 open_id 或者 union_id。
chat_id | string | 群组类型参与人的群组 ID。关于群组 ID 可参见[群 ID 说明](https://open.feishu.cn/document/uAjLw4CM/ukTMukTMukTM/reference/im-v1/chat-id-description)。
room_id | string | 会议室类型参与人的会议室 ID。
third_party_email | string | 外部邮箱类型参与人的邮箱地址。
operate_id | string | 如果日程是使用应用身份创建的，在添加会议室时，指定的会议室联系人 ID。ID 类型与 user_id_type 的值保持一致。
resource_customization | calendar.attendee.resource_customization\[\] | 会议室的个性化配置。
index_key | string | 每个配置的唯一 ID。
input_content | string | 填空类型的取值。
options | customization.option\[\] | 每个配置的选项。
option_key | string | 每个选项的唯一 ID。
others_content | string | 其他选项类型的取值。
approval_reason | string | 申请预定审批会议室的原因。参数配置说明：<br>- 仅使用用户身份（user_access_token）预定审批会议室时，该字段生效。<br>- 对于申请预定审批会议室的场景，不传该值会直接预约失败。<br>-  如果使用应用身份（tenant_access_token）预定审批会议室，会直接失败。

Notes:
- `attendees.type` allowed values:
  - `user`: User
  - `chat`: Group chat
  - `resource`: Meeting room
  - `third_party`: External email
- `user_id_type` uses default (`open_id`) unless you explicitly pass it
- Use `resource_customization` and `approval_reason` only when required by meeting rooms


### vchat.vc_type

Video meeting type. If no meeting is needed, **must** use `no_meeting`.

Allowed values:
- `vc`: Feishu video meeting. When set, other `vchat` fields are ignored.
- `no_meeting`: No video meeting. When set, other `vchat` fields are ignored.

### Delete Event

```json
{
  "action": "delete",
  "calendar_id": "feishu.cn_xxx@group.calendar.feishu.cn",
  "event_id": "xxxxxx_0",
  "need_notification": "false"
}
```

## Configuration

```yaml
channels:
  feishu:
    tools:
      calendar: true  # default: true
```

## Permissions

Required scopes (one of):
- `calendar:calendar`
- `calendar:calendar.event:update` (add attendees)
- `calendar:calendar.event:delete` (delete event)
