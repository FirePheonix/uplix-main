# Workspace System Setup Guide

## 🎯 Overview
The workspace system allows users to save and load their flow canvas state (nodes, edges, connections, URLs) into Supabase.

## 📋 Setup Instructions

### Step 1: Run Database Schema
1. Go to your Supabase Dashboard: https://tliywpmkonjcsekebvst.supabase.co
2. Navigate to **SQL Editor**
3. Open `workspaces-schema.sql` file
4. Copy the entire SQL content and paste it into the SQL Editor
5. Click **Run** to execute the schema

### Step 2: Verify Schema
After running the schema, verify the following:

✅ Table `workspaces` is created with columns:
- `id` (uuid, primary key)
- `name` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `user_id` (uuid, nullable for now)
- `flow_data` (jsonb)

✅ Indexes created:
- `idx_workspaces_created_at`
- `idx_workspaces_updated_at`
- `idx_workspaces_user_id`

✅ RLS (Row Level Security) policies:
- `workspaces_select_policy`
- `workspaces_insert_policy`
- `workspaces_update_policy`
- `workspaces_delete_policy`

### Step 3: Test the Feature

1. Open the application: http://localhost:3000/dashboard/generate
2. You should see **Workspace Selector** and **Save Button** at the top
3. Create some nodes and connections on the canvas
4. Click **Save** button
5. Enter a workspace name (e.g., "My First Flow")
6. Verify the workspace is saved by:
   - Opening the workspace dropdown
   - Seeing your workspace listed
   - Loading it to restore the flow

## 🎨 Features Implemented

### Workspace Selector Component
- **Location**: Top center of the flow canvas
- **Features**:
  - Dropdown to view all workspaces
  - Create new workspace
  - Load existing workspace
  - Delete workspace (with confirmation)
  - Shows last updated date
  - Visual feedback for current workspace

### Save Button
- **Location**: Next to workspace selector
- **Features**:
  - Green gradient styling
  - Saves current flow state to Supabase
  - Updates existing workspace or creates new one
  - Shows "Saving..." state during operation
  - Success confirmation

### API Routes
All workspace operations have dedicated API endpoints:

1. **GET /api/workspaces** - List all workspaces (ordered by updated_at DESC)
2. **POST /api/workspaces** - Create new workspace
3. **GET /api/workspaces/[id]** - Get single workspace
4. **PUT /api/workspaces/[id]** - Update workspace (name + flow_data)
5. **DELETE /api/workspaces/[id]** - Delete workspace

## 💾 Data Structure

Each workspace saves:
```json
{
  "id": "uuid",
  "name": "Workspace Name",
  "created_at": "timestamp",
  "updated_at": "timestamp",
  "user_id": null,
  "flow_data": {
    "nodes": [...],      // All nodes with their data
    "edges": [...],      // All connections
    "timestamp": "..."   // When it was saved
  }
}
```

## 🔧 Technical Details

### Files Created/Modified

**New Components:**
- `src/components/workspace-selector.tsx` - Workspace dropdown + save button

**Modified Files:**
- `src/app/dashboard/generate/page.tsx` - Integrated workspace system

**API Routes:**
- `src/app/api/workspaces/route.ts` - GET all, POST create
- `src/app/api/workspaces/[id]/route.ts` - GET, PUT, DELETE single

**Database:**
- `workspaces-schema.sql` - Supabase table schema

### Dependencies
- `@supabase/supabase-js` - Already installed
- `lucide-react` - Already installed (icons)

## 🚀 Usage Flow

1. User creates a flow with nodes and connections
2. User clicks **Save** button
3. If no workspace selected:
   - Opens input field for workspace name
   - User types name and confirms
   - Creates new workspace in Supabase
4. If workspace already selected:
   - Updates existing workspace with current state
5. User can load workspaces from dropdown:
   - Click workspace name to load
   - All nodes and edges are restored
6. User can delete workspaces:
   - Hover over workspace in dropdown
   - Click trash icon (with confirmation)

## 📝 Notes

- Currently, `user_id` is nullable (no auth implemented yet)
- RLS policies are permissive for now (will need tightening with auth)
- Flow data is stored as JSONB for efficient querying
- Workspaces are ordered by most recently updated
- All operations include error handling and user feedback

## ✨ Future Enhancements

- Add user authentication (Supabase Auth)
- Implement user-specific workspaces
- Add workspace sharing functionality
- Add workspace templates/categories
- Add search/filter for workspaces
- Add version history for workspaces
- Add export/import workspace feature
