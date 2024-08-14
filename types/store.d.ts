import type { ErrorTypeEnum } from '@/enums/exceptionEnum'
import type { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum'

export interface UserInfo {
  userId: string
  fullName: string
  realName: string
  mineInfo: MineInfo
  isDeviceMark: boolean
  orgCode: string
  userName: string
  name: string
}

export interface MineInfo {
  x: number
  y: number
  z: number
  b: number
  l: number
  id: string
  centerB: number
  centerL: number
  centerX: number
  centerY: number
  mineName: string
  mineDesc: string
  gistitle: string
  show_cad: number
  hide_cad: number
  show_map: number
  hide_map: number
  max_zoom?: number
  isundergroud: number
  is_show_mineboundary: number
  no_show_satellitemap: number
  time: Date
  satelliteImageToken: string
}

// Lock screen information
export interface LockInfo {
  // Password required
  pwd?: string | undefined
  // Is it locked?
  isLock?: boolean
}

export interface ApiAddress {
  key: string
  val: string
}

// Error-log information
export interface ErrorLogInfo {
  // Type of error
  type: ErrorTypeEnum
  // Error file
  file: string
  // Error name
  name?: string
  // Error message
  message: string
  // Error stack
  stack?: string
  // Error detail
  detail: string
  // Error url
  url: string
  // Error time
  time?: string
}

export interface BeforeMiniState {
  menuCollapsed?: boolean
  menuSplit?: boolean
  menuMode?: MenuModeEnum
  menuType?: MenuTypeEnum
}

export interface TableSetting {
  size: Nullable<SizeType>
  showIndexColumn: Recordable<Nullable<boolean>>
  columns: Recordable<Nullable<Array<ColumnOptionsType>>>
  showRowSelection: Recordable<Nullable<boolean>>
}
