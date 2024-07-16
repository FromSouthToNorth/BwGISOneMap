import { setMineBoundary } from '../map/tileLayer'
import type { MqttResult } from './types'
import type { MineInfo } from '#/store'
import { MqttFunEnum } from '@/enums/mqttEnum'
import { useUserStoreWithOut } from '@/store/modules/user'

import { useAppStoreWithOut } from '@/store/modules/app'
import { useMapStoreWithOut } from '@/store/modules/map'

const appState = useAppStoreWithOut()
const userStore = useUserStoreWithOut()
const mapStore = useMapStoreWithOut()

export const mqttFunMap = new Map<MqttFunEnum, Function>()

mqttFunMap.set(MqttFunEnum.MINE_INFO, setMineInfo)
mqttFunMap.set(MqttFunEnum.ONE_MAP_CADS, oneMapCads)
mqttFunMap.set(MqttFunEnum.MINE_BOUNDARY, mineBoundary)
mqttFunMap.set(MqttFunEnum.ONE_MAP_MENU, oneMapMenu)

function setMineInfo(result: MqttResult) {
  const mineInfo = result.params.data[0] as unknown as MineInfo
  console.warn('mineInfo: ', mineInfo)
  userStore.setMineInfo(mineInfo)
}

/**
 * cad 图纸
 * @param params
 */
function oneMapCads(result: MqttResult) {
  console.warn('oneMapCads:', result.params)
  mapStore.setCads(result)
  appState.setPageLoading(false)
}

/**
 * 矿井边界
 * @param params
 */
function mineBoundary(result: MqttResult) {
  const bls = result.params as unknown as BL[]
  setMineBoundary(bls)
}

function oneMapMenu(result: MqttResult) {
  console.warn('oneMapMenu', result.params)
}

export function mqttFun(type: MqttFunEnum, result: MqttResult) {
  const fun = mqttFunMap.get(type)
  if (fun)
    fun(result)
  else
    console.error(`mqttFunMap 内没有找到 ${type} 方法!`)
}
