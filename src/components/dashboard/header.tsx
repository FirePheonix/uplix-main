'use client'

import { Menu, Settings, Grid3x3, Image as ImageIcon, Video } from 'lucide-react'

interface DashboardHeaderProps {
  activeView: 'images' | 'styles' | 'videos'
  setActiveView: (view: 'images' | 'styles' | 'videos') => void
}

export default function DashboardHeader({ activeView, setActiveView }: DashboardHeaderProps) {
  return (
    <div className="border-b border-[#1a1a1a] bg-[#0a0a0a]">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-gray-400 text-sm">Subscribe to start creating...</span>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
            <Grid3x3 className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-8 px-6">
        <button
          onClick={() => setActiveView('images')}
          className={`
            flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
            ${activeView === 'images' 
              ? 'border-white text-white' 
              : 'border-transparent text-gray-400 hover:text-white'
            }
          `}
        >
          <span className="font-medium">Top Day</span>
        </button>
        <button
          onClick={() => setActiveView('styles')}
          className={`
            flex items-center gap-2 px-4 py-3 border-b-2 transition-colors
            ${activeView === 'styles' 
              ? 'border-white text-white' 
              : 'border-transparent text-gray-400 hover:text-white'
            }
          `}
        >
          <span className="font-medium">Likes</span>
        </button>

        <div className="ml-auto flex items-center gap-4">
          <button
            onClick={() => setActiveView('styles')}
            className={`
              p-2 rounded-lg transition-colors
              ${activeView === 'styles' 
                ? 'bg-[#1a1a1a] text-white' 
                : 'hover:bg-[#1a1a1a] text-gray-400'
              }
            `}
          >
            <Grid3x3 className="w-5 h-5" />
            <span className="sr-only">Styles</span>
          </button>
          <button
            onClick={() => setActiveView('images')}
            className={`
              p-2 rounded-lg transition-colors
              ${activeView === 'images' 
                ? 'bg-[#1a1a1a] text-white' 
                : 'hover:bg-[#1a1a1a] text-gray-400'
              }
            `}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="sr-only">Images</span>
          </button>
          <button
            onClick={() => setActiveView('videos')}
            className={`
              p-2 rounded-lg transition-colors
              ${activeView === 'videos' 
                ? 'bg-red-500 text-white' 
                : 'hover:bg-[#1a1a1a] text-gray-400'
              }
            `}
          >
            <Video className="w-5 h-5" />
            <span className="sr-only">Videos</span>
          </button>
        </div>
      </div>
    </div>
  )
}
