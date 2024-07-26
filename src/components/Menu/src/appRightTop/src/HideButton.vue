<script lang="ts" setup>
import { Button } from 'ant-design-vue'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue'
import { useMenuDrop } from '../../hooks/useMenuDrop'

const { setMenuDrop, getMenuDrop } = useMenuDrop()

function onClick() {
  setMenuDrop(!getMenuDrop.value)
}
</script>

<template>
  <Button class="hide-button" size="small" @click="onClick">
    <template #icon>
      <CaretUpOutlined v-if="getMenuDrop" />
      <CaretDownOutlined v-else />
    </template>
  </Button>
</template>

<style lang="less" scoped>
.hide-button {
  margin-left: 10px;
}
</style>
