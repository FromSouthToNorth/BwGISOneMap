import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

export function useMenuSetting() {
  const appStore = useAppStore()

  const isSatellite = computed(() => appStore.getIsSatellite)

  return {
    isSatellite,
  }
}
