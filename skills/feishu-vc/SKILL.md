---
name: feishu-vc
description: |
  Feishu meeting room (VC) operations. Activate when user asks to query meeting room details by room ID in Feishu/Lark.
---

# Feishu VC

Single tool `feishu_vc` for meeting room operations.

## Actions

### Get Room Details

```json
{
  "action": "get_room",
  "room_id": "omm_4de32cf10a4358788ff4e09e37ebbf9c",
  "user_id_type": "open_id"
}
```

Notes:
- Requires tenant access token (app identity)
- `user_id_type` affects `contact_ids` field in response

### List Rooms

```json
{
  "action": "list_rooms",
  "room_level_id": "omb_4ad1a2c7a2fbc5fc9570f38456931293",
  "page_size": 10,
  "page_token": "50",
  "user_id_type": "open_id"
}
```

Notes:
- `room_level_id` omitted = list all rooms under tenant
- `page_size` max 100; use `page_token` for pagination

## Configuration

```yaml
channels:
  feishu:
    tools:
      vc: true  # default: true
```

## Permissions

Required scopes (one of):
- `vc:room`
- `vc:room:readonly`
