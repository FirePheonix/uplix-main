'use client'

import DashboardSidebar from '@/components/dashboard/sidebar'
import { LayoutGrid } from 'lucide-react'

export default function OrganizePage() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <LayoutGrid className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h1 className="text-3xl font-bold mb-2">Organize</h1>
          <p className="text-gray-400">Organize your projects</p>
        </div>
      </div>
    </div>
  )
}
