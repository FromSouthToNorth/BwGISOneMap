import { defineStore } from 'pinia'
import type { MineInfo, UserInfo } from '#/store'
import { MAP_LOCATION, MINE_INFO_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum'
import { getCache, setCache } from '@/utils/cache'
import { store } from '@/store'

interface UserState {
  userInfo: Nullable<UserInfo>
  token?: string
  sessionTimeout?: boolean
  mineInfo: Nullable<MineInfo>
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    // user info
    userInfo: null,
    // token
    token: undefined,
    mineInfo: null,
    // Whether the login expired
    sessionTimeout: false,
  }),
  getters: {
    getUserInfo(state): UserInfo {
      return state.userInfo || getCache<UserInfo>(USER_INFO_KEY) as UserInfo || {} as UserInfo
    },
    getToken(state): string {
      return state.token || getCache<string>(TOKEN_KEY) as string
    },
    getMineInfo(state): MineInfo {
      return state.mineInfo || getCache<MineInfo>(MINE_INFO_KEY) as MineInfo || {} as MineInfo
    },
  },
  actions: {
    setToken(token: string | undefined) {
      this.token = token || ''
      setCache(TOKEN_KEY, token)
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      setCache(USER_INFO_KEY, info)
    },
    setMineInfo(info: MineInfo | null) {
      this.mineInfo = info

      setCache(MINE_INFO_KEY, info)
      setCache(MAP_LOCATION, info)
      let value
      if (info) {
        const { show_map, centerB, centerL } = info
        value = `${show_map}/${centerB}/${centerL}`
      }
      setCache(MAP_LOCATION, { value })
    },
    resetState() {
      this.userInfo = null
      this.mineInfo = null
      this.token = ''
    },
    async logout() {
      this.setToken(undefined)
      this.setUserInfo(null)
      this.setMineInfo(null)
      const { hostname, port } = window.location
      BW_SSO_SDK.SSOLogout(hostname, port)
    },
  },
})

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store)
}
