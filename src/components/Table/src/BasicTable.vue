<script setup lang="ts">
import { Divider, Table } from 'ant-design-vue'
import { ref } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'
import BasicForm from '@/components/Form/src/BasicForm.vue'

const wrapRef = ref(null)
const tableElRef = ref(null)

const { prefixCls } = useDesign('basic-table')
</script>

<template>
  <div
    ref="wrapRef"
    :class="prefixCls"
  >
    <Divider />
    <BasicForm />
    <Table ref="tableElRef" />
  </div>
</template>
