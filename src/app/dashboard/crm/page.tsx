'use client'

import { useState, useEffect } from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
import { LayoutDashboard, Instagram, Twitter, Calendar, TrendingUp, Users, MessageSquare, Eye, Loader2, Clock, Image as ImageIcon, Video } from 'lucide-react'
import Image from 'next/image'

type ScheduledPost = {
  id: string
  media_url: string
  media_type: 'image' | 'video'
  caption: string
  schedule_time: string
  status: 'scheduled' | 'posted' | 'failed'
  created_at: string
  instagram_post_id?: string
  error_message?: string
}

type InstagramInsights = {
  followers: number
  followersGrowth: string
  engagement: number
  engagementGrowth: string
  totalViews: number
  viewsGrowth: string
  messages: number
  messagesGrowth: string
  mediaCount: number
  followingCount: number
  username: string
}

export default function CRMPage() {
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar'>('timeline')
  const [insights, setInsights] = useState<InstagramInsights | null>(null)
  const [insightsLoading, setInsightsLoading] = useState(true)

  useEffect(() => {
    fetchScheduledPosts()
    fetchInstagramInsights()
  }, [])

  const fetchInstagramInsights = async () => {
    try {
      setInsightsLoading(true)
      const instagramData = localStorage.getItem('instagram_data')
      
      if (!instagramData) {
        console.log('No Instagram credentials found in localStorage')
        setInsightsLoading(false)
        return
      }

      const credentials = JSON.parse(instagramData)
      console.log('Instagram credentials:', credentials)
      
      const response = await fetch('/api/instagram/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          accessToken: credentials.accessToken, 
          userId: credentials.userId,
          username: credentials.username 
        })
      })

      const data = await response.json()
      console.log('Insights response:', data)
      
      if (data.success) {
        setInsights(data.insights)
      } else {
        console.error('Insights error:', data.error)
      }
    } catch (error) {
      console.error('Error fetching Instagram insights:', error)
    } finally {
      setInsightsLoading(false)
    }
  }

  const fetchScheduledPosts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/scheduled-posts')
      const data = await response.json()
      
      if (data.success) {
        setScheduledPosts(data.scheduledPosts || [])
      }
    } catch (error) {
      console.error('Error fetching scheduled posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getCalendarDays = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    
    const days = []
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i)
      const postsOnDay = scheduledPosts.filter(post => {
        const postDate = new Date(post.schedule_time)
        return postDate.getDate() === i && 
               postDate.getMonth() === month && 
               postDate.getFullYear() === year
      })
      days.push({ day: i, posts: postsOnDay })
    }
    
    return days
  }
  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-[#1a1a1a] bg-[#0a0a0a] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-8 h-8 text-purple-500" />
              <h1 className="text-2xl font-bold">Social Media CRM</h1>
            </div>
            <div className="flex items-center gap-4">
              <select className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-3 py-2 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {insightsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-[#1a1a1a] rounded w-24 mb-3"></div>
                  <div className="h-8 bg-[#1a1a1a] rounded w-16 mb-2"></div>
                  <div className="h-3 bg-[#1a1a1a] rounded w-20"></div>
                </div>
              ))
            ) : insights ? (
              <>
                <OverviewCard 
                  title="Total Followers" 
                  value={insights.followers.toLocaleString()} 
                  change={insights.followersGrowth} 
                  icon={Users}
                  color="text-blue-400"
                />
                <OverviewCard 
                  title="Engagement Rate" 
                  value={`${insights.engagement}%`} 
                  change={insights.engagementGrowth} 
                  icon={TrendingUp}
                  color="text-green-400"
                />
                <OverviewCard 
                  title="Total Views" 
                  value={insights.totalViews.toLocaleString()} 
                  change={insights.viewsGrowth} 
                  icon={Eye}
                  color="text-purple-400"
                />
                <OverviewCard 
                  title="Messages" 
                  value={insights.messages.toString()} 
                  change={insights.messagesGrowth} 
                  icon={MessageSquare}
                  color="text-pink-400"
                />
              </>
            ) : (
              <div className="col-span-4 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6 text-center">
                <Instagram className="w-12 h-12 mx-auto mb-3 text-gray-600" />
                <p className="text-gray-400">Connect Instagram to see insights</p>
                <p className="text-sm text-gray-500 mt-1">Schedule a post from the Edit page to connect</p>
              </div>
            )}
          </div>

          {/* Platform Performance */}
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Platform Performance</h2>
            
            {insightsLoading ? (
              <div className="animate-pulse">
                <div className="h-32 bg-[#1a1a1a] rounded-lg"></div>
              </div>
            ) : insights ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PlatformCard 
                  platform="Instagram"
                  icon={Instagram}
                  color="bg-gradient-to-r from-purple-500 to-pink-500"
                  followers={insights.followers.toLocaleString()}
                  engagement={`${insights.engagement}%`}
                  posts={insights.mediaCount.toString()}
                  growth={insights.followersGrowth}
                />
                <PlatformCard 
                  platform="Twitter"
                  icon={Twitter}
                  color="bg-blue-500"
                  followers="8.2K"
                  engagement="6.2%"
                  posts="1,543"
                  growth="+8%"
                />
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No platform data available</p>
              </div>
            )}
          </div>

          {/* Scheduled Posts */}
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Scheduled Instagram Posts</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'timeline' ? 'bg-purple-500 text-white' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                  }`}
                >
                  Timeline
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    viewMode === 'calendar' ? 'bg-purple-500 text-white' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                  }`}
                >
                  Calendar
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : scheduledPosts.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400">No scheduled posts yet</p>
                <p className="text-sm text-gray-500 mt-1">Schedule posts from the Edit page</p>
              </div>
            ) : viewMode === 'timeline' ? (
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div key={post.id} className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      {post.media_type === 'video' ? (
                        <video src={post.media_url} className="w-full h-full object-cover" />
                      ) : (
                        <Image src={post.media_url} alt="Post" fill className="object-cover" />
                      )}
                      <div className="absolute top-1 right-1 bg-black/60 rounded px-1.5 py-0.5">
                        {post.media_type === 'video' ? (
                          <Video className="w-3 h-3 text-white" />
                        ) : (
                          <ImageIcon className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Instagram className="w-4 h-4 text-pink-500" />
                        <span className="text-sm font-medium text-pink-500">Instagram</span>
                        <span className="text-xs text-gray-500">·</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          post.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
                          post.status === 'posted' ? 'bg-green-500/20 text-green-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {post.status}
                        </span>
                      </div>
                      
                      <p className="text-sm mb-2 line-clamp-2">{post.caption}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(post.schedule_time)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if (confirm('Delete this scheduled post?')) {
                          // TODO: Implement delete
                        }
                      }}
                      className="text-sm text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <div className="text-center mb-4">
                  <h3 className="text-lg font-semibold">
                    {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="text-center text-sm text-gray-400 mb-2 font-medium">
                      {day}
                    </div>
                  ))}
                  
                  {getCalendarDays().map(({ day, posts }) => (
                    <div
                      key={day}
                      className={`
                        aspect-square rounded-lg flex flex-col items-center justify-center text-sm relative
                        ${posts.length > 0 
                          ? 'bg-purple-500/20 border-2 border-purple-500 text-white font-medium cursor-pointer hover:bg-purple-500/30' 
                          : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#222]'
                        }
                        transition-colors
                      `}
                      title={posts.length > 0 ? `${posts.length} scheduled post${posts.length > 1 ? 's' : ''}` : undefined}
                    >
                      <span>{day}</span>
                      {posts.length > 0 && (
                        <div className="absolute bottom-1 flex gap-0.5">
                          {posts.slice(0, 3).map((_, i) => (
                            <div key={i} className="w-1 h-1 rounded-full bg-purple-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Engagement Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Performing Posts */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Top Performing Posts</h2>
              
              <div className="space-y-4">
                <TopPost 
                  platform="Instagram"
                  platformIcon={Instagram}
                  content="Fashion photoshoot preview"
                  engagement="2.4K likes, 156 comments"
                  views="12.5K"
                />
                <TopPost 
                  platform="Twitter"
                  platformIcon={Twitter}
                  content="10 tips for better productivity..."
                  engagement="342 likes, 89 retweets"
                  views="8.3K"
                />
                <TopPost 
                  platform="Instagram"
                  platformIcon={Instagram}
                  content="Quick style tips - Reel"
                  engagement="5.4K likes, 234 comments"
                  views="45.2K"
                />
              </div>
            </div>

            {/* Recent Activity Feed */}
            <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
              
              <div className="space-y-4">
                <ActivityFeedItem 
                  platform="Instagram"
                  platformColor="bg-pink-500"
                  action="New follower"
                  content="@johndoe started following you"
                  time="5 min ago"
                />
                <ActivityFeedItem 
                  platform="Twitter"
                  platformColor="bg-blue-400"
                  action="Mention"
                  content="@sarahsmith mentioned you in a tweet"
                  time="15 min ago"
                />
                <ActivityFeedItem 
                  platform="Instagram"
                  platformColor="bg-pink-500"
                  action="Comment"
                  content="@techguru commented on your post"
                  time="1 hour ago"
                />
                <ActivityFeedItem 
                  platform="Twitter"
                  platformColor="bg-blue-400"
                  action="Retweet"
                  content="Your tweet was retweeted by @influencer"
                  time="2 hours ago"
                />
              </div>
            </div>
          </div>

          {/* Content Calendar */}
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Content Calendar</h2>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 bg-[#1a1a1a] rounded-lg text-sm hover:bg-[#222] transition-colors">
                  Week
                </button>
                <button className="px-3 py-1.5 bg-purple-500 rounded-lg text-sm">
                  Month
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-sm text-gray-400 mb-2">
                  {day}
                </div>
              ))}
              {Array.from({ length: 28 }, (_, i) => (
                <CalendarDay 
                  key={i} 
                  day={i + 1} 
                  hasPost={[3, 5, 8, 12, 15, 18, 22, 25].includes(i + 1)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OverviewCard({ title, value, change, icon: Icon, color }: any) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold mb-1">{value}</p>
      <p className="text-xs text-green-400">{change} from last period</p>
    </div>
  )
}

function PlatformCard({ platform, icon: Icon, color, followers, engagement, posts, growth }: any) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg">{platform}</h3>
          <span className="text-xs text-green-400">{growth} this month</span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-400">Followers</p>
          <p className="font-bold">{followers}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Engagement</p>
          <p className="font-bold">{engagement}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Posts</p>
          <p className="font-bold">{posts}</p>
        </div>
      </div>
    </div>
  )
}

function ScheduledPostItem({ platform, platformColor, icon: Icon, content, scheduledFor, type }: any) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#222] transition-colors">
      <Icon className={`w-5 h-5 ${platformColor} mt-1`} />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-sm font-medium ${platformColor}`}>{platform}</span>
          <span className="text-xs text-gray-500">·</span>
          <span className="text-xs text-gray-400">{type}</span>
        </div>
        <p className="text-sm mb-2">{content}</p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{scheduledFor}</span>
        </div>
      </div>
      <button className="text-sm text-purple-400 hover:text-purple-300">Edit</button>
    </div>
  )
}

function TopPost({ platform, platformIcon: Icon, content, engagement, views }: any) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
      <Icon className="w-5 h-5 text-gray-400 mt-1" />
      <div className="flex-1">
        <p className="text-sm font-medium mb-1">{content}</p>
        <p className="text-xs text-gray-400">{engagement}</p>
        <p className="text-xs text-gray-500">{views} views</p>
      </div>
    </div>
  )
}

function ActivityFeedItem({ platform, platformColor, action, content, time }: any) {
  return (
    <div className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded-lg">
      <div className={`w-2 h-2 ${platformColor} rounded-full mt-2`}></div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="text-gray-400">{platform}</span> · {action}
        </p>
        <p className="text-sm font-medium mt-1">{content}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  )
}

function CalendarDay({ day, hasPost }: { day: number; hasPost: boolean }) {
  return (
    <div className={`
      aspect-square rounded-lg flex items-center justify-center text-sm
      ${hasPost ? 'bg-purple-500/20 border border-purple-500 text-white font-medium' : 'bg-[#1a1a1a] text-gray-400'}
      hover:bg-[#222] transition-colors cursor-pointer
    `}>
      {day}
    </div>
  )
}
