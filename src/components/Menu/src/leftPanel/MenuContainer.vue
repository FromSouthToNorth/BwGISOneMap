<script lang="ts" setup>
import MenuItem from './MenuItem.vue'
import { useDesign } from '@/hooks/web/useDesign'
import { useMenuSetting } from '@/hooks/setting/useMenuSetting'

const { prefixCls } = useDesign('menu-container')
const { menu } = useMenuSetting()
</script>

<template>
  <div :class="prefixCls">
    <MenuItem v-for="m of menu" :key="m.id" :menu-item="m" />
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
