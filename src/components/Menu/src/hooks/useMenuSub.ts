import { computed, ref, unref } from 'vue'
import type { MenuSub } from '../types/menu'
import {
  publishOneMapDevice,
} from '@/utils/mqtt/publish'

const menuSubRef = ref<MenuSub[]>()
const activeMenuSubRef = ref<MenuSub>()
const menuSubLoadingRef = ref(false)

export function useMenuSub() {
  function setMenuSub(menuSud: MenuSub[]) {
    menuSubRef.value = menuSud
  }
  const getMenuSub = computed(() => unref(menuSubRef))

  function setActiveMenuSub(menuSud: MenuSub) {
    activeMenuSubRef.value = menuSud
  }
  const getActiveMenuSub = computed(() => unref(activeMenuSubRef))

  function setMenuSubLoading(menuHide: boolean) {
    menuSubLoadingRef.value = menuHide
  }
  const getMenuSubLoading = computed(() => unref(menuSubLoadingRef))

  function menuSubClick(menuSub: MenuSub) {
    setMenuSubLoading(true)
    setActiveMenuSub(menuSub)
    publishOneMapDevice(menuSub)
  }

  return {
    setMenuSub,
    getMenuSub,
    setActiveMenuSub,
    getActiveMenuSub,
    setMenuSubLoading,
    getMenuSubLoading,
    menuSubClick,
  }
}
