'use client';

import { useState, useCallback, memo, ChangeEvent } from 'react';
import {
  ReactFlow,
  Controls as FlowControls,
  Background,
  Panel,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  ReactFlowProvider,
  useReactFlow,
  NodeProps,
  useNodeConnections,
  getIncomers,
} from '@xyflow/react';
// @ts-ignore - CSS import
import '@xyflow/react/dist/style.css';
import DashboardSidebar from '@/components/dashboard/sidebar';

// Type definitions
interface TextNodeData extends Record<string, unknown> {
  text?: string;
}

interface ImageNodeData extends Record<string, unknown> {
  content?: {
    url: string;
    type: string;
  };
  generated?: {
    url: string;
    type: string;
  };
  model?: string;
  size?: string;
  quality?: string;
  instructions?: string;
}

interface VideoNodeData extends Record<string, unknown> {
  content?: {
    url: string;
    type: string;
  };
  generated?: {
    url: string;
    type: string;
  };
  model?: string;
  size?: string;
  seconds?: number;
  instructions?: string;
}

interface AudioNodeData extends Record<string, unknown> {
  content?: {
    url: string;
    type: string;
  };
  generated?: {
    url: string;
    type: string;
  };
  voice?: string;
  instructions?: string;
}

interface AppenderNodeData extends Record<string, unknown> {
  merged?: {
    url: string;
    type: string;
  };
  transition?: string;
}

type TextNodeType = Node<TextNodeData>;
type ImageNodeType = Node<ImageNodeData>;
type VideoNodeType = Node<VideoNodeData>;
type AudioNodeType = Node<AudioNodeData>;
type AppenderNodeType = Node<AppenderNodeData>;

// Text Node Component (Tersa Style)
const TextNodeComponent = memo(({ data, id }: NodeProps<TextNodeType>) => {
  const { updateNodeData } = useReactFlow();

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { text: e.target.value });
  }, [id, updateNodeData]);

  return (
    <div className="bg-background border border-border rounded-3xl shadow-sm min-w-[280px] overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-sm font-medium">Text</span>
        </div>
      </div>
      <div className="p-4">
        <textarea
          value={data.text || ''}
          onChange={handleChange}
          placeholder="Enter your prompt..."
          className="w-full min-h-[120px] bg-transparent border-none resize-none focus:outline-none text-sm text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-blue-500 !border-2 !border-background"
      />
    </div>
  );
});
TextNodeComponent.displayName = 'TextNode';

// Image Primitive Component (Upload Mode - No Incoming Connections)
const ImagePrimitive = memo(({ data, id }: NodeProps<ImageNodeType>) => {
  const { updateNodeData } = useReactFlow();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const { url } = await uploadRes.json();
      updateNodeData(id, { content: { url, type: 'image' } });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [id, updateNodeData]);

  return (
    <div className="bg-background border border-border rounded-3xl shadow-sm min-w-[320px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />

      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-sm font-medium">Image</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {!data.content?.url && (
          <label className="block">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
            <div className="w-full h-32 flex items-center justify-center bg-secondary hover:bg-secondary/80 border-2 border-dashed border-border rounded-xl cursor-pointer transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📁</div>
                <div className="text-sm text-muted-foreground">
                  {isUploading ? 'Uploading...' : 'Click to upload'}
                </div>
              </div>
            </div>
          </label>
        )}

        {data.content?.url && (
          <div className="relative rounded-xl overflow-hidden border border-border max-w-[280px]">
            <img
              src={data.content.url}
              alt="Uploaded"
              className="w-full h-auto max-h-[280px] object-cover"
            />
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />
    </div>
  );
});
ImagePrimitive.displayName = 'ImagePrimitive';

