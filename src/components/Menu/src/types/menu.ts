export interface MenuItem {
  id: string
  name: string
  strategy: number
  icon_class: string
  icon_color: string
  background_color: string
  time?: Date
}

export interface BasicMenuProps {

  menu: MenuItem[]

  // 菜单是否展示
  menuDrop: boolean

  // 菜单是否隐藏
  menuHide: boolean

}
