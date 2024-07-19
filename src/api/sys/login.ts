import { TOKEN_KEY } from '@/enums/cacheEnum'
import { getCache } from '@/utils/cache'
import { defHttp } from '@/utils/http/axios'

export function getDingtalkToToken(token: string) {
  return defHttp.get({ url: '/api/OAuth/ExchangeAccessToken', headers: { 'X-Access-Token': token } })
}

export function getUserInfo() {
  return defHttp.post({ url: '/api/OAuth/Verify', data: getCache(TOKEN_KEY) })
}
