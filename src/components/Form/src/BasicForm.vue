<script setup lang="ts">
import { ref } from 'vue'
import InputSearch from './components/InputSearch.vue'
import Select from './components/Select.vue'
import { useDesign } from '@/hooks/web/useDesign'

const formElRef = ref(null)
const { prefixCls } = useDesign('basic-form')
</script>

<template>
  <div
    ref="formElRef"
    :class="prefixCls"
  >
    <InputSearch />
    <Select />
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-basic-form';
.@{prefix-cls} {
  display: flex;
  margin: 6px 0;
}
</style>
