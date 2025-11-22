'use client'

import DashboardSidebar from '@/components/dashboard/sidebar'
import { Sparkles } from 'lucide-react'

export default function CreatePage() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-500" />
          <h1 className="text-3xl font-bold mb-2">Create</h1>
          <p className="text-gray-400">Start creating amazing content</p>
        </div>
      </div>
    </div>
  )
}
