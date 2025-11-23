'use client';

import { workflowTemplates, type WorkflowTemplate } from '@/lib/workflow-templates';
import { X, Sparkles, Video, Wand2 } from 'lucide-react';

type WorkflowSelectorProps = {
  isOpen: boolean;
  onSelectTemplate: (template: WorkflowTemplate) => void;
  onClose: () => void;
};

export const WorkflowSelector = ({
  isOpen,
  onSelectTemplate,
  onClose,
}: WorkflowSelectorProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background border border-border rounded-2xl shadow-2xl max-w-4xl max-h-[80vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-purple-500" />
              <div>
                <h2 className="text-2xl font-semibold">Choose a Workflow Template</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a pre-built workflow to get started quickly
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Templates */}
        <div className="p-6 space-y-4">
          {/* Start from Scratch Option */}
          <div
            className="border-2 border-dashed border-border hover:border-purple-500 rounded-xl p-6 transition-all cursor-pointer group bg-secondary/20 hover:bg-secondary/40"
            onClick={onClose}
          >
            <div className="flex items-center gap-4">
              <div className="text-5xl">✨</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold group-hover:text-purple-500 transition-colors mb-2">
                  Start from Scratch
                </h3>
                <p className="text-sm text-muted-foreground">
                  Build your own custom workflow with complete creative freedom. Add nodes manually and connect them as you like.
                </p>
              </div>
              <button
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-xl transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
              >
                Blank Canvas
              </button>
            </div>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or choose a template</span>
            </div>
          </div>

          {workflowTemplates.map((template) => (
            <div
              key={template.id}
              className="border border-border rounded-xl p-6 hover:border-purple-500 hover:shadow-lg transition-all cursor-pointer group"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex items-start gap-4">
                <div className="text-5xl">{template.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold group-hover:text-purple-500 transition-colors">
                      {template.name}
                    </h3>
                    <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {template.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 text-xs bg-secondary px-3 py-1 rounded-full">
                      <Wand2 className="h-3 w-3" />
                      <span>{template.nodes.length} Nodes</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs bg-secondary px-3 py-1 rounded-full">
                      <Video className="h-3 w-3" />
                      <span>Click Start on Each Node</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    <p className="font-semibold mb-1">Workflow includes:</p>
                    {template.id === 'brand-model-photoshoot' ? (
                      <ul className="list-disc list-inside space-y-1">
                        <li>Upload model image and your brand product</li>
                        <li>Generate 3 professional photoshoot scenes</li>
                        <li>Create dynamic marketing video</li>
                      </ul>
                    ) : (
                      <ul className="list-disc list-inside space-y-1">
                        <li>Upload your product image</li>
                        <li>Generate 3 VFX variations (smoke, lightning, glow)</li>
                        <li>Create rotating video with Kling AI</li>
                      </ul>
                    )}
                  </div>
                  
                  {/* Visual workflow diagram */}
                  <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
                    {template.id === 'brand-model-photoshoot' ? (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl">
                            👤
                          </div>
                          <span className="text-[10px]">Model</span>
                        </div>
                        <div className="text-muted-foreground">+</div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl">
                            🏷️
                          </div>
                          <span className="text-[10px]">Product</span>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xl">
                            🏙️
                          </div>
                          <span className="text-[10px]">Urban</span>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xl">
                            📷
                          </div>
                          <span className="text-[10px]">Studio</span>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center text-xl">
                            🎬
                          </div>
                          <span className="text-[10px]">Video</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xl">
                            📸
                          </div>
                          <span className="text-[10px]">Upload</span>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xl">
                            💨
                          </div>
                          <span className="text-[10px]">VFX 1</span>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xl">
                            ⚡
                          </div>
                          <span className="text-[10px]">VFX 2</span>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-xl">
                            🔥
                          </div>
                          <span className="text-[10px]">VFX 3</span>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center text-xl">
                            🎬
                          </div>
                          <span className="text-[10px]">Video</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  className="px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-xl transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(template);
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Tip */}
        <div className="sticky bottom-0 bg-background border-t border-border p-4">
          <p className="text-sm text-muted-foreground">
            <strong>💡 Pro Tip:</strong> After loading the template, upload your product image and click <strong>"Start"</strong> on each node to execute the workflow step by step!
          </p>
        </div>
      </div>
    </div>
  );
};
