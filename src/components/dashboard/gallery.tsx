'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import MediaDetailsModal from './media-details-modal'

interface DashboardGalleryProps {
  activeView: 'images' | 'styles' | 'videos'
}

type MediaItem = {
  id: number
  type: 'image' | 'video'
  url?: string
  videoUrl?: string
  title: string
  tall: boolean
  userName: string
  userAvatar: string
  workspaceName: string
  workspaceTemplateId: string
}

// Sample users for hardcoded data
const sampleUsers = [
  { name: 'Sarah Chen', avatar: '' },
  { name: 'Marcus Rivera', avatar: '' },
  { name: 'Emma Wilson', avatar: '' },
  { name: 'Alex Thompson', avatar: '' },
  { name: 'Priya Sharma', avatar: '' },
  { name: 'Jordan Lee', avatar: '' },
]

// Workflow templates mapping
const workflowTemplates = [
  { id: 'rotating-product-video', name: 'Rotating Product Video' },
  { id: 'brand-model-photoshoot', name: 'Brand Model Photoshoot' },
]

// Combined media items with user and workspace data
const allMedia: MediaItem[] = [
  // Images
  {
    id: 1,
    type: 'image',
    url: '/dashboard1.jpeg',
    title: 'Winter village in a bottle',
    tall: true,
    userName: sampleUsers[0].name,
    userAvatar: sampleUsers[0].avatar,
    workspaceName: workflowTemplates[0].name,
    workspaceTemplateId: workflowTemplates[0].id,
  },
  {
    id: 2,
    type: 'image',
    url: '/dashboard2.jpeg',
    title: 'Laptop coding',
    tall: false,
    userName: sampleUsers[1].name,
    userAvatar: sampleUsers[1].avatar,
    workspaceName: workflowTemplates[1].name,
    workspaceTemplateId: workflowTemplates[1].id,
  },
  {
    id: 3,
    type: 'image',
    url: '/dashboard3.jpeg',
    title: 'Carousel lights',
    tall: false,
    userName: sampleUsers[2].name,
    userAvatar: sampleUsers[2].avatar,
    workspaceName: workflowTemplates[0].name,
    workspaceTemplateId: workflowTemplates[0].id,
  },
  {
    id: 4,
    type: 'image',
    url: '/dashboard4.jpeg',
    title: 'Close-up eye',
    tall: true,
    userName: sampleUsers[3].name,
    userAvatar: sampleUsers[3].avatar,
    workspaceName: workflowTemplates[1].name,
    workspaceTemplateId: workflowTemplates[1].id,
  },
  {
    id: 5,
    type: 'image',
    url: '/dashboard5.jpeg',
    title: 'Fashion portrait',
    tall: true,
    userName: sampleUsers[4].name,
    userAvatar: sampleUsers[4].avatar,
    workspaceName: workflowTemplates[1].name,
    workspaceTemplateId: workflowTemplates[1].id,
  },
  {
    id: 6,
    type: 'image',
    url: '/dashboard6.jpeg',
    title: 'Pasta dish',
    tall: false,
    userName: sampleUsers[5].name,
    userAvatar: sampleUsers[5].avatar,
    workspaceName: workflowTemplates[0].name,
    workspaceTemplateId: workflowTemplates[0].id,
  },
  {
    id: 7,
    type: 'image',
    url: '/dashboard7.jpeg',
    title: 'Three animals',
    tall: false,
    userName: sampleUsers[0].name,
    userAvatar: sampleUsers[0].avatar,
    workspaceName: workflowTemplates[1].name,
    workspaceTemplateId: workflowTemplates[1].id,
  },
  {
    id: 8,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=350&fit=crop',
    title: 'Street fashion',
    tall: false,
    userName: sampleUsers[1].name,
    userAvatar: sampleUsers[1].avatar,
    workspaceName: workflowTemplates[0].name,
    workspaceTemplateId: workflowTemplates[0].id,
  },
  {
    id: 9,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&h=350&fit=crop',
    title: 'Cartoon illustration',
    tall: false,
    userName: sampleUsers[2].name,
    userAvatar: sampleUsers[2].avatar,
    workspaceName: workflowTemplates[1].name,
    workspaceTemplateId: workflowTemplates[1].id,
  },
  {
    id: 10,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=700&h=700&fit=crop',
    title: 'Black Friday text',
    tall: true,
    userName: sampleUsers[3].name,
    userAvatar: sampleUsers[3].avatar,
    workspaceName: workflowTemplates[0].name,
    workspaceTemplateId: workflowTemplates[0].id,
  },
  {
    id: 11,
    type: 'image',
    url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&h=700&fit=crop',
    title: 'Snowman',
    tall: true,
    userName: sampleUsers[4].name,
    userAvatar: sampleUsers[4].avatar,
    workspaceName: workflowTemplates[1].name,
    workspaceTemplateId: workflowTemplates[1].id,
  },
  // Videos
  {
    id: 100,
    type: 'video',
    videoUrl: '/1.mp4',
    title: 'Creative Video 1',
    tall: false,
    userName: sampleUsers[5].name,
    userAvatar: sampleUsers[5].avatar,
    workspaceName: workflowTemplates[0].name,
    workspaceTemplateId: workflowTemplates[0].id,
  },
  {
    id: 101,
    type: 'video',
    videoUrl: '/2.mp4',
    title: 'Creative Video 2',
    tall: true,
    userName: sampleUsers[0].name,
    userAvatar: sampleUsers[0].avatar,
    workspaceName: workflowTemplates[1].name,
    workspaceTemplateId: workflowTemplates[1].id,
  },
  {
    id: 102,
    type: 'video',
    videoUrl: '/3.mp4',
    title: 'Creative Video 3',
    tall: false,
    userName: sampleUsers[1].name,
    userAvatar: sampleUsers[1].avatar,
    workspaceName: workflowTemplates[0].name,
    workspaceTemplateId: workflowTemplates[0].id,
  },
  {
    id: 103,
    type: 'video',
    videoUrl: '/4.mp4',
    title: 'Creative Video 4',
    tall: true,
    userName: sampleUsers[2].name,
    userAvatar: sampleUsers[2].avatar,
    workspaceName: workflowTemplates[1].name,
    workspaceTemplateId: workflowTemplates[1].id,
  },
  {
    id: 104,
    type: 'video',
    videoUrl: '/5.mp4',
    title: 'Creative Video 5',
    tall: false,
    userName: sampleUsers[3].name,
    userAvatar: sampleUsers[3].avatar,
    workspaceName: workflowTemplates[0].name,
    workspaceTemplateId: workflowTemplates[0].id,
  },
  {
    id: 105,
    type: 'video',
    videoUrl: '/6.mp4',
    title: 'Creative Video 6',
    tall: true,
    userName: sampleUsers[4].name,
    userAvatar: sampleUsers[4].avatar,
    workspaceName: workflowTemplates[1].name,
    workspaceTemplateId: workflowTemplates[1].id,
  },
]

