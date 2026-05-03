'use client'

import { useState } from 'react'
import { Task } from '@/types'
import { useTasks } from '@/hooks/use-tasks'
import { useTaskGroups } from '@/hooks/use-task-groups'
import { TaskCard } from '@/components/tasks/task-card'
import { TaskForm } from '@/components/tasks/task-form'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'

export default function TasksPage() {
  const [groupFilter, setGroupFilter] = useState<string | undefined>(undefined)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const { data: tasks, isLoading } = useTasks(
    groupFilter ? { groupId: groupFilter } : undefined
  )
  const { data: groups } = useTaskGroups()

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTask(undefined)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-muted-foreground">Manage your tasks</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select 
        value={groupFilter ?? 'all'} 
        onValueChange={(val) => setGroupFilter(val === 'all' ? undefined : val)}
        >
        <SelectTrigger className="w-48">
            <SelectValue placeholder="All groups" />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All groups</SelectItem>
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

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : tasks?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No tasks yet. Create your first task!
        </div>
      ) : (
        <div className="space-y-3">
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? 'Edit Task' : 'New Task'}
            </DialogTitle>
            <DialogDescription>
              {editingTask ? 'Edit your task' : 'Create a new task'}
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            task={editingTask}
            onSuccess={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}