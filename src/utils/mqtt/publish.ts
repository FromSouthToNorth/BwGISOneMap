import type { LocationQueryValue } from 'vue-router'
import { getMineDesc, getMineName, getToken } from '../auth'
import { isArray } from '../is'
import type { Param, Publish } from './types'
import { mqtt } from '.'

import { useAppStoreWithOut } from '@/store/modules/app'

const appState = useAppStoreWithOut()

const mineName = getMineName() as string
const paramMap = new Map()
paramMap.set('mineName', mineName)

export function publishContext(obj: Publish): Publish {
  const token = getToken() as string
  const mineDesc = getMineDesc() as string
  const caller = import.meta.env.VITE_PRODUCT_CODE
  const clientId = mqtt.clientId

  const strategyParams: Param[] = []
  const target: Publish = {
    code: -1,
    token,
    mineDesc,
    caller,
    clientId,
  }

  if (obj.code !== 682) {
    if (isArray(obj.strategyParams)) {
      obj.strategyParams.forEach(({ name, value }) => {
        paramMap.set(name, value)
      })
    }
    paramMap.forEach((value, key) => {
      strategyParams.push({
        name: key,
        value,
      })
    })
    target.strategyParams = strategyParams
  }
  else {
    delete obj.strategyParams
  }

  return Object.assign(target, obj)
}

/**
 * 682 矿井信息
 */
export function publishMineInfo(): Publish {
  const code = 682
  return publishContext({ code })
}

/**
 *
 * 2003 菜单
 * 2037 cad 图纸
 * 3011 矿井边界
 */
const initPublishCode = [3011, 2003, 2037]

export function publishInitArray(departmentID: string | LocationQueryValue[]): Publish[] {
  appState.setPageLoading(true)
  const init = initPublishCode.map((code) => {
    return publishContext({
      code,
      strategyParams: [
        { name: 'departmentID', value: departmentID },
      ],
    })
  })
  return init
}

export function publishInit(departmentID: string | LocationQueryValue[]) {
  publishInitArray(departmentID).forEach((e) => {
    mqtt.publish(e)
  })
}
