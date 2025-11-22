'use client'

import { useState } from 'react'

type SaveState = {
  isSaving: boolean
  lastSaved: Date | null
}

export const useSaveProject = (): [SaveState, (updater: (prev: SaveState) => SaveState) => void] => {
  const [saveState, setSaveState] = useState<SaveState>({
    isSaving: false,
    lastSaved: null,
  })

  return [saveState, setSaveState]
}
