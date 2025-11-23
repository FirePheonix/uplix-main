'use client';

import { X, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

type MediaDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  media: {
    id: number;
    type: 'image' | 'video';
    url?: string;
    videoUrl?: string;
    title: string;
    userName: string;
    userAvatar: string;
    workspaceName: string;
    workspaceTemplateId: string;
  };
};

export default function MediaDetailsModal({ isOpen, onClose, media }: MediaDetailsModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleWorkspaceClick = () => {
    // Store the template ID in sessionStorage to load it on the generate page
    sessionStorage.setItem('loadTemplateId', media.workspaceTemplateId);
    router.push('/dashboard/generate');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-[#1a1a1a] rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden border border-white/10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Media Preview */}
          <div className="md:w-2/3 bg-black flex items-center justify-center p-8">
            {media.type === 'video' ? (
              <video
                src={media.videoUrl}
                controls
                autoPlay
                loop
                muted
                className="max-w-full max-h-[600px] rounded-lg"
              />
            ) : (
              <Image
                src={media.url!}
                alt={media.title}
                width={800}
                height={800}
                className="max-w-full max-h-[600px] object-contain rounded-lg"
              />
            )}
          </div>

          {/* Details Sidebar */}
          <div className="md:w-1/3 p-6 flex flex-col gap-6">
            {/* Title */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{media.title}</h2>
              <div className="h-px bg-gradient-to-r from-purple-500 to-transparent" />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                  {media.userName.charAt(0).toUpperCase()}
                </div>
                {media.userAvatar && (
                  <Image
                    src={media.userAvatar}
                    alt={media.userName}
                    width={48}
                    height={48}
                    className="absolute inset-0 w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-400">Created by</p>
                <p className="text-white font-semibold">{media.userName}</p>
              </div>
            </div>

            {/* Workspace Info */}
            <div className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5">
              <p className="text-xs text-gray-400 mb-2">Workspace Used</p>
              <button
                onClick={handleWorkspaceClick}
                className="w-full group"
              >
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-500/20 rounded-lg transition-all">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-white text-sm">🎬</span>
                    </div>
                    <span className="text-white font-medium">{media.workspaceName}</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Click to open this workflow template
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
                <p className="text-xs text-gray-400">Type</p>
                <p className="text-white font-semibold capitalize">{media.type}</p>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-3 border border-white/5">
                <p className="text-xs text-gray-400">Quality</p>
                <p className="text-white font-semibold">High</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-2">
              <button
                onClick={handleWorkspaceClick}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <span>Use This Workflow</span>
                <ExternalLink className="h-4 w-4" />
              </button>
              <button className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all border border-white/10">
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
