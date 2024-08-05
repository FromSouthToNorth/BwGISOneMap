<script lang="ts" setup>
import { Button } from 'ant-design-vue'
import type { MenuSub } from '../../types/menu'

const props = defineProps<{ menuSub: MenuSub, activeTabKey: string }>()
const emit = defineEmits(['menuSubClick'])

function onClick() {
  emit('menuSubClick', props.menuSub)
}
</script>

<template>
  <Button
    size="small"
    :type="menuSub.id === activeTabKey ? 'primary' : 'text'"
    @click="onClick"
  >
    {{ menuSub.name }}
  </Button>
</template>

<style lang="less" scoped>
</style>
