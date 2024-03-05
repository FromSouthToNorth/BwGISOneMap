import { defHttp } from '@/utils/http/axios'

export function getDingtalkToToken(token: string) {
  return defHttp.get({ url: '/api/OAuth/ExchangeAccessToken', headers: { 'X-Access-Token': token } })
}
