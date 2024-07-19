import { defineStore } from 'pinia'
import { store } from '@/store'
import { darkMode } from '@/settings/designSetting'
import type { ThemeEnum } from '@/enums/appEnum'
import { APP_DARK_MODE_KEY } from '@/enums/cacheEnum'

export interface MenuItem {
  id: string
  name: string
  strategy: number
  icon_class: string
  icon_color: string
  background_color: string
  time?: Date
}

export interface Model {

}

interface AppState {
  darkMode?: ThemeEnum
  // Page loading status
  pageLoading: boolean
  menu: MenuItem[]
  model: any
  menuHide: boolean
  menuDrop: boolean
  isSatellite: boolean
}
let timeId: TimeoutHandle
export const useAppStore = defineStore({
  id: 'app',
  state: (): AppState => ({
    darkMode: undefined,
    pageLoading: false,
    menu: [],
    model: {},
    menuHide: false,
    menuDrop: true,
    isSatellite: false,
  }),
  getters: {
    getPageLoading(state): boolean {
      return state.pageLoading
    },
    getDarkMode(state): 'light' | 'dark' | string {
      return state.darkMode || darkMode
    },
    getMenu(state): MenuItem[] {
      return state.menu
    },
    getModel(state): Model {
      return state.model
    },
    getMenuHide(state): boolean {
      return state.menuHide
    },
    getMenuDrop(state): boolean {
      return state.menuDrop
    },
    getIsSatellite(state): boolean {
      return state.isSatellite
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

    setMenu(menu: MenuItem[]): void {
      this.menu = menu
    },
    setModel(model: Model): void {
      this.model = model
    },
    setMenuHide(menuHide: boolean): void {
      this.menuHide = menuHide
    },
    setMenuDrop(menuDrop: boolean): void {
      this.menuDrop = menuDrop
    },
    setIsSatellite(isSatellite: boolean): void {
      this.isSatellite = isSatellite
    },
  },
})

// Need to be used outside the setup
export function useAppStoreWithOut() {
  return useAppStore(store)
}
