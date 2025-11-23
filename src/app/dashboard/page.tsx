'use client'

import { useState } from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
import DashboardGallery from '@/components/dashboard/gallery'
import DashboardHeader from '@/components/dashboard/header'

export default function DashboardPage() {
  const [activeView, setActiveView] = useState<'images' | 'styles' | 'videos'>('images')

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Sidebar */}
      <DashboardSidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <DashboardHeader activeView={activeView} setActiveView={setActiveView} />
        
        {/* Gallery */}
        <DashboardGallery activeView={activeView} />
      </div>
    </div>
  )
}
