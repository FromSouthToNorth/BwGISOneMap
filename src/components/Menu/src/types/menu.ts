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

export interface MenuSub {
  id: string
  isUpdateZ: number
  name: string
  ordercode: string
  parent_id: string
  strategy: number | string
}
