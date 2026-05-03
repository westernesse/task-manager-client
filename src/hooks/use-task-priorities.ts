import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskPrioritiesApi } from '@/lib/api/task-priorities'

export const TASK_PRIORITIES_KEY = 'task-priorities'

export function useTaskPriorities() {
  return useQuery({
    queryKey: [TASK_PRIORITIES_KEY],
    queryFn: taskPrioritiesApi.getAll,
  })
}

export function useCreateTaskPriority() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: taskPrioritiesApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_PRIORITIES_KEY] })
    },
  })
}

export function useUpdateTaskPriority() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof taskPrioritiesApi.update>[1]) =>
      taskPrioritiesApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_PRIORITIES_KEY] })
    },
  })
}

export function useDeleteTaskPriority() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: taskPrioritiesApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_PRIORITIES_KEY] })
    },
  })
}