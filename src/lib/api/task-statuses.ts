import { api } from '@/lib/api'
import { TaskStatus } from '@/types'

export const taskStatusesApi = {
  getAll: async (): Promise<TaskStatus[]> => {
    const { data } = await api.get('/task-statuses')
    return data
  },

  create: async (dto: {
    name: string
    color?: string
    isDefault?: boolean
    orderIndex?: number
  }): Promise<TaskStatus> => {
    const { data } = await api.post('/task-statuses', dto)
    return data
  },

  update: async (id: string, dto: Partial<{
    name: string
    color?: string
    isDefault?: boolean
    orderIndex?: number
  }>): Promise<TaskStatus> => {
    const { data } = await api.patch(`/task-statuses/${id}`, dto)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/task-statuses/${id}`)
  },
}