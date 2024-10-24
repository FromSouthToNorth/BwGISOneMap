<script setup lang="ts">
import { Descriptions } from 'ant-design-vue'
import { BodyCell } from '@/components/Table'

defineProps<{ columns: any[], data: any }>()
</script>

<template>
  <Descriptions size="small" bordered>
    <Descriptions.Item
      v-for="(column, index) in columns"
      :key="index"
      :label="column.title"
    >
      <BodyCell
        :column="column"
        :record="data"
        :text="data[column.dataIndex]"
      />
    </Descriptions.Item>
  </Descriptions>
</template>
