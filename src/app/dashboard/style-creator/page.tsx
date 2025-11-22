'use client'

import DashboardSidebar from '@/components/dashboard/sidebar'
import { Boxes } from 'lucide-react'

export default function StyleCreatorPage() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Boxes className="w-16 h-16 mx-auto mb-4 text-cyan-500" />
          <h1 className="text-3xl font-bold mb-2">Style Creator</h1>
          <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded mb-4">New!</span>
          <p className="text-gray-400">Create custom styles</p>
        </div>
      </div>
    </div>
  )
}
