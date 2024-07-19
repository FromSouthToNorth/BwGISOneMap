<script lang="ts" setup>
import { Checkbox } from 'ant-design-vue'
import { ref, watch } from 'vue'
import { useUserSetting } from '@/hooks/web/sys/useUser'
import { addSatelliteTile, removeSatelliteTile } from '@/utils/map/tileLayer'
import { useMenuSetting } from '@/hooks/setting/useSatelliteSetting'

const { mineInfo } = useUserSetting()
const { isSatellite } = useMenuSetting()
const checked = ref(false)
function onChange(e: any) {
  e.target.checked ? addSatelliteTile() : removeSatelliteTile()
}
watch(() => isSatellite.value, (v) => {
  if (v)
    return
  checked.value = v
})
</script>

<template>
  <div
    v-show="!mineInfo.no_show_satellitemap"
    class="satellite right-top-menu-item"
  >
    <Checkbox
      v-model:checked="checked"
      @change="onChange"
    >
      卫星图
    </Checkbox>
  </div>
</template>

<style lang="less" scoped>
</style>
