'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Save, Trash2, Check } from 'lucide-react';

type Workspace = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  flow_data: any;
};

type WorkspaceSelectorProps = {
  currentWorkspace: Workspace | null;
  onWorkspaceChange: (workspace: Workspace | null) => void;
  onSave: (workspaceName: string) => void;
  onLoad: (workspace: Workspace) => void;
};

export const WorkspaceSelector = ({
  currentWorkspace,
  onWorkspaceChange,
  onSave,
  onLoad,
}: WorkspaceSelectorProps) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Fetch workspaces on mount
  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces');
      const data = await response.json();
      if (data.workspaces) {
        setWorkspaces(data.workspaces);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  };

  const handleSave = async () => {
    if (!currentWorkspace) {
      setIsCreating(true);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(currentWorkspace.name);
      await fetchWorkspaces();
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNew = async () => {
    if (!newWorkspaceName.trim()) return;

    setIsSaving(true);
    try {
      await onSave(newWorkspaceName);
      setNewWorkspaceName('');
      setIsCreating(false);
      await fetchWorkspaces();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this workspace?')) return;

    try {
      await fetch(`/api/workspaces/${id}`, { method: 'DELETE' });
      await fetchWorkspaces();
      if (currentWorkspace?.id === id) {
        onWorkspaceChange(null);
      }
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  const handleLoadWorkspace = (workspace: Workspace) => {
    onLoad(workspace);
    onWorkspaceChange(workspace);
    setIsOpen(false);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Workspace Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-background border border-border rounded-xl hover:bg-secondary transition-colors min-w-[200px]"
        >
          <span className="flex-1 text-left truncate">
            {currentWorkspace ? currentWorkspace.name : 'Select Workspace'}
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full mt-2 left-0 w-80 bg-background border border-border rounded-xl shadow-lg z-20 max-h-96 overflow-y-auto">
              {/* Create New Workspace */}
              <div className="p-2 border-b border-border">
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newWorkspaceName}
                      onChange={(e) => setNewWorkspaceName(e.target.value)}
                      placeholder="Workspace name..."
                      className="flex-1 px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateNew();
                        if (e.key === 'Escape') {
                          setIsCreating(false);
                          setNewWorkspaceName('');
                        }
                      }}
                    />
                    <button
                      onClick={handleCreateNew}
                      disabled={!newWorkspaceName.trim() || isSaving}
                      className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg text-sm transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Create New Workspace</span>
                  </button>
                )}
              </div>

              {/* Workspace List */}
              <div className="p-2">
                {workspaces.length === 0 ? (
                  <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                    No workspaces yet
                  </div>
                ) : (
                  workspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className={`flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg cursor-pointer group ${
                        currentWorkspace?.id === workspace.id ? 'bg-secondary' : ''
                      }`}
                      onClick={() => handleLoadWorkspace(workspace)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{workspace.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(workspace.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleDelete(workspace.id, e)}
                        className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white rounded transition-all"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl transition-colors disabled:opacity-50 font-medium"
      >
        <Save className="h-4 w-4" />
        {isSaving ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};
