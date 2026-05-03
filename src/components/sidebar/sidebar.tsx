'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  CheckSquare,
  FolderOpen,
  Calendar,
  Tag,
  Settings,
  CircleDot,
  Flag,
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Tasks',
    href: '/dashboard/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Groups',
    href: '/dashboard/groups',
    icon: FolderOpen,
  },
  {
    title: 'Layouts',
    href: '/dashboard/layouts',
    icon: Calendar,
  },
  {
    title: 'Tags',
    href: '/dashboard/tags',
    icon: Tag,
  },
  {
    title: 'Statuses',
    href: '/dashboard/statuses',
    icon: CircleDot,
  },
  {
    title: 'Priorities',
    href: '/dashboard/priorities',
    icon: Flag,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-screen border-r flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-xl font-bold">Task Manager</h1>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* Bottom */}
      <div className="p-4">
        <Link
          href="/dashboard/settings"
          className={cn(
            'flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors',
            pathname === '/dashboard/settings'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
          )}
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  )
}