export default function DashboardGallery({ activeView }: DashboardGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  return (
    <>
      <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          {allMedia.map((item) => (
            item.type === 'video' ? (
              <VideoCard 
                key={item.id} 
                videoUrl={item.videoUrl!} 
                title={item.title} 
                tall={item.tall}
                onClick={() => setSelectedMedia(item)}
              />
            ) : (
              <ImageCard 
                key={item.id} 
                url={item.url!} 
                title={item.title} 
                tall={item.tall}
                onClick={() => setSelectedMedia(item)}
              />
            )
          ))}
        </div>
      </div>

      {selectedMedia && (
        <MediaDetailsModal
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          media={selectedMedia}
        />
      )}
    </>
  )
}

function ImageCard({ url, title, tall, onClick }: { url: string; title: string; tall: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative group cursor-pointer rounded-lg overflow-hidden break-inside-avoid mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <Image
        src={url}
        alt={title}
        width={500}
        height={tall ? 700 : 350}
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
          <div className="text-white">
            <p className="text-sm font-medium">{title}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function VideoCard({ videoUrl, title, tall, onClick }: { videoUrl: string; title: string; tall: boolean; onClick: () => void }) {
  const [isHovered, setIsHovered] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked by browser
      })
    }
  }, [])

  return (
    <div
      className="relative group cursor-pointer rounded-lg overflow-hidden break-inside-avoid mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        loop
        muted
        autoPlay
        playsInline
        className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
          <div className="text-white">
            <p className="text-sm font-medium">{title}</p>
          </div>
        </div>
      )}
    </div>
  )
}
