<script lang="ts" setup>
import { BankFilled } from '@ant-design/icons-vue'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'

const { mineInfo } = useUserSetting()
</script>

<template>
  <div class="mine-name right-top-menu-item">
    <BankFilled />
    {{ mineInfo.mineName }}
  </div>
</template>

<style lang="less" scoped>
</style>
