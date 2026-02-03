---
name: feishu-contact
description: |
  Feishu contact directory operations. Activate when user asks to query department info, department IDs, or organization structure via Feishu/Lark contact APIs.
---

# Feishu Contact

Single tool `feishu_contact` for contact directory operations.

## Actions

### Get Department Info

```json
{
  "action": "get_department",
  "department_id": "od-4e6ac4d14bcd5071a37a39de902c7141",
  "department_id_type": "open_department_id",
  "user_id_type": "open_id"
}
```

Notes:
- `department_id` must match `department_id_type`
- If querying root department, ensure app/user has full directory visibility

## Configuration

```yaml
channels:
  feishu:
    tools:
      contact: true  # default: true
```

## Permissions

Required scopes (one of):
- `contact:contact.base:readonly`
- `contact:contact:access_as_app`
- `contact:contact:readonly`
- `contact:contact:readonly_as_app`
