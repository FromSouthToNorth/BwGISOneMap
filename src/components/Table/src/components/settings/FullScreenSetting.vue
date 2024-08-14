<script lang="ts" setup>
import { Tooltip } from 'ant-design-vue'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { useFullscreen } from '@vueuse/core'
import { useTableContext } from '../../hooks/useTableContext'

defineOptions({ name: 'FullScreenSetting' })

const table = useTableContext()
const { toggle, isFullscreen } = useFullscreen(table.wrapRef)
</script>

<template>
  <Tooltip placement="top">
    <template #title>
      <span>全屏</span>
    </template>
    <FullscreenOutlined v-if="!isFullscreen" @click="toggle" />
    <FullscreenExitOutlined v-else @click="toggle" />
  </Tooltip>
</template>
