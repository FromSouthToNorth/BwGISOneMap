import type { PropType } from 'vue'
import type { MenuItem } from './types/menu'

export const basicProps = {
  menu: {
    type: [] as PropType<MenuItem[]>,
  },
  menuDrop: { type: Boolean, default: true },
  menuHide: { type: Boolean, default: true },
}
