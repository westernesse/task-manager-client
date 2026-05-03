import { api } from '@/lib/api'
import { TaskGroup } from '@/types'

export const taskGroupsApi = {
  getAll: async (): Promise<TaskGroup[]> => {
    const { data } = await api.get('/task-groups')
    return data
  },

  getOne: async (id: string): Promise<TaskGroup> => {
    const { data } = await api.get(`/task-groups/${id}`)
    return data
  },

  create: async (dto: {
    name: string
    description?: string
    color?: string
    priorityId?: string
    orderIndex?: number
  }): Promise<TaskGroup> => {
    const { data } = await api.post('/task-groups', dto)
    return data
  },

  update: async (
    id: string,
    dto: Partial<{
      name: string
      description?: string
      color?: string
      priorityId?: string
      orderIndex?: number
    }>
  ): Promise<TaskGroup> => {
    const { data } = await api.patch(`/task-groups/${id}`, dto)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/task-groups/${id}`)
  },
}