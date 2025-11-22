'use client'

import DashboardSidebar from '@/components/dashboard/sidebar'
import { MessageCircle } from 'lucide-react'

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageCircle className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
          <h1 className="text-3xl font-bold mb-2">Chat</h1>
          <p className="text-gray-400">Connect with the community</p>
        </div>
      </div>
    </div>
  )
}
