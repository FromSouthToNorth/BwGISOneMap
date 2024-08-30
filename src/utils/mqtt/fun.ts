import { toRaw, unref } from 'vue'
import { setMineBoundary } from '../map/tileLayer'
import { addSelectCoalSeamSet } from '../map/cadsLayer'
import { isArray } from '../is'
import { setLayer } from '../map'
import type { MqttResult } from './types'
import type { MineInfo } from '#/store'
import { MqttFunEnum } from '@/enums/mqttEnum'
import { useUserStoreWithOut } from '@/store/modules/user'

import type { MenuItem, MenuSub } from '@/components/Menu/src/types/menu'
import { useCadSetting } from '@/components/Application/src/cad'
import { useMenuSetting, useMenuSub } from '@/components/Menu'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useTableSettingStore } from '@/store/modules/tableSetting'
import { useMessage } from '@/hooks/web/useMessage'

import {
  useTableLoading,
} from '@/components/Table'

const { createMessage, createErrorModal } = useMessage()
const { setCad, setCoalSeam } = useCadSetting()
const {
  setMenuSub,
  setActiveMenuSub,
  getActiveMenuSub,
  setMenuSubLoading,
} = useMenuSub()

const { setLoading: setTableLoading } = useTableLoading()

const appState = useAppStoreWithOut()
const userStore = useUserStoreWithOut()
const tableStore = useTableSettingStore()

export const mqttFunMap = new Map<MqttFunEnum, Fn>()

mqttFunMap.set(MqttFunEnum.MINE_INFO, setMineInfo)
mqttFunMap.set(MqttFunEnum.MINE_BOUNDARY, mineBoundary)
mqttFunMap.set(MqttFunEnum.ONE_MAP_CADS, oneMapCads)
mqttFunMap.set(MqttFunEnum.ONE_MAP_MENU, oneMapMenu)
mqttFunMap.set(MqttFunEnum.ONE_MAP_SUB_MENU, oneMapSubMenu)
mqttFunMap.set(MqttFunEnum.ONE_MAP_DEVICE, oneMapDevice)
mqttFunMap.set(MqttFunEnum.PROMPT_MESSAGE, promptMessage)

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
  console.warn('oneMapCads:', result)
  const { coalSeam, params } = result
  const id = getStrategyId(result.topic)
  if (!isArray(coalSeam) && !coalSeam!.length)
    createErrorModal({ title: '警告提示', content: `[${id}]策略查询煤层数据为空` })

  if (!isArray(params) && !params.length)
    createErrorModal({ title: '警告提示', content: `[${id}]策略查询图纸数据为空` })

  coalSeam?.forEach(({ Value }) => {
    addSelectCoalSeamSet(Value)
  })
  setCoalSeam(coalSeam!)
  setCad(params)
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
  const { setMenu } = useMenuSetting()
  setMenu((result.params as unknown) as MenuItem[])
}

function oneMapSubMenu(result: MqttResult) {
  setMenuSub(result.params as unknown as MenuSub[])
}

function oneMapDevice(result: MqttResult) {
  console.warn('oneMapDevice: ', result)
  const { params } = result
  const {
    key,
    dwg,
    data,
    layer,
    count,
    markconfig,
    subStrategy,
    columns: col,
    drawMarkerType,
  } = params
  const menuSub = toRaw(unref(getActiveMenuSub))
  menuSub!.markType = drawMarkerType
  menuSub!.layer = layer
  menuSub!.tableKey = key
  menuSub!.count = count
  menuSub!.subStrategy = subStrategy

  setActiveMenuSub(menuSub!)
  const columns = col.map((e: any) => {
    return e.value
  })
  const dataSource = data.map((e: any) => {
    return { ...e, menuSub, markconfig }
  })
  tableStore.setDeviceDataSource({
    key,
    columns,
    dataSource,
  })
  if (verifyData(result)) {
    return
  }
  setLayer(dataSource, menuSub!, markconfig)
}

function promptMessage(result: MqttResult) {
  const { params } = result
  createErrorModal({ title: '策略错误提示', content: params.mesg })
  setMenuSubLoading(false)
}

export function mqttFun(type: MqttFunEnum, result: MqttResult) {
  const fun = mqttFunMap.get(type)
  if (fun) {
    fun(result)
  }
  else {
    createMessage.error(`mqttFunMap 内没有找到 ${type} 方法!`)
  }
}

function getStrategyId(topic: string): string {
  const topics = topic.split('/')
  return topics[topics.length - 1]
}

function verifyData(result: MqttResult): boolean {
  const { params } = result
  setMenuSubLoading(false)
  setTableLoading(false)
  if (!params.data) {
    const id = getStrategyId(result.topic)
    createMessage.warn(`${id} 策略，没有查询到数据！`)
    return true
  }
  else {
    return false
  }
}
