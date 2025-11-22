'use client'

import DashboardSidebar from '@/components/dashboard/sidebar'
import { Edit } from 'lucide-react'

export default function EditPage() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Edit className="w-16 h-16 mx-auto mb-4 text-blue-500" />
          <h1 className="text-3xl font-bold mb-2">Edit</h1>
          <p className="text-gray-400">Edit your creations</p>
        </div>
      </div>
    </div>
  )
}
