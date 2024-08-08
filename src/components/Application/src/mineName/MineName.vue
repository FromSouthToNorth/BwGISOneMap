<script lang="ts" setup>
import { BankFilled } from '@ant-design/icons-vue'
import { computed, ref, unref } from 'vue'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { createMineBasePoint, removeMineBasePoint } from '@/utils/map/marker'

const { mineInfo } = useUserSetting()
const isClickRef = ref(true)
function onClick() {
  unref(isClickRef) ? createMineBasePoint() : removeMineBasePoint()
  isClickRef.value = !unref(isClickRef)
}
const getClass = computed(() => !unref(isClickRef) ? 'active' : '')
</script>

<template>
  <div
    class="mine-name right-top-menu-item"
    :class="getClass"
    @click="onClick"
  >
    <BankFilled />
    {{ mineInfo.mineName }}
  </div>
</template>

<style lang="less" scoped>
.active {
  color: #0958d9;
}
</style>
