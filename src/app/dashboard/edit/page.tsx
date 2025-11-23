'use client'

import { useState, useEffect, useRef } from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
import { Edit, Loader2 } from 'lucide-react'
import Image from 'next/image'

type MediaItem = {
  id: string
  type: 'image' | 'video'
  url: string
  title: string
  width: number
  height: number
  createdAt: string
  format: string
  duration?: number
}

export default function EditPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMedia()
  }, [])

  const fetchMedia = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/cloudinary/get-media')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch media')
      }

      setMedia(data.media)
      setError(null)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching media:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Edit className="w-6 h-6 text-blue-500" />
            Edit Your Media
          </h1>
          <p className="text-gray-400 mt-1">All your AI-generated and uploaded content from Cloudinary</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-red-500 mb-2">Error: {error}</p>
                <button 
                  onClick={fetchMedia}
                  className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : media.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-gray-400">No media found in Cloudinary</p>
              </div>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {media.map((item) => (
                <MediaCard key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MediaCard({ item }: { item: MediaItem }) {
  const [isHovered, setIsHovered] = useState(false)
  const [showPostDialog, setShowPostDialog] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [generatedCaption, setGeneratedCaption] = useState('')
  const [generatingCaption, setGeneratingCaption] = useState(false)
  const [scheduleTime, setScheduleTime] = useState('')
  const [posting, setPosting] = useState(false)
  const [postResult, setPostResult] = useState<any>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const tall = item.height > item.width

  useEffect(() => {
    if (item.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked
      })
    }
  }, [item.type])

  const handleGenerateCaption = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt first')
      return
    }

    try {
      setGeneratingCaption(true)
      setPostResult(null)

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + process.env.NEXT_PUBLIC_OPENAI_API_KEY,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert social media manager specializing in Instagram content. Create engaging, authentic captions that drive engagement. Include relevant emojis and hashtags. Keep it concise and compelling.',
            },
            {
              role: 'user',
              content: `Create an Instagram caption for this post: ${prompt}`,
            },
          ],
          max_tokens: 500,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error?.message || 'Failed to generate caption')
      }

      const caption = data.choices[0].message.content
      setGeneratedCaption(caption)
      setPostResult({ success: true, message: 'Caption generated! Review it below and then post.' })
    } catch (error: any) {
      setPostResult({ error: error.message })
    } finally {
      setGeneratingCaption(false)
    }
  }

  const handlePostToInstagram = async () => {
    if (!generatedCaption) {
      alert('Please generate a caption first')
      return
    }

    try {
      setPosting(true)
      setPostResult(null)

      // Get Instagram credentials from localStorage
      const instagramData = localStorage.getItem('instagram_data')
      if (!instagramData) {
        throw new Error('Instagram not connected. Please connect your account in the Instagram page first.')
      }

      const { accessToken, userId } = JSON.parse(instagramData)

      // If scheduling, save to database
      if (scheduleTime) {
        const scheduleResponse = await fetch('/api/scheduled-posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mediaUrl: item.url,
            mediaType: item.type,
            caption: generatedCaption,
            scheduleTime,
            userId,
          }),
        })

        const scheduleData = await scheduleResponse.json()

        if (!scheduleResponse.ok) {
          throw new Error(scheduleData.error || 'Failed to schedule post')
        }

        setPostResult({
          success: true,
          scheduled: true,
          message: 'Post scheduled successfully! View it in the CRM page.',
        })

        setTimeout(() => {
          setShowPostDialog(false)
          setPrompt('')
          setGeneratedCaption('')
          setScheduleTime('')
        }, 2000)
        return
      }

      // Otherwise, post immediately
      const response = await fetch('/api/instagram/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaUrl: item.url,
          userPrompt: generatedCaption,
          scheduleTime: null,
          mediaType: item.type,
          accessToken,
          userId,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to post')
      }

      setPostResult(data)
      
      // Reset form after successful post
      if (data.success) {
        setTimeout(() => {
          setShowPostDialog(false)
          setPrompt('')
          setGeneratedCaption('')
          setScheduleTime('')
        }, 2000)
      }
    } catch (error: any) {
      setPostResult({ error: error.message })
    } finally {
      setPosting(false)
    }
  }

  return (
    <>
      <div
        className="relative group cursor-pointer rounded-lg overflow-hidden break-inside-avoid mb-4"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {item.type === 'video' ? (
          <video
            ref={videoRef}
            src={item.url}
            loop
            muted
            autoPlay
            playsInline
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <Image
            src={item.url}
            alt={item.title}
            width={item.width}
            height={item.height}
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
            <div className="text-white mb-2">
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-gray-300">{item.format.toUpperCase()}</p>
              {item.duration && (
                <p className="text-xs text-gray-300">{Math.round(item.duration)}s</p>
              )}
            </div>
            <button
              onClick={() => setShowPostDialog(true)}
              className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-md text-sm font-medium transition-all"
            >
              📸 Post to Instagram
            </button>
          </div>
        )}
      </div>

      {/* Post Dialog */}
      {showPostDialog && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 rounded-xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Post to Instagram</h3>
              <button
                onClick={() => setShowPostDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <div className="aspect-square rounded-lg overflow-hidden mb-4">
                {item.type === 'video' ? (
                  <video src={item.url} controls className="w-full h-full object-cover" />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.title}
                    width={400}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Caption Prompt (Tell AI what to write)
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Excited to share this amazing moment! Make it engaging and fun'"
                    className="w-full px-3 py-2 bg-gray-800 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>

                <button
                  onClick={handleGenerateCaption}
                  disabled={generatingCaption || !prompt.trim()}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-md font-medium transition-all"
                >
                  {generatingCaption ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating Caption...
                    </span>
                  ) : (
                    '✨ Generate Caption with AI'
                  )}
                </button>

                {generatedCaption && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Generated Caption (You can edit this)
                    </label>
                    <textarea
                      value={generatedCaption}
                      onChange={(e) => setGeneratedCaption(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={6}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Schedule Post (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduleTime}
                    onChange={(e) => setScheduleTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Leave empty to post immediately
                  </p>
                </div>

                {postResult && (
                  <div className={`p-3 rounded-md ${postResult.error ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                    {postResult.error ? (
                      <p>❌ {postResult.error}</p>
                    ) : postResult.scheduled ? (
                      <p>📅 {postResult.message}</p>
                    ) : (
                      <p>✅ {postResult.message}</p>
                    )}
                  </div>
                )}

                <button
                  onClick={handlePostToInstagram}
                  disabled={posting || !generatedCaption}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-600 rounded-md font-medium transition-all"
                >
                  {posting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {scheduleTime ? 'Scheduling...' : 'Posting...'}
                    </span>
                  ) : scheduleTime ? (
                    '📅 Schedule Post'
                  ) : (
                    '🚀 Post Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
