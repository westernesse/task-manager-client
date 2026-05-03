'use client'

import { useState } from 'react'
import { Tag } from '@/types'
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '@/hooks/use-tags'
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
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react'

export default function TagsPage() {
  const { data: tags, isLoading } = useTags()
  const createTag = useCreateTag()
  const updateTag = useUpdateTag()
  const deleteTag = useDeleteTag()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | undefined>()
  const [name, setName] = useState('')
  const [color, setColor] = useState('#6366f1')

  const handleOpenCreate = () => {
    setEditingTag(undefined)
    setName('')
    setColor('#6366f1')
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (tag: Tag) => {
    setEditingTag(tag)
    setName(tag.name)
    setColor(tag.color ?? '#6366f1')
    setIsDialogOpen(true)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingTag(undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    if (editingTag) {
      await updateTag.mutateAsync({ id: editingTag.id, name, color })
    } else {
      await createTag.mutateAsync({ name, color })
    }

    handleClose()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this tag?')) return
    await deleteTag.mutateAsync(id)
  }

  const isLoading2 = createTag.isPending || updateTag.isPending

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tags</h1>
          <p className="text-muted-foreground">Manage your tags</p>
        </div>
        <Button onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-2" />
          New Tag
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : tags?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No tags yet. Create your first tag!
        </div>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags?.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 border rounded-lg px-3 py-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: tag.color ?? '#6366f1' }}
              />
              <span className="text-sm font-medium">{tag.name}</span>
              <Badge variant="secondary" className="text-xs">
                {tag._count.tasks}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => handleOpenEdit(tag)}
              >
                <Pencil className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6"
                onClick={() => handleDelete(tag.id)}
                disabled={deleteTag.isPending}
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
            <DialogDescription>
              {editingTag ? 'Edit your tag' : 'Create a new tag'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tag name"
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
            <Button type="submit" disabled={isLoading2} className="w-full">
              {isLoading2 ? 'Saving...' : editingTag ? 'Update Tag' : 'Create Tag'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}