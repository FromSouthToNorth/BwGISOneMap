/*
 * @Author: huangyu 598050554@qq.com
 * @Date: 2024-03-04 16:09:14
 * @LastEditors: huangyu 598050554@qq.com
 * @LastEditTime: 2024-03-11 14:54:53
 * @FilePath: \BwGISOneMap\src\router\routes\guard\permissionGuard.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { Router } from 'vue-router'
import { getToken } from '@/utils/auth'
import { setCache } from '@/utils/cache'
import { TOKEN_KEY } from '@/enums/cacheEnum'

export function createPermissionGuard(router: Router) {
  router.beforeEach(async (to, form, next) => {
    const xs = ['X-Access-Token', 'x-Access-Token']
    // 去掉路径上 X-Access-Token 参数
    const xAccessToken = to.query[xs[0]] || to.query[xs[1]]
    if (xAccessToken) {
      const map = new Map()
      Object.keys(to.query)
        .forEach((key) => {
          if (!xs.includes(key))
            map.set(key, to.query[key])
        })
      const query = Object.fromEntries(map)
      next({ path: to.path, query })
    }
    const { token } = to.query

    if (token) {
      setCache(TOKEN_KEY, token)
      delete to.query.token
      next(to || '/')
      return
    }

    const attToken = getToken()
    if (attToken)
      next()
  })
}
