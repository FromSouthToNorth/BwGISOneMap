import { getMineDesc, getToken } from '../auth'
import type { Publish } from './types'
import { mqtt } from '.'

export function publishContext(obj: object): Publish {
  const token = getToken() as string
  const mineDesc = getMineDesc() as string
  const caller = import.meta.env.VITE_PRODUCT_CODE
  const clientId = mqtt.clientId
  return Object.assign({
    code: -1,
    token,
    mineDesc,
    caller,
    clientId,
  }, obj)
}

/**
 * 获取矿井信息 发布消息 PayloadType 682
 */
export function publishGetMineInfo(): Publish {
  return publishContext({
    code: 682,
  })
}
