export type User = {
  id: number
  username: string
  role: 'parent' | 'child'
  points: number
}

export type RememberedUser = {
  username: string
  timestamp: number
}

export type Task = {
  id: number
  description: string
  points: number
  child_id: number
  recurrence_type: 'single-use' | 'perpetual'
  parent_id: number
  is_marked_complete: boolean
}

export type Reward = {
  id: number
  description: string
  points: number
  parent_id: number
}

export type CreatedIdResponseBody = {
  message: string
  createdId: number
}

export type Log = {
  id?: number
  timestamp?: number
  actor_id: number
  actor_username?: string | null
  action_type: string
  recipient_id?: number | null
  recipient_username?: string | null
  points_before?: number | null
  points_after?: number | null
  additional_context?: string | null
}

// Response types for API endpoints
export type TaskResponse = {
  task: Task
}

export type TasksResponse = {
  tasks: Task[]
}

export type RewardsResponse = {
  rewards: Reward[]
}

export type UsersResponse = {
  users: User[]
}

export type UserResponse = {
  user: User
}

export type LogsResponse = {
  logs: Log[]
}

// Partial task for form handling
export type PartialTask = {
  description: string
  points: number | null
  recurrenceType: 'single-use' | 'perpetual'
}
