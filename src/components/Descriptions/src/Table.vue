<script setup lang="ts">
import { ref, unref, watch } from 'vue'
import {
  BasicTable,
  BodyCell,
} from '@/components/Table'
import { useTableStting } from '@/hooks/web/sys/useTableStting'

const props = defineProps<{ columns: any }>()

const { subDataSource } = useTableStting()
const tableSource = ref({
  key: '',
  columns: [],
  dataSource: [],
})
watch(() => unref(subDataSource).dataSource, () => {
  const table = unref(subDataSource)
  tableSource.value.key = table.key
  tableSource.value.dataSource = table.dataSource || []
  tableSource.value.columns = props.columns
})
</script>

<template>
  <BasicTable
    :columns="tableSource.columns"
    :data-source="tableSource.dataSource"
    :row-key="tableSource.key"
    :table-setting="{
      redo: false,
      size: true,
      setting: false,
      fullScreen: false,
    }"
  >
    <template #bodyCell="{ column, record, text }">
      <BodyCell
        v-if="column"
        :column="column"
        :record="record"
        :text="text"
      />
    </template>
  </BasicTable>
</template>
