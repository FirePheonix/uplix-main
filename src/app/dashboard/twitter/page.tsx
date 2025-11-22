'use client'

import { useState } from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
import { Twitter, Calendar, BarChart3, MessageSquare, Plus } from 'lucide-react'

export default function TwitterPage() {
  const [isConnected, setIsConnected] = useState(false)

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white">
      <DashboardSidebar />
      
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-[#1a1a1a] bg-[#0a0a0a] px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Twitter className="w-8 h-8 text-blue-400" />
              <h1 className="text-2xl font-bold">Twitter Management</h1>
            </div>
            {!isConnected && (
              <button 
                onClick={() => setIsConnected(true)}
                className="px-4 py-2 bg-blue-500 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Connect Twitter
              </button>
            )}
            {isConnected && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm text-gray-400">Connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {!isConnected ? (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
              <Twitter className="w-24 h-24 text-blue-400 mb-6" />
              <h2 className="text-3xl font-bold mb-4">Connect Your Twitter Account</h2>
              <p className="text-gray-400 text-center max-w-md mb-8">
                Connect your Twitter account to schedule tweets, manage conversations, and track engagement metrics all in one place.
              </p>
              <button 
                onClick={() => setIsConnected(true)}
                className="px-6 py-3 bg-blue-500 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Connect Twitter Account
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Total Tweets" value="1,543" icon={MessageSquare} />
                <StatCard title="Followers" value="8.2K" icon={BarChart3} />
                <StatCard title="Engagement" value="6.2%" icon={BarChart3} />
                <StatCard title="Scheduled" value="12" icon={Calendar} />
              </div>

              {/* Schedule Tweets Section */}
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Schedule Tweets</h2>
                  <button className="px-4 py-2 bg-blue-500 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    New Tweet
                  </button>
                </div>
                
                <div className="space-y-4">
                  <ScheduledTweet 
                    content="Just launched our new feature! Check it out and let us know what you think 🚀 #ProductLaunch #Tech"
                    scheduledFor="Today at 10:00 AM"
                    media={true}
                  />
                  <ScheduledTweet 
                    content="Behind the scenes of our latest project. The team has been working hard! 💪✨"
                    scheduledFor="Tomorrow at 2:00 PM"
                    media={false}
                  />
                  <ScheduledTweet 
                    content="Weekly tip: Stay consistent and engage with your audience regularly. Quality over quantity! 📈"
                    scheduledFor="Dec 24 at 9:00 AM"
                    media={false}
                  />
                </div>
              </div>

              {/* Twitter Management */}
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Content Management</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ManagementCard title="Tweets" count="1,543" />
                  <ManagementCard title="Threads" count="89" />
                  <ManagementCard title="Replies" count="432" />
                  <ManagementCard title="Drafts" count="7" />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Recent Activity</h2>
                
                <div className="space-y-4">
                  <ActivityItem 
                    action="Tweet posted"
                    content="Excited to announce our new partnership! 🎉"
                    time="1 hour ago"
                    engagement="156 likes, 23 retweets, 12 replies"
                  />
                  <ActivityItem 
                    action="Thread published"
                    content="10 tips for better productivity..."
                    time="4 hours ago"
                    engagement="342 likes, 89 retweets, 45 replies"
                  />
                  <ActivityItem 
                    action="Reply sent"
                    content="Thanks for the feedback! We're working on it."
                    time="6 hours ago"
                    engagement="23 likes"
                  />
                </div>
              </div>

              {/* Mentions & Interactions */}
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Recent Mentions</h2>
                
                <div className="space-y-4">
                  <MentionItem 
                    user="@johndoe"
                    content="This is amazing! @yourhandle you guys are doing great work! 🔥"
                    time="30 min ago"
                  />
                  <MentionItem 
                    user="@sarahsmith"
                    content="Can't wait to try this out @yourhandle!"
                    time="2 hours ago"
                  />
                  <MentionItem 
                    user="@techguru"
                    content="Impressed by the quality @yourhandle Keep it up! 💯"
                    time="5 hours ago"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

function ScheduledTweet({ content, scheduledFor, media }: { content: string; scheduledFor: string; media: boolean }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#222] transition-colors">
      <p className="text-sm mb-3">{content}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Calendar className="w-3 h-3" />
          <span>{scheduledFor}</span>
        </div>
        {media && (
          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">Has Media</span>
        )}
      </div>
    </div>
  )
}

function ManagementCard({ title, count }: { title: string; count: string }) {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4 hover:bg-[#222] transition-colors cursor-pointer">
      <p className="text-sm text-gray-400 mb-1">{title}</p>
      <p className="text-2xl font-bold">{count}</p>
    </div>
  )
}

function ActivityItem({ action, content, time, engagement }: { action: string; content: string; time: string; engagement: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-lg">
      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
      <div className="flex-1">
        <p className="font-medium">
          <span className="text-blue-400">{action}</span> · {content}
        </p>
        <p className="text-sm text-gray-400 mt-1">{engagement}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  )
}

function MentionItem({ user, content, time }: { user: string; content: string; time: string }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[#1a1a1a] rounded-lg">
      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
        <Twitter className="w-5 h-5 text-blue-400" />
      </div>
      <div className="flex-1">
        <p className="font-medium text-blue-400 mb-1">{user}</p>
        <p className="text-sm">{content}</p>
        <p className="text-xs text-gray-500 mt-2">{time}</p>
      </div>
      <button className="text-sm text-blue-400 hover:text-blue-300">Reply</button>
    </div>
  )
}
