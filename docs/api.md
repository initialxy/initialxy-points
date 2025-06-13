# initialxy-points API Documentation

This document provides comprehensive information about the API endpoints available in the initialxy-points application.

## Table of Contents
1. [Authentication](#authentication)
2. [Tasks](#tasks)
3. [Rewards](#rewards)
4. [Wishlist](#wishlist)
5. [Points](#points)

## Authentication

### POST /api/auth/login
Authenticates a user with a username and passcode.

**Request:**
```json
{
  "username": "string",
  "passcode": "string"
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
- 401: Invalid username or passcode

### POST /api/auth/register
Registers a new user.

**Request:**
```json
{
  "username": "string",
  "passcode": "string",
  "role": "string" // 'parent' or 'kid'
}
```

**Response:**
```json
{
  "id": "number",
  "username": "string",
  "role": "string"
}
```

**Status Codes:**
- 201: User created successfully
- 400: Invalid input

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
Creates a new task for a kid (parent-only endpoint).

**Request:**
```json
{
  "description": "string",
  "points": "number",
  "kid_id": "number",
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

### POST /api/tasks/[id]/mark_complete
Marks a task as completed by a kid user (pending parent approval).

**Response:**
```json
{
  "message": "Task marked as completed. Awaiting parent approval."
}
```

**Status Codes:**
- 200: Task marked as completed
- 400: Invalid task ID or task already completed
- 403: Forbidden (not a kid user)
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

## Wishlist

### GET /api/wishlist
Retrieves the authenticated kid's wishlist items.

**Response:**
```json
{
  "wishlist": [
    {
      "id": "number",
      "kid_id": "number",
      "reward_id": "number",
      "approved": "boolean",
      "reward_description": "string",
      "reward_points": "number"
    }
  ]
}
```

**Status Codes:**
- 200: Successful retrieval
- 403: Forbidden (not a kid user)

### POST /api/wishlist
Submits a new wishlist item (kid-only endpoint).

**Request:**
```json
{
  "reward_id": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "kid_id": "number",
  "reward_id": "number",
  "approved": "boolean"
}
```

**Status Codes:**
- 201: Wishlist item created successfully
- 400: Invalid input
- 403: Forbidden (not a kid user)

### POST /api/wishlist/[id]/approve
Approves a wishlist item by a parent.

**Response:**
```json
{
  "message": "Wishlist item approved successfully"
}
```

**Status Codes:**
- 200: Wishlist item approved successfully
- 400: Invalid wishlist ID or already approved
- 403: Forbidden (not a parent user)
- 404: Wishlist item not found

## Points

### GET /api/points
Retrieves points information for all kids.

**Response:**
```json
{
  "points": [
    {
      "kid_id": "number",
      "username": "string",
      "points": "number"
    }
  ]
}
```

**Status Codes:**
- 200: Successful retrieval
- 403: Forbidden (not a parent user)

### POST /api/wishlist/[id]/reject
Rejects a wishlist item by a parent.

**Response:**
```json
{
  "message": "Wishlist item rejected successfully"
}
```

**Status Codes:**
- 200: Wishlist item rejected successfully
- 400: Invalid wishlist ID, already processed, or invalid state
- 403: Forbidden (not a parent user)
- 404: Wishlist item not found