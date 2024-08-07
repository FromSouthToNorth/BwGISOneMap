import { computed, ref, unref } from 'vue'
import type { MenuSub } from '../types/menu'

const menuSubRef = ref<MenuSub[]>()
const activeMenuSubRef = ref<MenuSub>()

export function useMenuSub() {
  function setMenuSub(menuSud: MenuSub[]) {
    menuSubRef.value = menuSud
  }

  function setActiveMenuSub(menuSud: MenuSub) {
    activeMenuSubRef.value = menuSud
  }

  const getMenuSub = computed(() => unref(menuSubRef))
  const getActiveMenuSub = computed(() => unref(activeMenuSubRef))

  return {
    setMenuSub,
    getMenuSub,
    setActiveMenuSub,
    getActiveMenuSub,
  }
}
