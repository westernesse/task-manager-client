'use client'

import { useState } from 'react'
import { Task } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks'
import { useTaskGroups } from '@/hooks/use-task-groups'
import { useTaskStatuses } from '@/hooks/use-task-statuses'
import { useTaskPriorities } from '@/hooks/use-task-priorities'

interface TaskFormProps {
  task?: Task
  onSuccess?: () => void
}

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [groupId, setGroupId] = useState(task?.groupId ?? '')
  const [statusId, setStatusId] = useState(task?.statusId ?? '')
  const [priorityId, setPriorityId] = useState(task?.priorityId ?? '')
  const [startTime, setStartTime] = useState(
    task?.startTime ? new Date(task.startTime).toISOString().slice(0, 16) : ''
  )
  const [endTime, setEndTime] = useState(
    task?.endTime ? new Date(task.endTime).toISOString().slice(0, 16) : ''
  )

  const { data: groups } = useTaskGroups()
  const { data: statuses } = useTaskStatuses()
  const { data: priorities } = useTaskPriorities()

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()

  const isLoading = createTask.isPending || updateTask.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const dto = {
      title,
      description: description || undefined,
      groupId: groupId || undefined,
      statusId: statusId || undefined,
      priorityId: priorityId || undefined,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
    }

    if (task) {
      await updateTask.mutateAsync({ id: task.id, ...dto })
    } else {
      await createTask.mutateAsync(dto)
    }

    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Group</label>
          <Select value={groupId} onValueChange={setGroupId}>
            <SelectTrigger>
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {groups?.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: group.color ?? '#6366f1' }}
                    />
                    {group.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={statusId} onValueChange={setStatusId}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses?.map((status) => (
                <SelectItem key={status.id} value={status.id}>
                  <div className="flex items-center gap-2">
                    {status.color && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: status.color }}
                      />
                    )}
                    {status.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Priority</label>
          <Select value={priorityId} onValueChange={setPriorityId}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities?.map((priority) => (
                <SelectItem key={priority.id} value={priority.id}>
                  <div className="flex items-center gap-2">
                    {priority.color && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: priority.color }}
                      />
                    )}
                    {priority.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Start Time</label>
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">End Time</label>
          <Input
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  )
}