// Image Transform Component (Generate Mode - Has Incoming Connections)
const ImageTransform = memo(({ data, id }: NodeProps<ImageNodeType>) => {
  const { updateNodeData, getNodes, getEdges } = useReactFlow();
  const [isGenerating, setIsGenerating] = useState(false);

  const model = data.model || 'gpt-image-1';
  const size = data.size || '1024x1024';
  const quality = data.quality || 'auto';

  const handleModelChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(id, { model: e.target.value });
  }, [id, updateNodeData]);

  const handleSizeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(id, { size: e.target.value });
  }, [id, updateNodeData]);

  const handleQualityChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(id, { quality: e.target.value });
  }, [id, updateNodeData]);

  const handleInstructionsChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { instructions: e.target.value });
  }, [id, updateNodeData]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const nodes = getNodes();
      const edges = getEdges();
      
      // Get incoming nodes
      const incomers = getIncomers({ id }, nodes, edges);
      
      // Extract text prompts
      const textPrompts = incomers
        .filter((node) => node.type === 'textNode')
        .map((node) => node.data.text)
        .filter(Boolean);

      // Extract reference images
      const referenceImages = incomers
        .filter((node) => {
          const imageData = node.data as ImageNodeData;
          return node.type === 'imageNode' && (imageData.content?.url || imageData.generated?.url);
        })
        .map((node) => {
          const imageData = node.data as ImageNodeData;
          return imageData.content?.url || imageData.generated?.url;
        });

      // Convert reference images to base64
      const base64References = await Promise.all(
        referenceImages.map(async (url) => {
          try {
            const res = await fetch('/api/convert-to-base64', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrl: url }),
            });
            if (!res.ok) throw new Error('Conversion failed');
            const { base64 } = await res.json();
            return base64;
          } catch (error) {
            console.error('Failed to convert image:', url, error);
            return null;
          }
        })
      );

      const validBase64References = base64References.filter(Boolean);

      const prompt = textPrompts.join(' ');
      if (!prompt && validBase64References.length === 0) {
        alert('Please connect a text node or image node first');
        return;
      }

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          model,
          size,
          quality,
          instructions: data.instructions || '',
          referenceImages: validBase64References,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const { imageUrl } = await response.json();
      updateNodeData(id, { generated: { url: imageUrl, type: 'image' } });
    } catch (error: any) {
      console.error('Generation error:', error);
      alert(`Failed to generate image: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [id, model, size, quality, data.instructions, getNodes, getEdges, updateNodeData]);

  const connections = useNodeConnections({ id, handleType: 'target' });

  return (
    <div className="bg-background border border-border rounded-3xl shadow-sm min-w-[320px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />

      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-sm font-medium">Image</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Model Selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Model</label>
          <select
            value={model}
            onChange={handleModelChange}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="gpt-image-1">GPT Image 1</option>
            <option value="dall-e-3">DALL-E 3</option>
            <option value="dall-e-2">DALL-E 2</option>
          </select>
        </div>

        {/* Size Selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Size</label>
          <select
            value={size}
            onChange={handleSizeChange}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="1024x1024">Square (1024x1024)</option>
            {model !== 'dall-e-2' && (
              <>
                <option value="1024x1536">Portrait (1024x1536)</option>
                <option value="1536x1024">Landscape (1536x1024)</option>
              </>
            )}
          </select>
        </div>

        {/* Quality Selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Quality</label>
          <select
            value={quality}
            onChange={handleQualityChange}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="auto">Auto</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Instructions */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">
            Instructions (Optional)
          </label>
          <textarea
            value={data.instructions || ''}
            onChange={handleInstructionsChange}
            placeholder="Additional instructions..."
            className="w-full min-h-[60px] px-3 py-2 text-sm bg-secondary border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Reference Indicator */}
        {connections.length > 0 && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            📎 {connections.length} reference{connections.length > 1 ? 's' : ''} connected
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-4 py-2 text-sm bg-purple-500 hover:bg-purple-600 text-white rounded-xl transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Generating...' : data.generated?.url ? 'Regenerate' : 'Generate Image'}
        </button>

        {/* Image Display */}
        {data.generated?.url && (
          <div className="relative rounded-xl overflow-hidden border border-border max-w-[280px]">
            <img
              src={data.generated.url}
              alt="Generated"
              className="w-full h-auto max-h-[280px] object-cover"
            />
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-purple-500 !border-2 !border-background"
      />
    </div>
  );
});
ImageTransform.displayName = 'ImageTransform';

// Main Image Node Component (Switches between Primitive and Transform)
const ImageNodeComponent = memo((props: NodeProps<ImageNodeType>) => {
  const connections = useNodeConnections({
    id: props.id,
    handleType: 'target',
  });
  
  const Component = connections.length ? ImageTransform : ImagePrimitive;
  return <Component {...props} />;
});
ImageNodeComponent.displayName = 'ImageNode';

// Video Primitive Component (Upload Mode - No Incoming Connections)
const VideoPrimitive = memo(({ data, id }: NodeProps<VideoNodeType>) => {
  const { updateNodeData } = useReactFlow();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadRes = await fetch('/api/upload-video', {
        method: 'POST',
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      const { url } = await uploadRes.json();
      updateNodeData(id, { content: { url, type: 'video' } });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload video');
    } finally {
      setIsUploading(false);
    }
  }, [id, updateNodeData]);

  return (
    <div className="bg-background border border-border rounded-3xl shadow-sm min-w-[320px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-background"
      />

      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium">Video</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {!data.content?.url && (
          <label className="block">
            <input
              type="file"
              accept="video/*"
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
            <div className="w-full h-32 flex items-center justify-center bg-secondary hover:bg-secondary/80 border-2 border-dashed border-border rounded-xl cursor-pointer transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">🎬</div>
                <div className="text-sm text-muted-foreground">
                  {isUploading ? 'Uploading...' : 'Click to upload'}
                </div>
              </div>
            </div>
          </label>
        )}

        {data.content?.url && (
          <div className="relative rounded-xl overflow-hidden border border-border">
            <video
              src={data.content.url}
              className="w-full h-auto object-contain"
              autoPlay
              muted
              loop
              style={{ maxWidth: '400px', maxHeight: '300px' }}
            />
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-background"
      />
    </div>
  );
});
VideoPrimitive.displayName = 'VideoPrimitive';

// Video Transform Component (Generate Mode - Has Incoming Connections)
const VideoTransform = memo(({ data, id }: NodeProps<VideoNodeType>) => {
  const { updateNodeData, getNodes, getEdges } = useReactFlow();
  const [isGenerating, setIsGenerating] = useState(false);

  const model = data.model || 'sora-2';
  const size = data.size || '1280x720';
  const seconds = data.seconds || 8;

  const handleModelChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(id, { model: e.target.value });
  }, [id, updateNodeData]);

  const handleSizeChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(id, { size: e.target.value });
  }, [id, updateNodeData]);

  const handleSecondsChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    let value = parseInt(e.target.value);
    // For Kling, ensure only 5 or 10 seconds
    if (model.startsWith('kling') && value !== 5 && value !== 10) {
      value = 5;
    }
    updateNodeData(id, { seconds: value });
  }, [id, updateNodeData, model]);

  const handleInstructionsChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { instructions: e.target.value });
  }, [id, updateNodeData]);

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const nodes = getNodes();
      const edges = getEdges();
      
      // Get incoming nodes
      const incomers = getIncomers({ id }, nodes, edges);
      
      // Extract text prompts
      const textPrompts = incomers
        .filter((node) => node.type === 'textNode')
        .map((node) => node.data.text)
        .filter(Boolean);

      // Extract reference images (for input_reference)
      const referenceImages = incomers
        .filter((node) => {
          const imageData = node.data as ImageNodeData;
          return node.type === 'imageNode' && (imageData.content?.url || imageData.generated?.url);
        })
        .map((node) => {
          const imageData = node.data as ImageNodeData;
          return imageData.content?.url || imageData.generated?.url;
        });

      const prompt = textPrompts.join(' ');

      // Kling models require an image reference
      if (model.startsWith('kling')) {
        if (referenceImages.length === 0) {
          alert('Kling models require an image reference. Please connect an image node first.');
          return;
        }

        // Convert image to base64 for Kling
        let imageReference = null;
        try {
          const res = await fetch('/api/convert-to-base64', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: referenceImages[0] }),
          });
          if (res.ok) {
            const { base64 } = await res.json();
            imageReference = base64;
          }
        } catch (error) {
          console.error('Failed to convert image:', error);
          alert('Failed to process reference image');
          return;
        }

        const response = await fetch('/api/generate-video-kling', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            instructions: data.instructions || '',
            imageReference,
            duration: seconds,
            model,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Generation failed');
        }

        const { videoUrl } = await response.json();
        updateNodeData(id, { generated: { url: videoUrl, type: 'video' } });
      } else {
        // Sora models
        if (!prompt && referenceImages.length === 0) {
          alert('Please connect a text node or image node first');
          return;
        }

        // Convert first reference image to base64 for Sora input_reference
        let inputReference = null;
        if (referenceImages.length > 0) {
          try {
            const res = await fetch('/api/convert-to-base64', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ imageUrl: referenceImages[0] }),
            });
            if (res.ok) {
              const { base64 } = await res.json();
              inputReference = base64;
            }
          } catch (error) {
            console.error('Failed to convert image:', error);
          }
        }

        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            model,
            size,
            seconds,
            instructions: data.instructions || '',
            inputReference,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Generation failed');
        }

        const { videoUrl } = await response.json();
        updateNodeData(id, { generated: { url: videoUrl, type: 'video' } });
      }
    } catch (error: any) {
      console.error('Generation error:', error);
      alert(`Failed to generate video: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  }, [id, model, size, seconds, data.instructions, getNodes, getEdges, updateNodeData]);

  const connections = useNodeConnections({ id, handleType: 'target' });

  return (
    <div className="bg-background border border-border rounded-3xl shadow-sm min-w-[320px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-background"
      />

      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium">Video</span>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Model Selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Model</label>
          <select
            value={model}
            onChange={handleModelChange}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <optgroup label="Sora (OpenAI)">
              <option value="sora-2">Sora 2 (Fast)</option>
              <option value="sora-2-pro">Sora 2 Pro (High Quality)</option>
            </optgroup>
            <optgroup label="Kling (AI/ML API)">
              <option value="kling-video/v2.1/standard/image-to-video">Kling v2.1 Standard (Image Required)</option>
              <option value="kling-video/v2.1/pro/image-to-video">Kling v2.1 Pro (Image Required)</option>
            </optgroup>
          </select>
        </div>

        {/* Size Selector - Only for Sora models */}
        {!model.startsWith('kling') && (
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">Size</label>
            <select
              value={size}
              onChange={handleSizeChange}
              className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="1280x720">720p (1280x720)</option>
              <option value="1920x1080">1080p (1920x1080)</option>
            </select>
          </div>
        )}

        {/* Duration Selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Duration</label>
          <select
            value={seconds}
            onChange={handleSecondsChange}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {model.startsWith('kling') ? (
              <>
                <option value="5">5 seconds</option>
                <option value="10">10 seconds</option>
              </>
            ) : (
              <>
                <option value="4">4 seconds</option>
                <option value="8">8 seconds</option>
                <option value="12">12 seconds</option>
              </>
            )}
          </select>
        </div>

        {/* Instructions */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">
            Instructions (Optional)
          </label>
          <textarea
            value={data.instructions || ''}
            onChange={handleInstructionsChange}
            placeholder="Additional instructions..."
            className="w-full min-h-[60px] px-3 py-2 text-sm bg-secondary border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Reference Indicator */}
        {connections.length > 0 && (
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            📎 {connections.length} reference{connections.length > 1 ? 's' : ''} connected
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-xl transition-colors disabled:opacity-50"
        >
          {isGenerating ? 'Generating Video...' : data.generated?.url ? 'Regenerate' : 'Generate Video'}
        </button>

        {/* Video Display */}
        {data.generated?.url && (
          <div className="space-y-2">
            <div className="relative rounded-xl overflow-hidden border border-border">
              <video
                src={data.generated?.url}
                className="w-full h-auto object-contain"
                autoPlay
                muted
                loop
                playsInline
                style={{ maxWidth: '400px', maxHeight: '300px' }}
              />
            </div>
            <button
              onClick={() => {
                if (!data.generated?.url) return;
                const link = document.createElement('a');
                link.href = data.generated.url;
                link.download = `video-${id}.mp4`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full px-3 py-2 text-xs bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Video
            </button>
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-green-500 !border-2 !border-background"
      />
    </div>
  );
});
VideoTransform.displayName = 'VideoTransform';

// Main Video Node Component (Switches between Primitive and Transform)
const VideoNodeComponent = memo((props: NodeProps<VideoNodeType>) => {
  const connections = useNodeConnections({
    id: props.id,
    handleType: 'target',
  });
  
  const Component = connections.length ? VideoTransform : VideoPrimitive;
  return <Component {...props} />;
});
VideoNodeComponent.displayName = 'VideoNode';

// Audio Node Data Type
interface AudioNodeData extends Record<string, unknown> {
  content?: {
    url: string;
    type: string;
  };
  generated?: {
    url: string;
    type: string;
  };
  voice?: string;
  instructions?: string;
  text?: string;
}

// Audio Primitive Component (Upload Mode - No Incoming Connections)
const AudioPrimitive = memo(({ data, id }: NodeProps<AudioNodeType>) => {
  const { updateNodeData } = useReactFlow();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useState<HTMLInputElement | null>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || isUploading) return;

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      updateNodeData(id, {
        content: {
          url: result.url,
          type: file.type,
        },
      });
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Failed to upload audio');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-background border border-border rounded-3xl shadow-sm min-w-[280px] max-w-[400px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-background"
      />
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-sm font-medium">Audio</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {isUploading ? (
          <div className="flex items-center justify-center h-[60px] bg-secondary rounded-xl">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500" />
          </div>
        ) : data.content?.url ? (
          <audio
            src={data.content.url}
            controls
            className="w-full rounded-xl"
          />
        ) : (
          <label className="flex flex-col items-center justify-center h-[60px] bg-secondary hover:bg-secondary/80 rounded-xl cursor-pointer transition-colors">
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="text-sm text-muted-foreground">
              Click to upload audio
            </span>
          </label>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-background"
      />
    </div>
  );
});
AudioPrimitive.displayName = 'AudioPrimitive';

// Audio Transform Component (Generate Mode - Has Incoming Connections)
const AudioTransform = memo(({ data, id }: NodeProps<AudioNodeType>) => {
  const { updateNodeData, getNodes, getEdges } = useReactFlow();
  const [isGenerating, setIsGenerating] = useState(false);
  const [voice, setVoice] = useState(data.voice || 'Nicole');

  const VOICES = [
    'Rachel', 'Drew', 'Clyde', 'Paul', 'Aria', 'Domi', 'Dave', 'Roger',
    'Fin', 'Sarah', 'Antoni', 'Laura', 'Thomas', 'Charlie', 'George',
    'Emily', 'Elli', 'Callum', 'Patrick', 'River', 'Harry', 'Liam',
    'Dorothy', 'Josh', 'Arnold', 'Charlotte', 'Alice', 'Matilda', 'James',
    'Joseph', 'Will', 'Jeremy', 'Jessica', 'Eric', 'Michael', 'Ethan',
    'Chris', 'Gigi', 'Freya', 'Brian', 'Grace', 'Daniel',
    'Lily', 'Serena', 'Adam', 'Nicole', 'Bill', 'Jessie', 'Sam', 'Glinda',
    'Giovanni', 'Mimi'
  ];

  const handleVoiceChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const newVoice = e.target.value;
    setVoice(newVoice);
    updateNodeData(id, { voice: newVoice });
  }, [id, updateNodeData]);

  const handleInstructionsChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { instructions: e.target.value });
  }, [id, updateNodeData]);

  const handleGenerate = useCallback(async () => {
    if (isGenerating) return;

    try {
      setIsGenerating(true);

      // Get text from connected nodes
      const incomers = getIncomers({ id }, getNodes(), getEdges());
      const textPrompts: string[] = [];

      for (const node of incomers) {
        if (node.type === 'textNode' && node.data.text) {
          textPrompts.push(node.data.text as string);
        }
      }

      let finalText = textPrompts.join('\n\n');
      if (data.instructions) {
        finalText = `${data.instructions}\n\n${finalText}`;
      }

      if (!finalText) {
        throw new Error('No text provided for audio generation');
      }

      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: finalText,
          voice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Generation failed');
      }

      const result = await response.json();

      updateNodeData(id, {
        generated: {
          url: result.audioUrl,
          type: 'audio/mp3',
        },
        voice,
      });
    } catch (error: any) {
      console.error('Error generating audio:', error);
      alert(error.message || 'Failed to generate audio');
    } finally {
      setIsGenerating(false);
    }
  }, [id, isGenerating, data.instructions, voice, updateNodeData, getNodes, getEdges]);

  const handleDownload = useCallback(() => {
    if (!data.generated?.url) return;
    const link = document.createElement('a');
    link.href = data.generated.url;
    link.download = `audio-${id}.mp3`;
    link.click();
  }, [data.generated?.url, id]);

  return (
    <div className="bg-background border border-border rounded-3xl shadow-sm min-w-[280px] max-w-[400px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-background"
      />
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span className="text-sm font-medium">Audio (Generate)</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {/* Voice Selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Voice</label>
          <select
            value={voice}
            onChange={handleVoiceChange}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            {VOICES.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Instructions */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Instructions (Optional)</label>
          <textarea
            value={data.instructions || ''}
            onChange={handleInstructionsChange}
            placeholder="Additional instructions..."
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 min-h-[60px]"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-500/50 text-white text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Generating...
            </>
          ) : (
            <>🎤 Generate Audio</>
          )}
        </button>

        {/* Generated Audio */}
        {data.generated?.url && (
          <div className="space-y-2">
            <audio
              src={data.generated.url}
              controls
              className="w-full rounded-xl"
            />
            <button
              onClick={handleDownload}
              className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm rounded-xl transition-colors"
            >
              ⬇️ Download Audio
            </button>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-orange-500 !border-2 !border-background"
      />
    </div>
  );
});
AudioTransform.displayName = 'AudioTransform';

