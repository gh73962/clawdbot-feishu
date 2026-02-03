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
