import { toRaw } from 'vue'
import { setMineBoundary } from '../map/tileLayer'
import { addSelectCoalSeamSet } from '../map/cadsLayer'
import type { MqttResult } from './types'
import type { MineInfo } from '#/store'
import { MqttFunEnum } from '@/enums/mqttEnum'
import { useUserStoreWithOut } from '@/store/modules/user'

import type { MenuItem } from '@/store/modules/app'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useCadStoreWithOut } from '@/store/modules/cad'
import { useMapSetting } from '@/hooks/web/map/useMap'
import { useUserSetting } from '@/hooks/web/sys/useUser'

const appState = useAppStoreWithOut()
const userStore = useUserStoreWithOut()
const cadStore = useCadStoreWithOut()

export const mqttFunMap = new Map<MqttFunEnum, Function>()

mqttFunMap.set(MqttFunEnum.MINE_INFO, setMineInfo)
mqttFunMap.set(MqttFunEnum.ONE_MAP_CADS, oneMapCads)
mqttFunMap.set(MqttFunEnum.MINE_BOUNDARY, mineBoundary)
mqttFunMap.set(MqttFunEnum.ONE_MAP_MENU, oneMapMenu)

function setMineInfo(result: MqttResult) {
  const mineInfo = result.params.data[0] as unknown as MineInfo
  mineInfo.time = new Date()
  userStore.setMineInfo(mineInfo)
}

/**
 * cad 图纸
 * @param params
 */
function oneMapCads(result: MqttResult) {
  console.warn('oneMapCads:', result.coalSeam)
  const { coalSeam } = result
  coalSeam?.forEach(({ Value }) => {
    addSelectCoalSeamSet(Value)
  })
  cadStore.setCads(result)
  appState.setPageLoading(false)
  const { map } = useMapSetting()

  const { mineInfo } = useUserSetting()
  const { no_show_satellitemap, show_cad } = toRaw(mineInfo.value)
  if (no_show_satellitemap)
    toRaw(map.value).setZoom(show_cad + 1)
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
  appState.setMenu((result.params as unknown) as MenuItem[])
}

export function mqttFun(type: MqttFunEnum, result: MqttResult) {
  const fun = mqttFunMap.get(type)
  if (fun)
    fun(result)
  else
    console.error(`mqttFunMap 内没有找到 ${type} 方法!`)
}
