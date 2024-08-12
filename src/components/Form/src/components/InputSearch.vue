<script setup lang="ts">
import { InputSearch } from 'ant-design-vue'
import { ref, unref } from 'vue'
import { SizeEnum } from '@/enums/sizeEnum'

const sizeRef = ref<'small' | 'large' | undefined>(SizeEnum.SMALL)

const valueRef = ref('')
function onSearch() {
  console.log('onSearch: ', unref(valueRef))
}
</script>

<template>
  <InputSearch
    v-model:value="valueRef"
    class="table-search"
    :size="sizeRef"
    placeholder="输入内容"
    @search="onSearch"
  />
</template>

<style lang="less" scoped>
.table-search {
  width: 180px;
  margin-right: 24px;
}
</style>
