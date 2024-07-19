import { computed } from 'vue'

import { useUserStore } from '@/store/modules/user'

export function useUserSetting() {
  const userStore = useUserStore()

  const mineInfo = computed(() => userStore.getMineInfo)
  const userInfo = computed(() => userStore.getUserInfo)

  return {
    mineInfo,
    userInfo,
  }
}
