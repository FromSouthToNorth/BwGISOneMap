import { defineStore } from 'pinia'
import { store } from '@/store'
import { darkMode } from '@/settings/designSetting'
import type { ThemeEnum } from '@/enums/appEnum'
import { APP_DARK_MODE_KEY } from '@/enums/cacheEnum'

interface AppState {
  darkMode?: ThemeEnum
  // Page loading status
  pageLoading: boolean
}
let timeId: TimeoutHandle
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
  }),
  getters: {
    getPageLoading(state): boolean {
      return state.pageLoading
    },
    getDarkMode(state): 'light' | 'dark' | string {
      return state.darkMode || darkMode
    },
  },
  actions: {
    setPageLoading(loading: boolean): void {
      this.pageLoading = loading
    },

    setDarkMode(mode: ThemeEnum): void {
      this.darkMode = mode
      localStorage.setItem(APP_DARK_MODE_KEY, mode)
    },

    async setPageLoadingAction(loading: boolean): Promise<void> {
      if (loading) {
        clearTimeout(timeId)
        // Prevent flicker
        timeId = setTimeout(() => {
          this.setPageLoading(loading)
        }, 50)
      }
      else {
        this.setPageLoading(loading)
        clearTimeout(timeId)
      }
    },
  },
})

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store)
}
