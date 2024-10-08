import type { BasicColumn } from '@/components/Table/src/types/table'
import type { SubStrategyType, ToSwitchTypeEnum } from '@/enums/menuEnum'

export interface MenuItem {
  id: string
  name: string
  strategy: number
  icon_class: string
  icon_color: string
  background_color: string
  orderCode: string
  noLink?: boolean
  time?: Date
}

export interface BasicMenuProps {
  menu: MenuItem[]
  // 菜单是否展示
  menuDrop: boolean
  // 菜单是否隐藏
  menuHide: boolean
}

export interface Parameter {
  name: string
}

export interface ToSwitch {
  parameter: Parameter[]
  strategyID: number | string
  title: string
  type: ToSwitchTypeEnum
  url?: string
}

export interface SubStrategy {
  columns: BasicColumn[]
  name: string
  type: SubStrategyType
  data_type: string
}

export interface MenuSub {
  id: string
  isUpdateZ: number
  moduleName: string
  ordercode: string
  parent_id: string
  strategy: number | string
  toSwitchs?: ToSwitch[]
  subscribe?: string
  models?: MenuSub[]
  layer?: string
  markType?: string
  tableKey?: string
  count?: string
  markerclusterMaxZoom?: number
  subStrategy: SubStrategy
}
