'use client'

import { useState } from 'react'
import { TaskGroup } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateTaskGroup, useUpdateTaskGroup } from '@/hooks/use-task-groups'

interface GroupFormProps {
  group?: TaskGroup
  onSuccess?: () => void
}

export function GroupForm({ group, onSuccess }: GroupFormProps) {
  const [name, setName] = useState(group?.name ?? '')
  const [description, setDescription] = useState(group?.description ?? '')
  const [color, setColor] = useState(group?.color ?? '#6366f1')

  const createGroup = useCreateTaskGroup()
  const updateGroup = useUpdateTaskGroup()

  const isLoading = createGroup.isPending || updateGroup.isPending

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) return

    if (group) {
      await updateGroup.mutateAsync({ id: group.id, name, description, color })
    } else {
      await createGroup.mutateAsync({ name, description, color })
    }

    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Group name"
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

      <div className="space-y-2">
        <label className="text-sm font-medium">Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded cursor-pointer border"
          />
          <span className="text-sm text-muted-foreground">{color}</span>
        </div>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Saving...' : group ? 'Update Group' : 'Create Group'}
      </Button>
    </form>
  )
}