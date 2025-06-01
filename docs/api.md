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
Retrieves tasks for the authenticated kid user.

**Response:**
```json
{
  "tasks": [
    {
      "id": "number",
      "title": "string",
      "description": "string",
      "points": "number",
      "completed": "boolean",
      "kid_id": "number"
    }
  ]
}
```

**Status Codes:**
- 200: Successful retrieval
- 403: Forbidden (not a kid user)

### POST /api/tasks
Creates a new task for a kid (parent-only endpoint).

**Request:**
```json
{
  "title": "string",
  "description": "string",
  "points": "number",
  "kid_id": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "description": "string",
  "points": "number",
  "completed": "boolean",
  "kid_id": "number"
}
```

**Status Codes:**
- 201: Task created successfully
- 400: Invalid input
- 403: Forbidden (not a parent user)

### POST /api/tasks/[id]/complete
Marks a task as completed by a kid user.

**Response:**
```json
{
  "message": "Task completed successfully",
  "pointsEarned": "number"
}
```

**Status Codes:**
- 200: Task completed successfully
- 400: Invalid task ID or task already completed
- 403: Forbidden (not a kid user)
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
      "title": "string",
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
  "title": "string",
  "description": "string",
  "points": "number"
}
```

**Response:**
```json
{
  "id": "number",
  "title": "string",
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
      "reward_title": "string",
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