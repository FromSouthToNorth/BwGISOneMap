import { defineStore } from 'pinia'
import type { MineInfo, UserInfo } from '#/store'
import { MINE_INFO_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum'
import { getAuthCache, setAuthCache } from '@/utils/auth'
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
      return state.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {}
    },
    getToken(state): string {
      return state.token || getAuthCache<string>(TOKEN_KEY)
    },
    getMineInfo(state): MineInfo {
      return state.mineInfo || getAuthCache<MineInfo>(MINE_INFO_KEY) || {}
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info || ''
      setAuthCache(TOKEN_KEY, info)
    },
    setUserInfo(info: UserInfo | null) {
      this.userInfo = info
      setAuthCache(USER_INFO_KEY, info)
    },
    setMineInfo(info: MineInfo | null) {
      this.mineInfo = info
      setAuthCache(MINE_INFO_KEY, info)
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
