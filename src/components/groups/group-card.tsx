'use client'

import { TaskGroup } from '@/types'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2 } from 'lucide-react'
import { useDeleteTaskGroup } from '@/hooks/use-task-groups'

interface GroupCardProps {
  group: TaskGroup
  onEdit: (group: TaskGroup) => void
}

export function GroupCard({ group, onEdit }: GroupCardProps) {
  const deleteGroup = useDeleteTaskGroup()

  const handleDelete = async () => {
    if (!confirm('Delete this group?')) return
    await deleteGroup.mutateAsync(group.id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full flex-shrink-0"
              style={{ backgroundColor: group.color ?? '#6366f1' }}
            />
            <div>
              <CardTitle className="text-base">{group.name}</CardTitle>
              {group.description && (
                <CardDescription className="mt-1">
                  {group.description}
                </CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {group._count && (
              <Badge variant="secondary">
                {group._count.tasks} tasks
              </Badge>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(group)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteGroup.isPending}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}