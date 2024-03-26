import type { BasicKeys } from '@/utils/cache/persistent'

const ls = localStorage

export function getCache<T>(key: BasicKeys) {
  const cache = ls.getItem(key) || JSON.stringify({ value: null })
  return JSON.parse(cache).value as T
}

export function setCache(key: BasicKeys, value: any) {
  return ls.setItem(key, value)
}

export function clearCache() {
  return ls.clear()
}
