import type { Params } from './types'
import type { MineInfo } from '#/store'
import { MqttFunEnum } from '@/enums/mqttEnum'
import { useUserStoreWithOut } from '@/store/modules/user'

export const mqttFunMap = new Map<MqttFunEnum, Function>()

const userStore = useUserStoreWithOut()

mqttFunMap.set(MqttFunEnum.MINE_INFO, setMineInfo)

function setMineInfo(params: Params) {
  const mineInfo = params.data[0] as unknown as MineInfo
  userStore.setMineInfo(mineInfo)
}

export function mqttFun(type: MqttFunEnum, params: Params) {
  const fun = mqttFunMap.get(type)

  if (fun)
    fun(params)
  else
    console.error(`mqttFunMap 内没有找到 ${type} 方法!`)
}
