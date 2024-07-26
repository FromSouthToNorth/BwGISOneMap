<script lang="ts" setup>
import { useMenuSetting } from '../../hooks/useMenuSetting'
import type { MenuItem as MenuItemType } from '../../types/menu'
import MenuItem from './MenuItem.vue'
import { useDesign } from '@/hooks/web/useDesign'

const emit = defineEmits(['click'])
const { prefixCls } = useDesign('menu-container')

const { getMenu } = useMenuSetting()

function onClick(menuItem: MenuItemType) {
  console.log(menuItem)
  emit('click', menuItem)
}
</script>

<template>
  <div :class="prefixCls">
    <MenuItem
      v-for="m of getMenu"
      :key="m.id" :menu-item="m"
      @click="onClick(m)"
    />
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-menu-container';
.@{prefix-cls} {
  margin-top: 0.5em;
  display: flex;
  flex-wrap: wrap;
  border-radius: 6px;
  overflow: hidden;
}
</style>
