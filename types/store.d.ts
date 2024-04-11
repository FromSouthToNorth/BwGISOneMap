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

}
