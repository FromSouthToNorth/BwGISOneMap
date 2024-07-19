import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

export function useMenuSetting() {
  const appStore = useAppStore()

  const menu = computed(() => appStore.getMenu)
  const menuHide = computed(() => appStore.getMenuHide)
  const menuDrop = computed(() => appStore.getMenuDrop)

  return {
    menu,
    menuDrop,
    menuHide,
  }
}
