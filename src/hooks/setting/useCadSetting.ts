import { computed } from 'vue'

import { useCadStore } from '@/store/modules/cad'

export function useCadSetting() {
  const cadStore = useCadStore()

  const cads = computed(() => cadStore.getCads)
  const coalSeam = computed(() => cadStore.getCoalSeam)
  const cadName = computed(() => cadStore.getCadName)
  const defaultCad = computed(() => cadStore.getCads[0].cads[0])

  return {
    cads,
    cadName,
    coalSeam,
    defaultCad,
  }
}
