import { api } from '@/lib/api'
import { Tag } from '@/types'

export const tagsApi = {
  getAll: async (): Promise<(Tag & { _count: { tasks: number } })[]> => {
    const { data } = await api.get('/tags')
    return data
  },

  create: async (dto: { name: string; color?: string }): Promise<Tag> => {
    const { data } = await api.post('/tags', dto)
    return data
  },

  update: async (id: string, dto: { name?: string; color?: string }): Promise<Tag> => {
    const { data } = await api.patch(`/tags/${id}`, dto)
    return data
  },

  remove: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`)
  },

  addToTask: async (taskId: string, tagId: string): Promise<void> => {
    await api.post(`/tags/task/${taskId}/${tagId}`)
  },

  removeFromTask: async (taskId: string, tagId: string): Promise<void> => {
    await api.delete(`/tags/task/${taskId}/${tagId}`)
  },
}