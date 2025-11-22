'use client'

import { createContext, useContext, type ReactNode } from 'react'

type NodeOperationsContextType = {
  addNode: (type: string, options?: Record<string, unknown>) => string
  duplicateNode: (id: string) => void
}

const NodeOperationsContext = createContext<NodeOperationsContextType | null>(null)

export const useNodeOperations = () => {
  const context = useContext(NodeOperationsContext)

  if (!context) {
    throw new Error('useNodeOperations must be used within a NodeOperationsProvider')
  }

  return context
}

export const NodeOperationsProvider = ({
  children,
  addNode,
  duplicateNode,
}: {
  children: ReactNode
  addNode: (type: string, options?: Record<string, unknown>) => string
  duplicateNode: (id: string) => void
}) => (
  <NodeOperationsContext.Provider value={{ addNode, duplicateNode }}>
    {children}
  </NodeOperationsContext.Provider>
)
