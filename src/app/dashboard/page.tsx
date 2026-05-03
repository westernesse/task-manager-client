'use client'

import { useTasks } from '@/hooks/use-tasks'
import { useTaskGroups } from '@/hooks/use-task-groups'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, FolderOpen, Clock, CheckCircle } from 'lucide-react'
import { TaskCard } from '@/components/tasks/task-card'
import { useState } from 'react'
import { Task } from '@/types'
import { TaskForm } from '@/components/tasks/task-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'

export default function DashboardPage() {
  const { data: tasks } = useTasks()
  const { data: groups } = useTaskGroups()
  const [editingTask, setEditingTask] = useState<Task | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const completedTasks = tasks?.filter((t) => t.completedAt) ?? []
  const pendingTasks = tasks?.filter((t) => !t.completedAt) ?? []
  const pinnedTasks = tasks?.filter((t) => t.isPinned && !t.completedAt) ?? []

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingTask(undefined)
  }

  const stats = [
    {
      title: 'Total Tasks',
      value: tasks?.length ?? 0,
      icon: CheckSquare,
      description: 'All tasks',
    },
    {
      title: 'Pending',
      value: pendingTasks.length,
      icon: Clock,
      description: 'Not completed',
    },
    {
      title: 'Completed',
      value: completedTasks.length,
      icon: CheckCircle,
      description: 'Done',
    },
    {
      title: 'Groups',
      value: groups?.length ?? 0,
      icon: FolderOpen,
      description: 'Task groups',
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back!</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pinned tasks */}
      {pinnedTasks.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Pinned Tasks</h2>
          {pinnedTasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Recent pending tasks */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Recent Tasks</h2>
        {pendingTasks.length === 0 ? (
          <p className="text-muted-foreground text-sm">No pending tasks!</p>
        ) : (
          pendingTasks.slice(0, 5).map((task) => (
            <TaskCard key={task.id} task={task} onEdit={handleEdit} />
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>Edit your task</DialogDescription>
          </DialogHeader>
          <TaskForm task={editingTask} onSuccess={handleCloseDialog} />
        </DialogContent>
      </Dialog>
    </div>
  )
}