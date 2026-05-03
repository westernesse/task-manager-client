import { api } from '@/lib/api'
import { Task } from '@/types'

export const tasksApi = {
  getAll: async (filters?: {
    groupId?: string
    statusId?: string
    priorityId?: string
    timeTypeId?: string
    isPinned?: boolean
    startFrom?: string
    startTo?: string
  }): Promise<Task[]> => {
    const { data } = await api.get('/tasks', { params: filters })
    return data
  },

  getOne: async (id: string): Promise<Task> => {
    const { data } = await api.get(`/tasks/${id}`)
    return data
  },

  create: async (dto: {
    title: string
    description?: string
    groupId?: string
    parentTaskId?: string
    startTime?: string
    endTime?: string
    statusId?: string
    priorityId?: string
    timeTypeId?: string
    isPinned?: boolean
    metadata?: Record<string, any>
  }): Promise<Task> => {
    const { data } = await api.post('/tasks', dto)
    return data
  },

  update: async (id: string, dto: Partial<{
    title: string
    description?: string
    groupId?: string
    startTime?: string
    endTime?: string
    statusId?: string
    priorityId?: string
    timeTypeId?: string
    isPinned?: boolean
    metadata?: Record<string, any>
  }>): Promise<Task> => {
    const { data } = await api.patch(`/tasks/${id}`, dto)
    return data
  },

  complete: async (id: string): Promise<Task> => {
    const { data } = await api.patch(`/tasks/${id}/complete`)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`)
  },
}