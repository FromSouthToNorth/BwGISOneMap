<script lang="ts" setup>
import { Tooltip } from 'ant-design-vue'
import { BankFilled } from '@ant-design/icons-vue'
import { computed, ref, unref, watch } from 'vue'
import { useHideMinePoint } from './hooks/useHideMinePoint'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import {
  createMineBasePoint,
  removeMineBasePoint,
} from '@/utils/map/marker'

const isClickRef = ref(true)

const { getHideMinePoint } = useHideMinePoint()

watch(() => unref(getHideMinePoint), (hide) => {
  isClickRef.value = hide
})

const { mineInfo } = useUserSetting()

function onClick() {
  unref(isClickRef) ? createMineBasePoint() : removeMineBasePoint()
  isClickRef.value = !unref(isClickRef)
}
const getClass = computed(() => !unref(isClickRef) ? 'active' : '')
</script>

<template>
  <Tooltip title="点击显示矿井基点, 再次点击删除">
    <div
      class="mine-name right-top-menu-item"
      :class="getClass"
      @click="onClick"
    >
      <BankFilled />
      {{ mineInfo.mineName }}
    </div>
  </Tooltip>
</template>

<style lang="less" scoped>
.active {
  color: #0958d9;
  font-weight: bold;
}
</style>
