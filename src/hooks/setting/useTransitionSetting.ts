import { computed } from 'vue'
import { useAppStore } from '@/store/modules/app'

export function useTransitionSetting() {
  const appStore = useAppStore()

  const getOpenPageLoading = computed((): boolean => {
    return !!appStore.getPageLoading
  })

  return {
    getOpenPageLoading,
  }
}
