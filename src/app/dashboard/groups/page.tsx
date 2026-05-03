'use client'

import { useState } from 'react'
import { TaskGroup } from '@/types'
import { useTaskGroups } from '@/hooks/use-task-groups'
import { GroupCard } from '@/components/groups/group-card'
import { GroupForm } from '@/components/groups/group-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Plus, Loader2 } from 'lucide-react'

export default function GroupsPage() {
  const { data: groups, isLoading } = useTaskGroups()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGroup, setEditingGroup] = useState<TaskGroup | undefined>()

  const handleEdit = (group: TaskGroup) => {
    setEditingGroup(group)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingGroup(undefined)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Groups</h1>
          <p className="text-muted-foreground">Manage your task groups</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Group
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : groups?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No groups yet. Create your first group!
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups?.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingGroup ? 'Edit Group' : 'New Group'}
            </DialogTitle>
            <DialogDescription>
                {editingGroup ? 'Edit your task group' : 'Create a new task group'}
            </DialogDescription>
          </DialogHeader>
          <GroupForm
            group={editingGroup}
            onSuccess={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}