import type { BasicKeys } from '@/utils/cache/persistent'

const ls = localStorage

export function getCache<T>(key: BasicKeys) {
  return ls.getItem(key) as T
}

export function setCache(key: BasicKeys, value: any) {
  return ls.setItem(key, value)
}

export function clearCache() {
  return ls.clear()
}
