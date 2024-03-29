import { computed } from 'vue'

import { useUserStore } from '@/store/modules/user'

export const userStore = useUserStore()

export const mineInfo = computed(() => userStore.getMineInfo)
