import { getCache } from '../cache'
import { ACCESS_NET_TOKEN, MINE_DESC_KEY, MINE_NAME_KEY, TOKEN_KEY } from '@/enums/cacheEnum'

export function getToken() {
  return getCache(TOKEN_KEY) || getCache(ACCESS_NET_TOKEN)
}

export function getMineDesc() {
  return getCache(MINE_DESC_KEY)
}

export function getMineName() {
  return getCache(MINE_NAME_KEY)
}
