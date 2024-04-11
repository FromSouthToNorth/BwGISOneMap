import 'leaflet'
import { toLatlngs } from '../map/to'
import type { Params } from './types'
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
mqttFunMap.set(MqttFunEnum.ONE_MAP_CADS, oneMapCads)
mqttFunMap.set(MqttFunEnum.MINE_BOUNDARY, mineBoundary)
mqttFunMap.set(MqttFunEnum.ONE_MAP_MENU, oneMapMenu)

function setMineInfo(params: Params) {
  const mineInfo = params.data[0] as unknown as MineInfo
  console.warn('mineInfo: ', mineInfo)
  userStore.setMineInfo(mineInfo)
}

function oneMapCads(params: Params) {
  console.warn('oneMapCads:', params)
  appState.setPageLoading(false)
}

function mineBoundary(params: Params) {
  const bls = params as unknown as BL[]
  console.warn('mineBoundary', toLatlngs(bls), userStore.getMineInfo)
  console.log(mapStore.getMap)
}

function oneMapMenu(params: Params) {
  console.warn('oneMapMenu', params)
}

export function mqttFun(type: MqttFunEnum, params: Params) {
  const fun = mqttFunMap.get(type)

  if (fun)
    fun(params)
  else
    console.error(`mqttFunMap 内没有找到 ${type} 方法!`)
}
