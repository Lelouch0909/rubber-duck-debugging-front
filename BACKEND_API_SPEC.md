# Rubberduck Notebooks - Backend API Specification

This document specifies the API endpoints required for the Notebooks feature.

## Base URL

```
${NEXT_PUBLIC_API_URL}/api/notebooks
```

Default: `http://localhost:3001/api/notebooks`

---

## Authentication

All endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Get All Notes

**GET** `/notes`

Retrieve all notes for the authenticated user.

**Response** `200 OK`

```json
{
  "data": [
    {
      "id": "string",
      "title": "string",
      "content": "string (markdown)",
      "tags": ["string"],
      "createdAt": "ISO 8601 datetime",
      "updatedAt": "ISO 8601 datetime"
    }
  ],
  "total": "number"
}
```

---

### 2. Get Single Note

**GET** `/notes/:id`

**Parameters**
- `id` (path) - Note ID

**Response** `200 OK`

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "tags": ["string"],
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

---

### 3. Create Note

**POST** `/notes`

**Request Body**

```json
{
  "title": "string (required)",
  "content": "string (required)",
  "tags": ["string"] // optional
}
```

**Response** `201 Created`

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "tags": ["string"],
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

---

### 4. Update Note

**PUT** `/notes/:id`

**Parameters**
- `id` (path) - Note ID

**Request Body** (all fields optional)

```json
{
  "title": "string",
  "content": "string",
  "tags": ["string"]
}
```

**Response** `200 OK`

```json
{
  "data": {
    "id": "string",
    "title": "string",
    "content": "string",
    "tags": ["string"],
    "createdAt": "ISO 8601 datetime",
    "updatedAt": "ISO 8601 datetime"
  }
}
```

---

### 5. Delete Note

**DELETE** `/notes/:id`

**Parameters**
- `id` (path) - Note ID

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

---

### 6. Get Note Connections

**GET** `/notes/connections`

Returns similarity scores between notes (computed by AI/ML based on content and tags).

**Response** `200 OK`

```json
{
  "data": [
    {
      "sourceId": "string",
      "targetId": "string",
      "similarity": "number (0-10)"
    }
  ]
}
```

**Note:** The similarity score determines the connection line color in bubble view:
- 0-5: White → Red gradient
- 5-10: Red → Black gradient

---

### 7. Get Available Tags

**GET** `/tags`

**Response** `200 OK`

```json
{
  "data": ["string"]
}
```

---

### 8. Create Tag

**POST** `/tags`

**Request Body**

```json
{
  "name": "string"
}
```

**Response** `201 Created`

```json
{
  "data": {
    "name": "string"
  }
}
```

---

### 9. Delete Tag

**DELETE** `/tags/:name`

**Response** `200 OK`

```json
{
  "success": true,
  "message": "Tag deleted successfully"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - No access to resource |
| 404 | Not Found - Note/tag not found |
| 500 | Internal Server Error |

---

## Future Endpoints (Optional)

- `POST /notes/:id/connections` - Manually create connection
- `GET /notes/search?q=query` - Full-text search
- `POST /notes/:id/export` - Export note as PDF/markdown file
