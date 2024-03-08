import { setAuthCache } from './index'
import { TOKEN_KEY } from '@/enums/cacheEnum'
import { getDingtalkToToken } from '@/api/sys/login'

export function initSso(callback: Function) {
  const token = getUrlParam('X-Access-Token')
  if (token) {
    getDingtalkToToken(token).then((res: any) => {
      // set token
      setAuthCache(TOKEN_KEY, res.data)
      callback()
    })
  }
  else {
    callback()
  }
}

export function getUrlParam(name: string) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i')
  const r = window.location.search.substr(1)
    .match(reg)
  if (r != null)
    return decodeURIComponent(r[2])
  return null
}

export function bwSSOSDKLogin(callback: Function) {
  const { hostname, port } = window.location
  BW_SSO_SDK.SSOLogin(hostname, port, (data: any) => {
    if (!data)
      return false
    else callback()
  })
}
