export interface User {
  id: string
  email: string
  displayName?: string
  settings: Record<string, any>
  createdAt: string
}

export interface TaskPriority {
  id: string
  name: string
  level: number
  color?: string
}

export interface TaskStatus {
  id: string
  name: string
  color?: string
  isDefault: boolean
  orderIndex: number
}

export interface TaskGroup {
  id: string
  name: string
  description?: string
  color?: string
  orderIndex: number
  priority?: TaskPriority
  _count?: { tasks: number }
}

export interface Task {
  id: string
  title: string
  description?: string
  groupId?: string
  parentTaskId?: string
  startTime?: string
  endTime?: string
  statusId?: string
  priorityId?: string
  timeTypeId?: string
  isPinned: boolean
  metadata: Record<string, any>
  createdAt: string
  completedAt?: string
  group?: TaskGroup
  status?: TaskStatus
  priority?: TaskPriority
  timeType?: TaskTimeType
  subTasks?: Task[]
  tags?: { tag: Tag }[]
}

export interface TaskTimeType {
  id: string
  name: string
  durationUnit: 'specific' | 'day' | 'week' | 'month' | 'year'
}

export interface Tag {
  id: string
  name: string
  color?: string
}

export interface Layout {
  id: string
  name: string
  type: 'day' | 'week' | 'month' | 'year'
  config: Record<string, any>
  isDefault: boolean
}