import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { taskGroupsApi } from '@/lib/api/task-groups'

export const TASK_GROUPS_KEY = 'task-groups'

export function useTaskGroups() {
  return useQuery({
    queryKey: [TASK_GROUPS_KEY],
    queryFn: taskGroupsApi.getAll,
  })
}

export function useTaskGroup(id: string) {
  return useQuery({
    queryKey: [TASK_GROUPS_KEY, id],
    queryFn: () => taskGroupsApi.getOne(id),
    enabled: !!id,
  })
}

export function useCreateTaskGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: taskGroupsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_GROUPS_KEY] })
    },
  })
}

export function useUpdateTaskGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...dto }: { id: string } & Parameters<typeof taskGroupsApi.update>[1]) =>
      taskGroupsApi.update(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_GROUPS_KEY] })
    },
  })
}

export function useDeleteTaskGroup() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: taskGroupsApi.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [TASK_GROUPS_KEY] })
    },
  })
}