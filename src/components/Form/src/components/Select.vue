<script setup lang="ts">
import { Select } from 'ant-design-vue'
import { ref, unref } from 'vue'
import { SizeEnum } from '@/enums/sizeEnum'

const sizeRef = ref<'small' | 'large' | undefined>(SizeEnum.SMALL)
const valueRef = ref([])
function onChange() {
  console.log('onChange: ', unref(valueRef))
}
</script>

<template>
  <Select
    v-model:value="valueRef"
    :size="sizeRef"
    class="table-select"
    placeholder="请选择选择"
    mode="multiple"
    :max-tag-count="3"
    :max-tag-text-length="3"
    @change="onChange"
  />
</template>

<style lang="less" scoped>
.table-select {
  min-width: 140px;
  max-width: 250px;
  margin-right: 4px;
}
</style>
