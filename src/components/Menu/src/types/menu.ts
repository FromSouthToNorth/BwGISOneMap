import type { ToSwitchTypeEnum } from '@/enums/menuEnum'

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

export interface Model {
  code: number | string
  id: string
  isUpdateZ: number
  moduleName: string
  moduleIds: string
  ordercode: string
  subscribe?: string
}

export interface ToSwitch {
  parameter: Parameter[]
  strategyID: number | string
  title: string
  type: ToSwitchTypeEnum
  url?: string
}

export interface MenuSub {
  id: string
  isUpdateZ: number
  name: string
  ordercode: string
  parent_id: string
  strategy: number | string
  toSwitchs?: ToSwitch[]
  subscribe?: string
  models?: Model[]
}
