'use client'

import { useState } from 'react'
import { Task } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { useCreateTask, useUpdateTask } from '@/hooks/use-tasks'
import { useTaskGroups } from '@/hooks/use-task-groups'
import { useTaskStatuses } from '@/hooks/use-task-statuses'
import { useTaskPriorities } from '@/hooks/use-task-priorities'
import { useTags, useAddTagToTask, useRemoveTagFromTask } from '@/hooks/use-tags'
import { X } from 'lucide-react'

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
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    task?.tags?.map((t) => t.tag.id) ?? []
  )

  const { data: groups } = useTaskGroups()
  const { data: statuses } = useTaskStatuses()
  const { data: priorities } = useTaskPriorities()
  const { data: allTags } = useTags()

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const addTag = useAddTagToTask()
  const removeTag = useRemoveTagFromTask()

  const isLoading = createTask.isPending || updateTask.isPending

  const handleToggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    )
  }

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

    let savedTaskId: string

    if (task) {
      const updated = await updateTask.mutateAsync({ id: task.id, ...dto })
      savedTaskId = updated.id

      // синхронизируем теги
      const existingTagIds = task.tags?.map((t) => t.tag.id) ?? []
      const toAdd = selectedTagIds.filter((id) => !existingTagIds.includes(id))
      const toRemove = existingTagIds.filter((id) => !selectedTagIds.includes(id))

      await Promise.all([
        ...toAdd.map((tagId) => addTag.mutateAsync({ taskId: savedTaskId, tagId })),
        ...toRemove.map((tagId) => removeTag.mutateAsync({ taskId: savedTaskId, tagId })),
      ])
    } else {
      const created = await createTask.mutateAsync(dto)
      savedTaskId = created.id

      await Promise.all(
        selectedTagIds.map((tagId) => addTag.mutateAsync({ taskId: savedTaskId, tagId }))
      )
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
          <Select value={groupId || 'none'} onValueChange={(v) => setGroupId(v === 'none' ? '' : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No group</SelectItem>
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
          <Select value={statusId || 'none'} onValueChange={(v) => setStatusId(v === 'none' ? '' : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No status</SelectItem>
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
          <Select value={priorityId || 'none'} onValueChange={(v) => setPriorityId(v === 'none' ? '' : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No priority</SelectItem>
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

      {/* Tags */}
      {allTags && allTags.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Tags</label>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag) => {
              const isSelected = selectedTagIds.includes(tag.id)
              return (
                <Badge
                  key={tag.id}
                  variant={isSelected ? 'default' : 'outline'}
                  className="cursor-pointer select-none"
                  style={isSelected ? { backgroundColor: tag.color ?? '#6366f1' } : {}}
                  onClick={() => handleToggleTag(tag.id)}
                >
                  {isSelected && <X className="w-3 h-3 mr-1" />}
                  {tag.name}
                </Badge>
              )
            })}
          </div>
        </div>
      )}

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : task ? 'Update Task' : 'Create Task'}
      </Button>
    </form>
  )
}