import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagsApi } from '@/lib/api/tags'

export const TAGS_KEY = 'tags'

export function useTags() {
  return useQuery({
    queryKey: [TAGS_KEY],
    queryFn: tagsApi.getAll,
  })
}

export function useCreateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tagsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_KEY] })
    },
  })
}

export function useUpdateTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string; name?: string; color?: string }) =>
      tagsApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_KEY] })
    },
  })
}

export function useDeleteTag() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: tagsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TAGS_KEY] })
    },
  })
}

export function useAddTagToTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      tagsApi.addToTask(taskId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}

export function useRemoveTagFromTask() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, tagId }: { taskId: string; tagId: string }) =>
      tagsApi.removeFromTask(taskId, tagId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
    },
  })
}