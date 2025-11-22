'use client'

import { createContext, useContext, type ReactNode } from 'react'

type NodeDropzoneContextType = Record<string, never>

const NodeDropzoneContext = createContext<NodeDropzoneContextType | null>(null)

export const useNodeDropzone = () => {
  const context = useContext(NodeDropzoneContext)

  if (!context) {
    throw new Error('useNodeDropzone must be used within a NodeDropzoneProvider')
  }

  return context
}

export const NodeDropzoneProvider = ({
  children,
}: {
  children: ReactNode
}) => (
  <NodeDropzoneContext.Provider value={{}}>
    {children}
  </NodeDropzoneContext.Provider>
)
