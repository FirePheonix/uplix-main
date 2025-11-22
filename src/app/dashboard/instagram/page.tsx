'use client';

import { useState, useEffect } from 'react';
import DashboardSidebar from '@/components/dashboard/sidebar';

interface InstagramAccount {
  username: string;
  userId: string;
  accessToken: string;
  expiresAt: number;
}

export default function InstagramPage() {
  const [instagramAccount, setInstagramAccount] = useState<InstagramAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postType, setPostType] = useState<'post' | 'reel'>('post');
  const [postText, setPostText] = useState('');
  const [postImage, setPostImage] = useState<File | null>(null);
  const [reelVideo, setReelVideo] = useState<File | null>(null);
  const [reelCover, setReelCover] = useState<File | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');

  useEffect(() => {
    // Check if we have data from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    if (encodedData) {
      try {
        const data = JSON.parse(decodeURIComponent(encodedData));
        localStorage.setItem('instagram_data', JSON.stringify(data));
        setInstagramAccount(data);
        // Clean URL
        window.history.replaceState({}, '', '/dashboard/instagram?success=true');
      } catch (error) {
        console.error('Error parsing Instagram data:', error);
      }
    }
    
    checkInstagramConnection();
  }, []);

  const checkInstagramConnection = async () => {
    try {
      const storedData = localStorage.getItem('instagram_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        // Check if token is expired
        if (Date.now() < data.expiresAt) {
          setInstagramAccount(data);
        } else {
          localStorage.removeItem('instagram_data');
        }
      }
    } catch (error) {
      console.error('Error checking Instagram connection:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectInstagram = () => {
    const clientId = '3354449318028891';
    const redirectUri = encodeURIComponent('http://localhost:3000/api/instagram/oauth-callback');
    const scope = 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement';
    
    // Use Facebook Login for Instagram Business API
    const authUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    
    window.location.href = authUrl;
  };

  const handleDisconnect = () => {
    localStorage.removeItem('instagram_data');
    setInstagramAccount(null);
    alert('Instagram account disconnected successfully');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPostImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReelVideo(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReelCover(file);
    }
  };

  const handleCreatePost = async () => {
    if (postType === 'post' && !postImage) {
      alert('Please select an image to post');
      return;
    }

    if (postType === 'reel' && !reelVideo) {
      alert('Please select a video for the reel');
      return;
    }

    try {
      setIsPosting(true);

      const formData = new FormData();
      formData.append('caption', postText);
      
      if (postType === 'post') {
        formData.append('file', postImage!);
        formData.append('type', 'post');
      } else {
        formData.append('file', reelVideo!);
        if (reelCover) {
          formData.append('cover', reelCover);
        }
        formData.append('type', 'reel');
      }

      // Get token from localStorage
      const instagramData = localStorage.getItem('instagram_data');
      if (!instagramData) {
        alert('Please reconnect your Instagram account');
        return;
      }

      const { accessToken, userId } = JSON.parse(instagramData);
      formData.append('accessToken', accessToken);
      formData.append('userId', userId);

      const endpoint = postType === 'post' ? '/api/instagram/create-post' : '/api/instagram/create-reel';
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `Failed to create ${postType}`);
      }

      const result = await response.json();
      alert(`${postType === 'post' ? 'Post' : 'Reel'} created successfully on Instagram!`);
      
      setPostText('');
      setPostImage(null);
      setReelVideo(null);
      setReelCover(null);
      setPreviewUrl('');
      setVideoPreviewUrl('');
      
    } catch (error: any) {
      console.error('Error creating content:', error);
      alert(error.message || `Failed to create ${postType}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto p-8">
          <h1 className="text-3xl font-bold mb-8">Instagram</h1>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
            </div>
          ) : !instagramAccount ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="mb-6">
                <svg className="w-24 h-24 mx-auto mb-4 text-purple-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <h2 className="text-2xl font-semibold mb-2">Connect Your Instagram Account</h2>
                <p className="text-muted-foreground mb-6">
                  Connect your Instagram Business account to create posts directly from here
                </p>
              </div>
              <button
                onClick={handleConnectInstagram}
                className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all"
              >
                Connect Instagram
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Connected Account Info */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {instagramAccount.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">@{instagramAccount.username}</h3>
                      <p className="text-sm text-muted-foreground">Connected</p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm rounded-xl transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>

              {/* Create Post/Reel */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">Create New Content</h2>
                
                <div className="space-y-4">
                  {/* Type Selector */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Content Type</label>
                    <div className="flex gap-4">
                      <button
                        onClick={() => setPostType('post')}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                          postType === 'post'
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-border hover:border-purple-500/50'
                        }`}
                      >
                        📸 Photo Post
                      </button>
                      <button
                        onClick={() => setPostType('reel')}
                        className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                          postType === 'reel'
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-border hover:border-purple-500/50'
                        }`}
                      >
                        🎬 Reel
                      </button>
                    </div>
                  </div>

                  {/* Media Upload */}
                  {postType === 'post' ? (
                    <div>
                      <label className="block text-sm font-medium mb-2">Image</label>
                      <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                      {previewUrl ? (
                        <div className="space-y-4">
                          <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-h-64 mx-auto rounded-lg"
                          />
                          <button
                            onClick={() => {
                              setPostImage(null);
                              setPreviewUrl('');
                            }}
                            className="text-sm text-red-500 hover:text-red-600"
                          >
                            Remove Image
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <div className="space-y-2">
                            <svg className="w-12 h-12 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-muted-foreground">Click to upload image</p>
                            <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                          </div>
                        </label>
                      )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Video Upload */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Video</label>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                          {videoPreviewUrl ? (
                            <div className="space-y-4">
                              <video
                                src={videoPreviewUrl}
                                controls
                                className="max-h-64 mx-auto rounded-lg"
                              />
                              <button
                                onClick={() => {
                                  setReelVideo(null);
                                  setVideoPreviewUrl('');
                                }}
                                className="text-sm text-red-500 hover:text-red-600"
                              >
                                Remove Video
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <input
                                type="file"
                                accept="video/*"
                                onChange={handleVideoChange}
                                className="hidden"
                              />
                              <div className="space-y-2">
                                <svg className="w-12 h-12 mx-auto text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                                <p className="text-muted-foreground">Click to upload video</p>
                                <p className="text-xs text-muted-foreground">MP4, MOV up to 100MB</p>
                              </div>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Cover Image (Optional) */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Cover Image (Optional)</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleCoverChange}
                          className="w-full px-4 py-2 bg-secondary border border-border rounded-xl"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Upload a custom thumbnail for your reel</p>
                      </div>
                    </div>
                  )}

                  {/* Caption */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Caption (Optional)</label>
                    <textarea
                      value={postText}
                      onChange={(e) => setPostText(e.target.value)}
                      placeholder="Write a caption for your post..."
                      className="w-full px-4 py-3 bg-secondary border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
                      maxLength={2200}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {postText.length} / 2200 characters
                    </p>
                  </div>

                  {/* Post Button */}
                  <button
                    onClick={handleCreatePost}
                    disabled={(postType === 'post' && !postImage) || (postType === 'reel' && !reelVideo) || isPosting}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPosting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Creating {postType === 'post' ? 'Post' : 'Reel'}...
                      </>
                    ) : (
                      <>{postType === 'post' ? '📸 Create Post' : '🎬 Create Reel'}</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
