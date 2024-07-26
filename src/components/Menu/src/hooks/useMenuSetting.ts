import { computed, ref, unref } from 'vue'
import type { MenuItem } from '../types/menu'

const menuRef = ref<MenuItem[]>([])

export function useMenuSetting() {
  function setMenu(menu: MenuItem[]) {
    menuRef.value = menu
  }

  const getMenu = computed(() => unref(menuRef))

  return {
    getMenu,
    setMenu,
  }
}
