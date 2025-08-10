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
  task_type: 'throw-away' | 'perpetual'
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
  action_type: string
  recipient_id?: number | null
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
