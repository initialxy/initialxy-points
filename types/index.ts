export type User = {
  id: number
  username: string
  role: 'parent' | 'child'
  points: number
}

export type Task = {
  id: number
  title: string
  description?: string
  points: number
  child_id: number
  completed: boolean
}

export type Reward = {
  id: number
  title: string
  description?: string
  points: number
  parent_id: number
}

export type WishlistItem = {
  id: number
  reward_id: number
  child_id: number
  approved: boolean
  reward_title?: string
  reward_description?: string
  reward_points?: number
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
