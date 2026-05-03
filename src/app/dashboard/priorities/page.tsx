'use client'

import { useState } from 'react'
import { TaskPriority } from '@/types'
import { useTaskPriorities, useCreateTaskPriority, useUpdateTaskPriority, useDeleteTaskPriority } from '@/hooks/use-task-priorities'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

export default function PrioritiesPage() {
  const { data: priorities, isLoading } = useTaskPriorities()
  const createPriority = useCreateTaskPriority()
  const updatePriority = useUpdateTaskPriority()
  const deletePriority = useDeleteTaskPriority()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPriority, setEditingPriority] = useState<TaskPriority | undefined>()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [level, setLevel] = useState(0)

  const handleOpenCreate = () => {
    setEditingPriority(undefined)
    setName('')
    setColor('#6366f1')
    setLevel(priorities?.length ?? 0)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (priority: TaskPriority) => {
    setEditingPriority(priority)
    setName(priority.name)
    setColor(priority.color ?? '#6366f1')
    setLevel(priority.level)
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingPriority(undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingPriority) {
      await updatePriority.mutateAsync({ id: editingPriority.id, name, color, level })
    } else {
      await createPriority.mutateAsync({ name, color, level })
    }

    handleClose()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this priority?')) return
    await deletePriority.mutateAsync(id)
  }

  const isSaving = createPriority.isPending || updatePriority.isPending

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Priorities</h1>
          <p className="text-muted-foreground">Manage task priorities</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Priority
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : priorities?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No priorities yet. Create your first priority!
        </div>
      ) : (
        <div className="space-y-2">
          {priorities?.map((priority) => (
            <div
              key={priority.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: priority.color ?? '#6366f1' }}
                />
                <span className="font-medium">{priority.name}</span>
                <span className="text-xs text-muted-foreground">
                  Level: {priority.level}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenEdit(priority)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(priority.id)}
                  disabled={deletePriority.isPending}
                >
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPriority ? 'Edit Priority' : 'New Priority'}</DialogTitle>
            <DialogDescription>
              {editingPriority ? 'Edit your priority' : 'Create a new priority'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Priority name"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Level</label>
              <Input
                type="number"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                min={0}
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
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? 'Saving...' : editingPriority ? 'Update Priority' : 'Create Priority'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}