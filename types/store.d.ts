export interface UserInfo {
  userId: string
  fullName: string
  realName: string
  mineInfo: MineInfo
  isDeviceMark: boolean
  orgCode: string
  userName: string
}

export interface MineInfo {
  id: string
  mineName: string
  mineDesc: string
  x: number
  y: number
  z: number
  b: number
  l: number
  centerB: number
  centerL: number
  centerX: number
  centerY: number
  no_show_satellitemap: number
  gistitle: string
  isundergroud: number
  show_cad: number
  hide_cad: number
  show_map: number
  hide_map: number
  max_zoom?: number
}
