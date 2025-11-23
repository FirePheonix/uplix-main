import type { Edge, Node } from '@xyflow/react';

export type WorkflowTemplate = {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  nodes: Node[];
  edges: Edge[];
};

export const workflowTemplates: WorkflowTemplate[] = [
  {
    id: 'brand-model-photoshoot',
    name: 'Brand Model Photoshoot',
    description: 'Upload model image and your product - generate professional photoshoot scenes where model wears/uses your brand',
    icon: '📸',
    category: 'Brand Marketing',
    nodes: [
      // Node 0: Model Image Upload
      {
        id: 'model-image',
        type: 'imageNode',
        position: { x: 100, y: 200 },
        data: {
          model: 'gpt-image-1',
          size: '1024x1024',
          quality: 'high',
          instructions: '',
        },
      },
      // Node 1: Brand Product Upload
      {
        id: 'brand-product',
        type: 'imageNode',
        position: { x: 100, y: 500 },
        data: {
          model: 'gpt-image-1',
          size: '1024x1024',
          quality: 'high',
          instructions: '',
        },
      },
      // Node 2: Scene 1 - Urban Street Style
      {
        id: 'scene-urban',
        type: 'imageNode',
        position: { x: 550, y: 100 },
        data: {
          model: 'gpt-image-1',
          size: '1024x1536',
          quality: 'high',
          instructions: 'Professional fashion photoshoot: Model wearing/using the brand product in an urban street setting, golden hour lighting, trendy metropolitan background, fashion magazine style',
        },
      },
      // Node 3: Scene 2 - Studio Portrait
      {
        id: 'scene-studio',
        type: 'imageNode',
        position: { x: 550, y: 400 },
        data: {
          model: 'gpt-image-1',
          size: '1024x1536',
          quality: 'high',
          instructions: 'High-end studio portrait: Model elegantly showcasing the brand product, clean white background, professional studio lighting with soft shadows, luxury brand aesthetic',
        },
      },
      // Node 4: Scene 3 - Lifestyle Scene
      {
        id: 'scene-lifestyle',
        type: 'imageNode',
        position: { x: 550, y: 700 },
        data: {
          model: 'gpt-image-1',
          size: '1024x1536',
          quality: 'high',
          instructions: 'Lifestyle photoshoot: Model naturally using the brand product in a beautiful lifestyle setting (cafe/home/outdoors), warm natural lighting, candid yet polished look',
        },
      },
      // Node 5: Marketing Video
      {
        id: 'marketing-video',
        type: 'videoNode',
        position: { x: 1050, y: 400 },
        data: {
          model: 'kling-video/v2.1/pro/image-to-video',
          size: '1280x720',
          seconds: 10,
          instructions: 'Create a dynamic marketing video showcasing all photoshoot scenes. Smooth transitions between scenes, model poses naturally, subtle camera movements, professional brand commercial feel',
        },
      },
    ],
    edges: [
      // Model and product connect to all scenes
      { id: 'e1', source: 'model-image', target: 'scene-urban', animated: true },
      { id: 'e2', source: 'model-image', target: 'scene-studio', animated: true },
      { id: 'e3', source: 'model-image', target: 'scene-lifestyle', animated: true },
      { id: 'e4', source: 'brand-product', target: 'scene-urban', animated: true },
      { id: 'e5', source: 'brand-product', target: 'scene-studio', animated: true },
      { id: 'e6', source: 'brand-product', target: 'scene-lifestyle', animated: true },
      // All scenes connect to final video
      { id: 'e7', source: 'scene-urban', target: 'marketing-video', animated: true },
      { id: 'e8', source: 'scene-studio', target: 'marketing-video', animated: true },
      { id: 'e9', source: 'scene-lifestyle', target: 'marketing-video', animated: true },
    ],
  },
  {
    id: 'rotating-product-video',
    name: 'Rotating Product Video',
    description: 'Upload your product image, generate VFX variations (smoke, lightning, fire), and create a stunning rotating video',
    icon: '🎬',
    category: 'Video Production',
    nodes: [
      // Node 0: Upload Image Node (Brand Product)
      {
        id: 'upload-image',
        type: 'imageNode',
        position: { x: 100, y: 300 },
        data: {
          model: 'gpt-image-1',
          size: '1024x1024',
          quality: 'high',
          instructions: '',
        },
      },
      // Node 1: Text Prompt Node for Image Generation
      {
        id: 'text-prompt',
        type: 'textNode',
        position: { x: 100, y: 550 },
        data: {
          text: 'Create a high-quality studio photo with dramatic lighting and professional composition',
        },
      },
      // Node 2: Image Generation - Smoky Effect
      {
        id: 'vfx-smoke',
        type: 'imageNode',
        position: { x: 550, y: 150 },
        data: {
          model: 'gpt-image-1',
          size: '1024x1024',
          quality: 'high',
          instructions: 'Add dramatic smoke and fog effects around the product',
        },
      },
      // Node 3: Image Generation - Lightning Effect
      {
        id: 'vfx-lightning',
        type: 'imageNode',
        position: { x: 550, y: 400 },
        data: {
          model: 'gpt-image-1',
          size: '1024x1024',
          quality: 'high',
          instructions: 'Add electric lightning bolts and energy effects',
        },
      },
      // Node 4: Image Generation - Fire/Glow Effect
      {
        id: 'vfx-fire',
        type: 'imageNode',
        position: { x: 550, y: 650 },
        data: {
          model: 'gpt-image-1',
          size: '1024x1024',
          quality: 'high',
          instructions: 'Add glowing fire particles and warm light effects',
        },
      },
      // Node 5: Video Generation Node (Kling v2-1-pro)
      {
        id: 'final-video',
        type: 'videoNode',
        position: { x: 1050, y: 400 },
        data: {
          model: 'kling-video/v2.1/pro/image-to-video',
          size: '1280x720',
          seconds: 10,
          instructions: 'Create a smooth 360-degree rotating video showcasing the product with all visual effects combined. Camera should orbit around the product slowly and cinematically.',
        },
      },
    ],
    edges: [
      // Brand image connects to all 3 VFX image nodes
      { id: 'e1', source: 'upload-image', target: 'vfx-smoke', animated: true },
      { id: 'e2', source: 'upload-image', target: 'vfx-lightning', animated: true },
      { id: 'e3', source: 'upload-image', target: 'vfx-fire', animated: true },
      // Text prompt connects to all 3 VFX image nodes
      { id: 'e4', source: 'text-prompt', target: 'vfx-smoke', animated: true },
      { id: 'e5', source: 'text-prompt', target: 'vfx-lightning', animated: true },
      { id: 'e6', source: 'text-prompt', target: 'vfx-fire', animated: true },
      // All 3 VFX images connect to final video node
      { id: 'e7', source: 'vfx-smoke', target: 'final-video', animated: true },
      { id: 'e8', source: 'vfx-lightning', target: 'final-video', animated: true },
      { id: 'e9', source: 'vfx-fire', target: 'final-video', animated: true },
    ],
  },
];
