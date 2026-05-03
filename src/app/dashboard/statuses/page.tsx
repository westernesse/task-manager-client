'use client'

import { useState } from 'react'
import { TaskStatus } from '@/types'
import { useTaskStatuses, useCreateTaskStatus, useUpdateTaskStatus, useDeleteTaskStatus } from '@/hooks/use-task-statuses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Pencil, Trash2, Loader2, Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function StatusesPage() {
  const { data: statuses, isLoading } = useTaskStatuses()
  const createStatus = useCreateTaskStatus()
  const updateStatus = useUpdateTaskStatus()
  const deleteStatus = useDeleteTaskStatus()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStatus, setEditingStatus] = useState<TaskStatus | undefined>()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')
  const [isDefault, setIsDefault] = useState(false)
  const [orderIndex, setOrderIndex] = useState(0)

  const handleOpenCreate = () => {
    setEditingStatus(undefined)
    setName('')
    setColor('#6366f1')
    setIsDefault(false)
    setOrderIndex(statuses?.length ?? 0)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (status: TaskStatus) => {
    setEditingStatus(status)
    setName(status.name)
    setColor(status.color ?? '#6366f1')
    setIsDefault(status.isDefault)
    setOrderIndex(status.orderIndex)
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingStatus(undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingStatus) {
      await updateStatus.mutateAsync({ id: editingStatus.id, name, color, isDefault, orderIndex })
    } else {
      await createStatus.mutateAsync({ name, color, isDefault, orderIndex })
    }

    handleClose()
  }

  const handleDelete = async (status: TaskStatus) => {
    if (status.isDefault) return
    if (!confirm('Delete this status?')) return
    await deleteStatus.mutateAsync(status.id)
  }

  const isSaving = createStatus.isPending || updateStatus.isPending

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Statuses</h1>
          <p className="text-muted-foreground">Manage task statuses</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Status
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : statuses?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No statuses yet. Create your first status!
        </div>
      ) : (
        <div className="space-y-2">
          {statuses?.map((status) => (
            <div
              key={status.id}
              className="flex items-center justify-between border rounded-lg px-4 py-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: status.color ?? '#6366f1' }}
                />
                <span className="font-medium">{status.name}</span>
                {status.isDefault && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="w-3 h-3 mr-1" />
                    Default
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  Order: {status.orderIndex}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleOpenEdit(status)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(status)}
                  disabled={status.isDefault || deleteStatus.isPending}
                  className={cn(status.isDefault && 'opacity-30 cursor-not-allowed')}
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
            <DialogTitle>{editingStatus ? 'Edit Status' : 'New Status'}</DialogTitle>
            <DialogDescription>
              {editingStatus ? 'Edit your status' : 'Create a new status'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Status name"
                required
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
            <div className="space-y-2">
              <label className="text-sm font-medium">Order</label>
              <Input
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(Number(e.target.value))}
                min={0}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="isDefault" className="text-sm font-medium">
                Set as default status
              </label>
            </div>
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? 'Saving...' : editingStatus ? 'Update Status' : 'Create Status'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}