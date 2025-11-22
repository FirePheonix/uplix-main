'use client'

import { useState } from 'react'
import DashboardSidebar from '@/components/dashboard/sidebar'
import { LayoutDashboard, Instagram, Twitter, Calendar, TrendingUp, Users, MessageSquare, Eye } from 'lucide-react'

export default function CRMPage() {
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
            <OverviewCard 
              title="Total Followers" 
              value="20.7K" 
              change="+12.5%" 
              icon={Users}
              color="text-blue-400"
            />
            <OverviewCard 
              title="Engagement Rate" 
              value="5.8%" 
              change="+2.3%" 
              icon={TrendingUp}
              color="text-green-400"
            />
            <OverviewCard 
              title="Total Views" 
              value="145.2K" 
              change="+18.7%" 
              icon={Eye}
              color="text-purple-400"
            />
            <OverviewCard 
              title="Messages" 
              value="234" 
              change="+5.2%" 
              icon={MessageSquare}
              color="text-pink-400"
            />
          </div>

          {/* Platform Performance */}
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">Platform Performance</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PlatformCard 
                platform="Instagram"
                icon={Instagram}
                color="bg-gradient-to-r from-purple-500 to-pink-500"
                followers="12.5K"
                engagement="4.8%"
                posts="127"
                growth="+15%"
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
          </div>

          {/* Unified Post Schedule */}
          <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Scheduled Posts - All Platforms</h2>
              <button className="px-4 py-2 bg-purple-500 rounded-lg font-medium hover:bg-purple-600 transition-colors">
                Schedule New Post
              </button>
            </div>

            <div className="space-y-4">
              <ScheduledPostItem 
                platform="Instagram"
                platformColor="text-pink-500"
                icon={Instagram}
                content="New collection dropping soon! 🔥"
                scheduledFor="Today at 6:00 PM"
                type="Post with image"
              />
              <ScheduledPostItem 
                platform="Twitter"
                platformColor="text-blue-400"
                icon={Twitter}
                content="Just launched our new feature! Check it out and let us know what you think 🚀"
                scheduledFor="Today at 10:00 AM"
                type="Tweet with media"
              />
              <ScheduledPostItem 
                platform="Instagram"
                platformColor="text-pink-500"
                icon={Instagram}
                content="Behind the scenes magic ✨"
                scheduledFor="Tomorrow at 3:00 PM"
                type="Story"
              />
              <ScheduledPostItem 
                platform="Twitter"
                platformColor="text-blue-400"
                icon={Twitter}
                content="Behind the scenes of our latest project. The team has been working hard! 💪✨"
                scheduledFor="Tomorrow at 2:00 PM"
                type="Tweet"
              />
            </div>
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
