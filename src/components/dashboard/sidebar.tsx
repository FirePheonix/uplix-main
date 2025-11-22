'use client'

import { Compass, Sparkles, Edit, LayoutGrid, Instagram, Twitter, LayoutDashboard, MessageCircle, CheckSquare, CreditCard, CircleHelp, Bell, Moon, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { icon: Compass, label: 'Explore', href: '/dashboard' },
  { icon: Sparkles, label: 'Generate', href: '/dashboard/generate' },
  { icon: Edit, label: 'Edit', href: '/dashboard/edit' },
  { icon: LayoutGrid, label: 'Organize', href: '/dashboard/organize' },
]

const socialItems = [
  { icon: Instagram, label: 'Instagram', href: '/dashboard/instagram', badge: null },
  { icon: Twitter, label: 'Twitter', href: '/dashboard/twitter', badge: null },
  { icon: LayoutDashboard, label: 'CRM', href: '/dashboard/crm', badge: 'New!' },
]

const communityItems = [
  { icon: MessageCircle, label: 'Chat', href: '/dashboard/chat' },
  { icon: CheckSquare, label: 'Tasks', href: '/dashboard/tasks' },
  { icon: CreditCard, label: 'Subscribe', href: '/dashboard/subscribe' },
]

const bottomItems = [
  { icon: CircleHelp, label: 'Help', href: '#' },
  { icon: Bell, label: 'Updates', href: '#', badge: '3' },
  { icon: Moon, label: 'Dark Mode', href: '#' },
  { icon: User, label: 'My Account', href: '/dashboard/account' },
]

export default function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-[180px] bg-[#0f0f0f] border-r border-[#1a1a1a] flex flex-col">
      {/* Logo */}
      <div className="p-6 pb-8">
        <Link href="/">
          <h1 className="text-xl font-bold cursor-pointer hover:text-gray-300 transition-colors">Uplix</h1>
        </Link>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {menuItems.map((item) => (
          <MenuItem key={item.label} {...item} active={pathname === item.href} />
        ))}

        {/* Social Media Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs text-gray-500 uppercase tracking-wider mb-2">Social Media</h3>
          {socialItems.map((item) => (
            <MenuItem key={item.label} {...item} active={pathname === item.href} />
          ))}
        </div>

        {/* Community Section */}
        <div className="pt-6">
          <h3 className="px-3 text-xs text-gray-500 uppercase tracking-wider mb-2">Community</h3>
          {communityItems.map((item) => (
            <MenuItem key={item.label} {...item} active={pathname === item.href} />
          ))}
        </div>
      </nav>

      {/* Bottom Menu */}
      <div className="p-3 space-y-1 border-t border-[#1a1a1a]">
        {bottomItems.map((item) => (
          <MenuItem key={item.label} {...item} active={pathname === item.href} />
        ))}
      </div>
    </div>
  )
}

function MenuItem({ 
  icon: Icon, 
  label, 
  href,
  active = false, 
  badge = null 
}: { 
  icon: any
  label: string
  href: string
  active?: boolean
  badge?: string | null
}) {
  const content = (
    <>
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1 text-left truncate">{label}</span>
      {badge && (
        <span className={`
          text-xs px-1.5 py-0.5 rounded
          ${badge === 'New!' 
            ? 'bg-red-500 text-white' 
            : 'bg-red-500 text-white'
          }
        `}>
          {badge}
        </span>
      )}
    </>
  )

  if (href === '#') {
    return (
      <button
        className={`
          w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
          ${active 
            ? 'bg-[#ff4e50] text-white' 
            : 'text-gray-300 hover:bg-[#1a1a1a]'
          }
        `}
      >
        {content}
      </button>
    )
  }

  return (
    <Link
      href={href}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors
        ${active 
          ? 'bg-[#ff4e50] text-white' 
          : 'text-gray-300 hover:bg-[#1a1a1a]'
        }
      `}
    >
      {content}
    </Link>
  )
}
