import { getMineDesc, getToken } from '../auth'
import { mqtt } from '.'

export function publishContext(obj: object): object {
  const token = getToken()
  const mineDesc = getMineDesc()
  const caller = import.meta.env.VITE_PRODUCT_CODE
  const clientId = mqtt.clientId
  return Object.assign(obj, {
    token,
    mineDesc,
    caller,
    clientId,
  })
}

/**
 * 获取矿井信息 发布消息 PayloadType 682
 */
export function publishGetMineInfo() {
  return publishContext({
    code: 682,
  })
}
