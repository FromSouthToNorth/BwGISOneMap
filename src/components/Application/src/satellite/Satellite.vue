<script lang="ts" setup>
import { Checkbox, Tooltip } from 'ant-design-vue'
import { useSatelliteSetting } from './hooks/useSatelliteSetting'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { addSatelliteTile, removeSatelliteTile } from '@/utils/map/tileLayer'

const { mineInfo } = useUserSetting()
const { setIsSatellite } = useSatelliteSetting()
function onChange(e: any) {
  const { checked } = e.target
  setIsSatellite(checked)
  checked ? addSatelliteTile() : removeSatelliteTile()
}
</script>

<template>
  <Tooltip title="是否勾选显示卫星图, 最大显示层级为 16 级">
    <div
      v-show="!mineInfo.no_show_satellitemap"
      class="satellite right-top-menu-item"
    >
      <Checkbox
        @change="onChange"
      >
        卫星图
      </Checkbox>
    </div>
  </Tooltip>
</template>

<style lang="less" scoped>
</style>
