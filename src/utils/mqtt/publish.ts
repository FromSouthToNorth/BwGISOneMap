import type { LocationQueryValue } from 'vue-router'
import { getMineDesc, getMineName, getToken } from '../auth'
import { isArray } from '../is'
import type { Param, Publish } from './types'
import { mqtt } from '.'

import { useAppStoreWithOut } from '@/store/modules/app'
import type { MenuItem, MenuSub } from '@/components/Menu/src/types/menu'

const appState = useAppStoreWithOut()

const mineName = getMineName() as string
const paramMap = new Map()
paramMap.set('MineName', mineName)

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
    noLink: false,
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
    obj.strategyParams = strategyParams
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
 * 2037 cad 图纸
 * 2003 菜单
 * 3011 矿井边界
 */
const initPublishCode = [2037, 3011, 2003]

function publishInitArray(departmentID: string | LocationQueryValue[]): Publish[] {
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

/**
 * 2037 cad 图纸
 * @param departmentID
 * @returns
 */
export function getCad(departmentID: string | LocationQueryValue[]) {
  return publishContext({
    code: 2037,
    strategyParams: [
      { name: 'departmentID', value: departmentID },
    ],
  })
}

export function publishInit(departmentID: string | LocationQueryValue[]) {
  publishInitArray(departmentID).forEach((e) => {
    mqtt.publish(e)
  })
}

/**
 * 获取子模块
 * @param menu
 */
export function publishOneMapSubMenu(menu: MenuItem) {
  const code = menu.strategy
  const moduleName = menu.name
  const con = publishContext({
    code,
    moduleName,
    strategyParams: [
      { name: 'module_id', value: menu.id },
    ],
  })
  mqtt.publish(con)
}

/**
 *
 * @param menuSub
 */
export function publishOneMapDevice(menuSub: MenuSub) {
  const code = menuSub.strategy
  const moduleName = menuSub.moduleName
  const child_module_id = menuSub.id
  const con = publishContext({
    code,
    moduleName,
    strategyParams: [
      { name: 'child_module_id', value: child_module_id },
    ],
  })
  mqtt.publish(con)
}

export function tabDeviceTable(code: number, device: any) {
  const keyArray: string[] = []
  for (const key in device) {
    keyArray.push(key)
  }
  const paramsMap = keyArray.map((item) => {
    return {
      name: item,
      value: device[item],
    }
  })
  const con = publishContext({
    code,
    strategyParams: paramsMap,
  })
  mqtt.publish(con)
}
