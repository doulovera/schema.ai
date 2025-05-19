'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface ConfigStore {
  userId: string | null
  isDarkMode: boolean
  setUserId: (userId: string) => void
  setDarkMode: (isDarkMode: boolean) => void
}

export const useConfigStore = create<ConfigStore>()(
  persist(
    (set) => ({
      userId: null,
      isDarkMode: true,
      setUserId: (userId: string) => {
        set({ userId })
      },
      setDarkMode: (isDarkMode: boolean) => {
        set({ isDarkMode })
      },
    }),
    {
      name: 'config-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
      }),
    },
  ),
)
