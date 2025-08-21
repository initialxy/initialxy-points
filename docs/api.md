# initialxy-points API Documentation

This document provides comprehensive information about the API endpoints available in the initialxy-points application.

## Table of Contents
1. [Authentication](#authentication)
2. [Tasks](#tasks)
3. [Rewards](#rewards)
4. [Users](#users)
5. [Logs](#logs)

## Authentication

### POST /api/auth/login
Authenticates a user with a username and password.

**Request:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "username": "string",
    "role": "string",
    "points": "number"
  }
}
```

**Status Codes:**
- 200: Successful login
- 400: Invalid input
- 401: Invalid username or password

### POST /api/auth/password
Changes the password for the authenticated user.

**Request:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "message": "string",
  "success": "boolean"
}
```

**Status Codes:**
- 200: Password changed successfully
- 400: Invalid input or current password is incorrect
- 401: Unauthorized

## Users

### GET /api/users/[id]
Retrieves a specific user by ID.

**Response:**
```json
{
  "user": {
    "id": "number",
    "username": "string",
    "role": "string",
    "points": "number"
  }
}
```

**Status Codes:**
- 200: Successful retrieval
- 403: Forbidden (not authorized)
- 404: User not found

### GET /api/users
Retrieves all users.

**Query Parameters:**
- `role` - Filter by user role ('child', 'parent', or 'all') (default: 'child')

**Response:**
```json
{
  "users": [
    {
      "id": "number",
      "username": "string",
      "role": "string",
      "points": "number"
    }
  ]
}
```

**Status Codes:**
- 200: Successful retrieval

### PUT /api/users/[id]/points
Updates points for a specific child user (parent-only endpoint).

**Request:**
```json
{
  "points": "number"
}
```

**Response:**
```json
{
  "message": "Points updated successfully"
}
```

**Status Codes:**
- 200: Points updated successfully
- 400: Invalid points value
- 403: Forbidden (not a parent user)
- 404: User not found or not a child

## Tasks

### GET /api/tasks
Retrieves tasks for the authenticated user.

**Query Parameters:**
- `child_id` - Filter by specific child ID (optional). If provided, returns tasks for that specific child. If not provided and user is a parent, returns all tasks.

**Response:**
```json
{
  "tasks": [
    {
      "id": "number",
      "description": "string",
      "points": "number",
      "recurrence_type": "string", // 'single-use' or 'perpetual'
      "child_id": "number",
      "parent_id": "number",
      "is_marked_complete": "boolean"
    }
  ]
}
```

**Status Codes:**
- 200: Successful retrieval
- 403: Forbidden (not authorized)

### POST /api/tasks
Creates a new task for a child (parent-only endpoint).

**Request:**
```json
{
  "description": "string",
  "points": "number",
  "child_id": "number",
  "recurrence_type": "string" // 'single-use' or 'perpetual'
}
```

**Response:**
```json
{
  "task": {
    "id": "number",
    "description": "string",
    "points": "number",
    "recurrence_type": "string",
    "child_id": "number",
    "parent_id": "number"
  }
}
```

**Status Codes:**
- 200: Task created successfully
- 400: Invalid input
- 403: Forbidden (not a parent user)

### DELETE /api/tasks/[id]
Deletes a task by ID.

**Status Codes:**
- 204: Task deleted successfully
- 400: Invalid task ID
- 403: Forbidden (not authorized)
- 404: Task not found

### PUT /api/tasks/[id]
Updates a task by ID.

**Request:**
```json
{
  "description": "string",
  "points": "number",
  "recurrence_type": "string" // 'single-use' or 'perpetual'
}
```

**Response:**
```json
{
  "task": {
    "id": "number",
    "description": "string",
    "points": "number",
    "recurrence_type": "string",
    "child_id": "number",
    "parent_id": "number",
    "is_marked_complete": "boolean"
  }
}
```

**Status Codes:**
- 200: Task updated successfully
- 400: Invalid input
- 403: Forbidden (not authorized)
- 404: Task not found

### POST /api/tasks/[id]/mark_complete
Marks a task as completed by a child user (pending parent approval).

**Response:**
```json
{
  "message": "Task marked as completed. Awaiting parent approval."
}
```

**Status Codes:**
- 200: Task marked as completed
- 400: Invalid task ID or task already completed
- 403: Forbidden (not a child user)
- 404: Task not found

### POST /api/tasks/[id]/approve_complete
Approves a task completion by a parent user.

**Response:**
```json
{
  "message": "Task completion approved",
  "pointsEarned": "number"
}
```

**Status Codes:**
- 200: Task completion approved
- 400: Invalid task ID or task not marked as completed
- 403: Forbidden (not a parent user)
- 404: Task not found

### POST /api/tasks/[id]/reject_complete
Rejects a task completion by a parent user.

**Response:**
```json
{
  "message": "Task completion rejected"
}
```

**Status Codes:**
- 200: Task completion rejected
- 400: Invalid task ID or task not marked as completed
- 403: Forbidden (not a parent user)
- 404: Task not found

## Rewards

### GET /api/rewards
Retrieves rewards for the authenticated user.

**Query Parameters:**
- `child_id` - Filter by specific child ID (optional). If provided, returns rewards for that specific child. If not provided and user is a parent, returns all rewards.

**Response:**
```json
{
  "rewards": [
    {
      "id": "number",
      "description": "string",
      "points": "number",
      "recurrence_type": "string", // 'single-use' or 'perpetual'
      "child_id": "number",
      "parent_id": "number",
      "is_redemption_requested": "boolean"
    }
  ]
}
```

**Status Codes:**
- 200: Successful retrieval
- 403: Forbidden (not authorized)

### POST /api/rewards
Creates a new reward for a child (parent-only endpoint).

**Request:**
```json
{
  "description": "string",
  "points": "number",
  "child_id": "number",
  "recurrence_type": "string" // 'single-use' or 'perpetual'
}
```

**Response:**
```json
{
  "reward": {
    "id": "number",
    "description": "string",
    "points": "number",
    "recurrence_type": "string",
    "child_id": "number",
    "parent_id": "number"
  }
}
```

**Status Codes:**
- 200: Reward created successfully
- 400: Invalid input
- 403: Forbidden (not a parent user)

### DELETE /api/rewards/[id]
Deletes a reward by ID.

**Status Codes:**
- 204: Reward deleted successfully
- 400: Invalid reward ID
- 403: Forbidden (not authorized)
- 404: Reward not found

### PUT /api/rewards/[id]
Updates a reward by ID.

**Request:**
```json
{
  "description": "string",
  "points": "number",
  "recurrence_type": "string" // 'single-use' or 'perpetual'
}
```

**Response:**
```json
{
  "reward": {
    "id": "number",
    "description": "string",
    "points": "number",
    "recurrence_type": "string",
    "child_id": "number",
    "parent_id": "number",
    "is_redemption_requested": "boolean"
  }
}
```

**Status Codes:**
- 200: Reward updated successfully
- 400: Invalid input
- 403: Forbidden (not authorized)
- 404: Reward not found

### POST /api/rewards/[id]/request_redemption
Requests redemption of a reward by a child user.

**Response:**
```json
{
  "message": "Reward redemption requested. Awaiting parent approval."
}
```

**Status Codes:**
- 200: Redemption requested successfully
- 400: Invalid reward ID or insufficient points
- 403: Forbidden (not authorized)
- 404: Reward not found

### POST /api/rewards/[id]/approve_redemption
Approves a reward redemption by a parent user.

**Response:**
```json
{
  "message": "Reward completion approved",
  "pointsEarned": "number"
}
```

**Status Codes:**
- 200: Redemption approved successfully
- 400: Invalid reward ID or insufficient points
- 403: Forbidden (not a parent user)
- 404: Reward not found

### POST /api/rewards/[id]/reject_redemption
Rejects a reward redemption by a parent user.

**Response:**
```json
{
  "message": "Reward redemption rejected"
}
```

**Status Codes:**
- 200: Redemption rejected successfully
- 400: Invalid reward ID or redemption not requested
- 403: Forbidden (not a parent user)
- 404: Reward not found

## Logs

### GET /api/logs
Retrieves logs of user actions. Parent users can see all logs, while child users can only see logs where they are the recipient.

**Query Parameters:**
- `limit` - Number of log entries to return (default: 50)
- `recipient_id` - Filter by specific recipient ID (optional)

**Response:**
```json
{
  "logs": [
    {
      "id": "number",
      "timestamp": "number",
      "actor_id": "number",
      "actor_username": "string",
      "action_type": "string",
      "recipient_id": "number",
      "recipient_username": "string",
      "points_before": "number",
      "points_after": "number",
      "additional_context": "string"
    }
  ]
}
```

**Status Codes:**
- 200: Successful retrieval
- 401: Unauthorized