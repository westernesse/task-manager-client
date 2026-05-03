import { api } from '@/lib/api'
import { TaskPriority } from '@/types'

export const taskPrioritiesApi = {
  getAll: async (): Promise<TaskPriority[]> => {
    const { data } = await api.get('/task-priorities')
    return data
  },

  create: async (dto: {
    name: string
    level: number
    color?: string
  }): Promise<TaskPriority> => {
    const { data } = await api.post('/task-priorities', dto)
    return data
  },

  update: async (id: string, dto: Partial<{
    name: string
    level: number
    color?: string
  }>): Promise<TaskPriority> => {
    const { data } = await api.patch(`/task-priorities/${id}`, dto)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/task-priorities/${id}`)
  },
}