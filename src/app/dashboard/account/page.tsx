'use client'

import DashboardSidebar from '@/components/dashboard/sidebar'
import { User } from 'lucide-react'

export default function AccountPage() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 mx-auto mb-4 text-violet-500" />
          <h1 className="text-3xl font-bold mb-2">My Account</h1>
          <p className="text-gray-400">Manage your account settings</p>
        </div>
      </div>
    </div>
  )
}
