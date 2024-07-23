import { computed } from 'vue'

import { useCadStore } from '@/store/modules/cad'

export function useCadSetting() {
  const cadStore = useCadStore()

  const cads = computed(() => cadStore.getCads)
  const coalSeam = computed(() => cadStore.getCoalSeam)
  const cadName = computed(() => cadStore.getCadName)

  return {
    cads,
    coalSeam,
    cadName,
  }
}
