import { computed, ref, unref } from 'vue'
import type { MenuSub } from '../types/menu'

const menuSubRef = ref<MenuSub[]>()

export function useMenuSub() {
  function setMenuSub(menuSud: MenuSub[]) {
    menuSubRef.value = menuSud
  }

  const getMenuSub = computed(() => unref(menuSubRef))

  return {
    setMenuSub,
    getMenuSub,
  }
}
