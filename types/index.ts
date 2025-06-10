export type User = {
  id: number
  username: string
  role: 'parent' | 'child'
  points: number
}

export type Task = {
  id: number
  description: string
  points: number
  child_id: number
  completed: boolean
}

export type Reward = {
  id: number
  description: string
  points: number
  parent_id: number
}

export type WishlistItem = {
  id: number
  child_id: number
  description: string
  points?: number
  status: 'pending' | 'approved' | 'rejected'
}

export type CreatedIdResponseBody = {
  message: string
  createdId: number
}

// Response types for API endpoints
export type TasksResponse = {
  tasks: Task[]
}

export type RewardsResponse = {
  rewards: Reward[]
}

export type WishlistResponse = {
  wishlist: WishlistItem[]
}

export type UsersResponse = {
  users: User[]
}

export type Notification = {
  message: string
  type: string
}
