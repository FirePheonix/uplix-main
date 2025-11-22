'use client'

import { type ReactNode, createContext, useContext, useState } from 'react'

type Project = {
  id: string
  name: string
  content: {
    nodes: any[]
    edges: any[]
  }
  userId?: string
}

type ProjectContextType = {
  project: Project | null
}

export const ProjectContext = createContext<ProjectContextType>({
  project: null,
})

export const useProject = () => {
  const context = useContext(ProjectContext)

  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider')
  }

  return context.project
}

export const ProjectProvider = ({
  children,
  data,
}: {
  children: ReactNode
  data: Project
}) => (
  <ProjectContext.Provider value={{ project: data }}>
    {children}
  </ProjectContext.Provider>
)
