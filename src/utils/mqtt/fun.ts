import type { Params } from './types'
import type { MineInfo } from '#/store'
import { MqttFunEnum } from '@/enums/mqttEnum'
import { useUserStoreWithOut } from '@/store/modules/user'

export const mqttFunMap = new Map<MqttFunEnum, Function>()

const userStore = useUserStoreWithOut()

mqttFunMap.set(MqttFunEnum.MINE_INFO, setMineInfo)
mqttFunMap.set(MqttFunEnum.ONE_MAP_CADS, oneMapCads)
mqttFunMap.set(MqttFunEnum.ONE_MAP_CADS, oneMapCads)
mqttFunMap.set(MqttFunEnum.MINE_BOUNDARY, mineBoundary)
mqttFunMap.set(MqttFunEnum.ONE_MAP_MENU, oneMapMenu)

function setMineInfo(params: Params) {
  const mineInfo = params.data[0] as unknown as MineInfo
  console.log('mineInfo: ', mineInfo)
  userStore.setMineInfo(mineInfo)
}

function oneMapCads(params: Params) {
  console.log('oneMapCads:', params)
}

function mineBoundary(params: Params) {
  console.log('mineBoundary', params)
}

function oneMapMenu(params: Params) {
  console.log('oneMapMenu', params)
}

export function mqttFun(type: MqttFunEnum, params: Params) {
  const fun = mqttFunMap.get(type)

  if (fun)
    fun(params)
  else
    console.error(`mqttFunMap 内没有找到 ${type} 方法!`)
}
