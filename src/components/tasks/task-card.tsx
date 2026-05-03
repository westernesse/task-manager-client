'use client'

import { Task } from '@/types'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, CheckCircle, Pin } from 'lucide-react'
import { useDeleteTask, useCompleteTask } from '@/hooks/use-tasks'
import { cn } from '@/lib/utils'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
}

export function TaskCard({ task, onEdit }: TaskCardProps) {
  const deleteTask = useDeleteTask()
  const completeTask = useCompleteTask()

  const handleDelete = async () => {
    if (!confirm('Delete this task?')) return
    await deleteTask.mutateAsync(task.id)
  }

  const handleComplete = async () => {
    await completeTask.mutateAsync(task.id)
  }

  return (
    <Card className={cn(task.completedAt && 'opacity-60')}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {task.isPinned && (
                <Pin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              )}
              <CardTitle className={cn(
                'text-base',
                task.completedAt && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </CardTitle>
            </div>

            {task.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {task.description}
              </CardDescription>
            )}

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {task.group && (
                <Badge variant="outline" className="text-xs">
                  <div
                    className="w-2 h-2 rounded-full mr-1"
                    style={{ backgroundColor: task.group.color ?? '#6366f1' }}
                  />
                  {task.group.name}
                </Badge>
              )}
              {task.status && (
                <Badge variant="secondary" className="text-xs">
                  {task.status.color && (
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: task.status.color }}
                    />
                  )}
                  {task.status.name}
                </Badge>
              )}
              {task.priority && (
                <Badge variant="outline" className="text-xs">
                  {task.priority.color && (
                    <div
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: task.priority.color }}
                    />
                  )}
                  {task.priority.name}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {!task.completedAt && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleComplete}
                disabled={completeTask.isPending}
              >
                <CheckCircle className="w-4 h-4 text-green-500" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(task)}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteTask.isPending}
            >
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}   