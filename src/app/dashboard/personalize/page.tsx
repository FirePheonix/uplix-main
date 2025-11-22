'use client'

import DashboardSidebar from '@/components/dashboard/sidebar'
import { Palette } from 'lucide-react'

export default function PersonalizePage() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Palette className="w-16 h-16 mx-auto mb-4 text-pink-500" />
          <h1 className="text-3xl font-bold mb-2">Personalize</h1>
          <p className="text-gray-400">Customize your experience</p>
        </div>
      </div>
    </div>
  )
}
