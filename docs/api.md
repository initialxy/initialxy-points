# initialxy-points API Documentation

This document provides comprehensive information about the API endpoints available in the initialxy-points application.

## Table of Contents
1. [Authentication](#authentication)
2. [Tasks](#tasks)
3. [Rewards](#rewards)
4. [Users](#users)
5. [Points](#points)

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
  "token": "string",
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


## Users

### GET /api/users/[id]
Retrieves a specific user by ID.

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "role": "string",
  "points": "number"
}
```

**Status Codes:**
- 200: Successful retrieval
- 404: User not found

### GET /api/users
Retrieves all users.

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

## Tasks

### GET /api/tasks
Retrieves tasks for the authenticated user.

**Response:**
```json
{
  "tasks": [
    {
      "id": "number",
      "description": "string",
      "points": "number",
      "task_type": "string", // 'throw-away' or 'perpetual'
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
  "task_type": "string" // 'throw-away' or 'perpetual'
}
```

**Response:**
```json
{
  "id": "number",
  "description": "string",
  "points": "number",
  "task_type": "string",
  "child_id": "number",
  "parent_id": "number"
}
```

**Status Codes:**
- 201: Task created successfully
- 400: Invalid input
- 403: Forbidden (not a parent user)

### DELETE /api/tasks/[id]
Deletes a task by ID.

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

**Status Codes:**
- 200: Task deleted successfully
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
  "task_type": "string" // 'throw-away' or 'perpetual'
}
```

**Response:**
```json
{
  "id": "number",
  "description": "string",
  "points": "number",
  "task_type": "string",
  "child_id": "number",
  "parent_id": "number"
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

## Points

### GET /api/points
Retrieves the points for the authenticated user.

**Response:**
```json
{
  "points": "number"
}
```

**Status Codes:**
- 200: Successful retrieval
- 403: Forbidden (not authorized)

## Rewards

### GET /api/rewards
Retrieves available rewards.

**Response:**
```json
{
  "rewards": [
    {
      "id": "number",
      "description": "string",
      "points": "number"
    }
  ]
}
```

**Status Codes:**
- 200: Successful retrieval

### POST /api/rewards
Creates a new reward (parent-only endpoint).

**Request:**
```json
{
  "description": "string",
  "points": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "description": "string",
  "points": "number"
}
```

**Status Codes:**
- 201: Reward created successfully
- 400: Invalid input
- 403: Forbidden (not a parent user)