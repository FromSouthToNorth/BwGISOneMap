<script lang="ts" setup>
import type { MenuItem } from '../../types/menu'
import { useDesign } from '@/hooks/web/useDesign'

defineProps<{ menuItem: MenuItem }>()

const { prefixCls } = useDesign('card-grid')
</script>

<template>
  <div
    :class="prefixCls"
  >
    <div
      class="menu-item-icon"
      v-html="menuItem.icon_class"
    />
    <span class="title">{{ menuItem.name }}</span>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-card-grid';
.@{prefix-cls} {
  width: 20%;
  text-align: center;
  overflow: hidden;
  background: @component-background;
  pointer-events: auto;
  transition: all 0.2s;
  padding: 8px 2px;
  cursor: pointer;
}

.@{prefix-cls}:hover {
    position: relative;
    z-index: 1;
    box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.menu-item-icon {
  padding: 4px 0;
}
</style>
