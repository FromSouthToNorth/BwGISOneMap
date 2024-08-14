<script lang="ts" setup>
import type { PropType } from 'vue'
import { computed, unref } from 'vue'
import type { TableSetting } from '../../types/table'
import { useTableContext } from '../../hooks/useTableContext'
import SizeSetting from './SizeSetting.vue'
import RedoSetting from './RedoSetting.vue'
import FullScreenSetting from './FullScreenSetting.vue'

defineOptions({ name: 'TableSetting' })

const props = defineProps({
  setting: {
    type: Object as PropType<TableSetting>,
    default: () => ({}),
  },
})

const table = useTableContext()

const getSetting = computed((): TableSetting => {
  return {
    redo: true,
    size: true,
    setting: true,
    settingCache: false,
    fullScreen: true,
    ...props.setting,
  }
})

function getTableContainer() {
  return table ? unref(table.wrapRef) : document.body
}
</script>

<template>
  <div class="table-settings">
    <RedoSetting v-if="getSetting.redo" :get-popup-container="getTableContainer" />
    <SizeSetting v-if="getSetting.size" :get-popup-container="getTableContainer" />
    <FullScreenSetting v-if="getSetting.fullScreen" :get-popup-container="getTableContainer" />
  </div>
</template>

<style lang="less">
  .table-settings {
    & > * {
      margin-right: 12px;
    }

    svg {
      width: 1.3em;
      height: 1.3em;
    }
  }
</style>
