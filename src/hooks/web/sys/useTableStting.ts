import { computed } from 'vue'

import { useTableSettingStore } from '@/store/modules/tableSetting'

export function useTableStting() {
  const tableStore = useTableSettingStore()

  const deviceDataSource = computed(() => tableStore.getDeviceDataSource)
  const subDataSource = computed(() => tableStore.getSubDataSource)

  return {
    subDataSource,
    deviceDataSource,
  }
}
