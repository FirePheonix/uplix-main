'use client'

import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

interface DashboardGalleryProps {
  activeView: 'images' | 'styles' | 'videos'
}

// Images from the reference
const sampleImages = [
  {
    id: 1,
    url: '/dashboard1.jpeg',
    title: 'Winter village in a bottle',
    tall: true
  },
  {
    id: 2,
    url: '/dashboard2.jpeg',
    title: 'Laptop coding',
    tall: false
  },
  {
    id: 3,
    url: '/dashboard3.jpeg',
    title: 'Carousel lights',
    tall: false
  },
  {
    id: 4,
    url: '/dashboard4.jpeg',
    title: 'Close-up eye',
    tall: true
  },
  {
    id: 5,
    url: '/dashboard5.jpeg',
    title: 'Fashion portrait',
    tall: true
  },
  {
    id: 6,
    url: '/dashboard6.jpeg',
    title: 'Pasta dish',
    tall: false
  },
  {
    id: 7,
    url: '/dashboard7.jpeg',
    title: 'Three animals',
    tall: false
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=350&fit=crop',
    title: 'Street fashion',
    tall: false
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=500&h=350&fit=crop',
    title: 'Cartoon illustration',
    tall: false
  },
  {
    id: 10,
    url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=700&h=700&fit=crop',
    title: 'Black Friday text',
    tall: true
  },
  {
    id: 11,
    url: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=500&h=700&fit=crop',
    title: 'Snowman',
    tall: true
  },
]

// Videos with local files
const sampleVideos = [
  {
    id: 1,
    videoUrl: '/1.mp4',
    title: 'Creative Video 1',
    tall: false
  },
  {
    id: 2,
    videoUrl: '/2.mp4',
    title: 'Creative Video 2',
    tall: true
  },
  {
    id: 3,
    videoUrl: '/3.mp4',
    title: 'Creative Video 3',
    tall: false
  },
  {
    id: 4,
    videoUrl: '/4.mp4',
    title: 'Creative Video 4',
    tall: true
  },
  {
    id: 5,
    videoUrl: '/5.mp4',
    title: 'Creative Video 5',
    tall: false
  },
  {
    id: 6,
    videoUrl: '/6.mp4',
    title: 'Creative Video 6',
    tall: true
  },
]

export default function DashboardGallery({ activeView }: DashboardGalleryProps) {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
      {activeView === 'videos' ? (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {sampleVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          {sampleImages.map((image) => (
            <ImageCard key={image.id} {...image} />
          ))}
        </div>
      )}
    </div>
  )
}

function ImageCard({ url, title, tall }: { url: string; title: string; tall: boolean }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative group cursor-pointer rounded-lg overflow-hidden break-inside-avoid mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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

function VideoCard({ videoUrl, title, tall }: { videoUrl: string; title: string; tall: boolean }) {
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
