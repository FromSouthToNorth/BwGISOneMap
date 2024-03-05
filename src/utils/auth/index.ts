import type { BasicKeys } from '@/utils/cache/persistent'
import { ACCESS_NET_TOKEN, TOKEN_KEY } from '@/enums/cacheEnum'

const ls = localStorage

export function getToken() {
  return getAuthCache(TOKEN_KEY) || getAuthCache(ACCESS_NET_TOKEN)
}

export function getAuthCache<T>(key: BasicKeys) {
  return ls.getItem(key) as T
}

export function setAuthCache(key: BasicKeys, value: any) {
  return ls.setItem(key, value)
}

export function clearAuthCache() {
  return ls.clear()
}
