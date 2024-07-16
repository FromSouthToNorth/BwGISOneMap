import { computed, unref } from 'vue'

import { useUserStore } from '@/store/modules/user'

export function useUserSetting() {
  const userStore = useUserStore()

  const mineInfo = computed(() => unref(userStore.getMineInfo))

  return {
    mineInfo,
  }
}
