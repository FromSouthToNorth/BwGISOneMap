<script lang="ts" setup>
import { Button } from 'ant-design-vue'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue'
import { useAppStoreWithOut } from '@/store/modules/app'

import { useMenuSetting } from '@/hooks/setting/useMenuSetting'

const appState = useAppStoreWithOut()

const { menuDrop } = useMenuSetting()

function onClick() {
  appState.setMenuDrop(!menuDrop.value)
}
</script>

<template>
  <Button class="hide-button" size="small" @click="onClick">
    <template #icon>
      <CaretUpOutlined v-if="menuDrop" />
      <CaretDownOutlined v-else />
    </template>
  </Button>
</template>

<style lang="less" scoped>
.hide-button {
  margin-left: 10px;
}
</style>