// Audio Node Component (Switches between Primitive and Transform)
const AudioNodeComponent = memo((props: NodeProps<AudioNodeType>) => {
  const connections = useNodeConnections({
    id: props.id,
    handleType: 'target',
  });
  
  const Component = connections.length > 0 ? AudioTransform : AudioPrimitive;
  return <Component {...props} />;
});
AudioNodeComponent.displayName = 'AudioNode';

// Appender Node Component (Video Editor)
const AppenderNodeComponent = memo(({ data, id }: NodeProps<AppenderNodeType>) => {
  const { updateNodeData, getNodes, getEdges } = useReactFlow();
  const [isProcessing, setIsProcessing] = useState(false);
  const [transition, setTransition] = useState(data.transition || 'fade');

  const handleTransitionChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const newTransition = e.target.value;
    setTransition(newTransition);
    updateNodeData(id, { transition: newTransition });
  }, [id, updateNodeData]);

  const handleMerge = useCallback(async () => {
    try {
      setIsProcessing(true);

      const nodes = getNodes();
      const edges = getEdges();
      const incomers = getIncomers({ id } as Node, nodes, edges);

      // Find connected videos and audio
      const videoNodes = incomers.filter(
        (node) => {
          const data = node.data as VideoNodeData;
          return node.type === 'videoNode' && (data.content?.url || data.generated?.url);
        }
      );
      const audioNodes = incomers.filter(
        (node) => {
          const data = node.data as AudioNodeData;
          return node.type === 'audioNode' && (data.content?.url || data.generated?.url);
        }
      );

      if (videoNodes.length === 0) {
        alert('Please connect at least one video node');
        return;
      }

      // Get video URLs
      const videoUrls = videoNodes.map(
        (node) => {
          const data = node.data as VideoNodeData;
          return (data.generated?.url || data.content?.url) as string;
        }
      );

      // Get audio URL (if any)
      const audioUrl = audioNodes.length > 0
        ? (() => {
            const data = audioNodes[0].data as AudioNodeData;
            return (data.generated?.url || data.content?.url) as string;
          })()
        : undefined;

      console.log('Merging videos:', videoUrls);
      console.log('With audio:', audioUrl);
      console.log('Transition:', transition);

      // Call API to merge videos
      const formData = new FormData();
      videoUrls.forEach((url, index) => {
        formData.append(`video${index}`, url);
      });
      if (audioUrl) {
        formData.append('audio', audioUrl);
      }
      formData.append('transition', transition);

      const response = await fetch('/api/merge-videos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to merge videos');
      }

      const result = await response.json();

      updateNodeData(id, {
        merged: {
          url: result.videoUrl,
          type: 'video/mp4',
        },
      });
    } catch (error: any) {
      console.error('Error merging videos:', error);
      alert(error.message || 'Failed to merge videos');
    } finally {
      setIsProcessing(false);
    }
  }, [id, updateNodeData, getNodes, getEdges, transition]);

  const handleDownload = useCallback(() => {
    if (data.merged?.url) {
      const a = document.createElement('a');
      a.href = data.merged.url;
      a.download = `merged-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }, [data.merged?.url]);

  return (
    <div className="bg-background border border-border rounded-3xl shadow-sm min-w-[320px] max-w-[450px] overflow-hidden">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-pink-500 !border-2 !border-background"
      />
      <div className="px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-pink-500" />
          <span className="text-sm font-medium">Video Appender</span>
        </div>
      </div>
      <div className="p-4 space-y-3">
        <div className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
          📹 Connect 2+ video nodes to merge them together<br />
          🎵 Connect an audio node to add background music
        </div>

        {/* Transition Selector */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground">Transition</label>
          <select
            value={transition}
            onChange={handleTransitionChange}
            className="w-full px-3 py-2 text-sm bg-secondary border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="fade">Fade</option>
            <option value="dissolve">Dissolve</option>
            <option value="wipeleft">Wipe Left</option>
            <option value="wiperight">Wipe Right</option>
            <option value="slideup">Slide Up</option>
            <option value="slidedown">Slide Down</option>
            <option value="none">None (Direct Cut)</option>
          </select>
        </div>

        {/* Merge Button */}
        <button
          onClick={handleMerge}
          disabled={isProcessing}
          className="w-full px-4 py-2 bg-pink-500 hover:bg-pink-600 disabled:bg-pink-500/50 text-white text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Processing...
            </>
          ) : (
            <>🎬 Merge Videos</>
          )}
        </button>

        {/* Merged Video Preview */}
        {data.merged?.url && (
          <div className="space-y-2">
            <video
              src={data.merged.url}
              controls
              className="w-full rounded-xl max-h-64 object-contain bg-black"
            />
            <button
              onClick={handleDownload}
              className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm rounded-xl transition-colors"
            >
              ⬇️ Download Merged Video
            </button>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-pink-500 !border-2 !border-background"
      />
    </div>
  );
});
AppenderNodeComponent.displayName = 'AppenderNode';

const nodeTypes = {
  textNode: TextNodeComponent,
  imageNode: ImageNodeComponent,
  videoNode: VideoNodeComponent,
  audioNode: AudioNodeComponent,
  appenderNode: AppenderNodeComponent,
};

// Main Flow Canvas Component
function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const addTextNode = useCallback(() => {
    const newNode: Node = {
      id: `text-${Date.now()}`,
      type: 'textNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { text: '' },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addImageNode = useCallback(() => {
    const newNode: Node = {
      id: `image-${Date.now()}`,
      type: 'imageNode',
      position: { x: Math.random() * 400 + 200, y: Math.random() * 400 },
      data: {
        model: 'gpt-image-1',
        size: '1024x1024',
        quality: 'auto',
        instructions: '',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addVideoNode = useCallback(() => {
    const newNode: Node = {
      id: `video-${Date.now()}`,
      type: 'videoNode',
      position: { x: Math.random() * 400 + 400, y: Math.random() * 400 },
      data: {
        model: 'sora-2',
        size: '1280x720',
        seconds: 8,
        instructions: '',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addAudioNode = useCallback(() => {
    const newNode: Node = {
      id: `audio-${Date.now()}`,
      type: 'audioNode',
      position: { x: Math.random() * 400 + 600, y: Math.random() * 400 },
      data: {
        voice: 'Nicole',
        instructions: '',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const addAppenderNode = useCallback(() => {
    const newNode: Node = {
      id: `appender-${Date.now()}`,
      type: 'appenderNode',
      position: { x: Math.random() * 400 + 800, y: Math.random() * 400 },
      data: {
        transition: 'fade',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  return (
    <div className="h-screen bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Background />
        <FlowControls />

        {/* Bottom Toolbar */}
        <Panel position="bottom-center" className="mb-4">
          <div className="flex gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-2 shadow-lg">
            <button
              onClick={addTextNode}
              title="Add Text Node"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-xl transition-colors"
            >
              + Text
            </button>
            <button
              onClick={addImageNode}
              title="Add Image Node"
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm rounded-xl transition-colors"
            >
              + Image
            </button>
            <button
              onClick={addVideoNode}
              title="Add Video Node"
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-xl transition-colors"
            >
              + Video
            </button>
            <button
              onClick={addAudioNode}
              title="Add Audio Node"
              className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm rounded-xl transition-colors"
            >
              + Audio
            </button>
            <button
              onClick={addAppenderNode}
              title="Add Appender Node"
              className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm rounded-xl transition-colors"
            >
              + Appender
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

// Main Page Component
export default function GeneratePage() {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1">
        <ReactFlowProvider>
          <FlowCanvas />
        </ReactFlowProvider>
      </div>
    </div>
  );
}
