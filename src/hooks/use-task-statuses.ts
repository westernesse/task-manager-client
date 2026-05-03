import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskStatusesApi } from '@/lib/api/task-statuses'

export const TASK_STATUSES_KEY = 'task-statuses'

export function useTaskStatuses() {
  return useQuery({
    queryKey: [TASK_STATUSES_KEY],
    queryFn: taskStatusesApi.getAll,
  })
}

export function useCreateTaskStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: taskStatusesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_STATUSES_KEY] })
    },
  })
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof taskStatusesApi.update>[1]) =>
      taskStatusesApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_STATUSES_KEY] })
    },
  })
}

export function useDeleteTaskStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: taskStatusesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_STATUSES_KEY] })
    },
  })
}