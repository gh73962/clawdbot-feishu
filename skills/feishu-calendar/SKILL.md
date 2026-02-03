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
  "user_id_type": "open_id",
  "attendees": [
    { "type": "user", "user_id": "ou_xxx", "is_optional": true },
    { "type": "chat", "chat_id": "oc_xxx" },
    { "type": "resource", "room_id": "omm_xxx", "operate_id": "ou_xxx" },
    { "type": "third_party", "third_party_email": "a@b.com" }
  ],
  "need_notification": true
}
```

Notes:
- `user_id_type` must match the `user_id` / `operate_id` you pass
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
