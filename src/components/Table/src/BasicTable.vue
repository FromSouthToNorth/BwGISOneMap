<script setup lang="ts">
import { Table } from 'ant-design-vue'
import {
  computed,
  ref,
  toRaw,
  unref,
  useAttrs,
  useSlots,
} from 'vue'
import { omit } from 'lodash-es'
import { useDataSource } from './hooks/useDataSource'
import { useLoading } from './hooks/useLoading'
import { useColumns } from './hooks/useColumns'
import { usePagination } from './hooks/usePagination'
import { useDesign } from '@/hooks/web/useDesign'
import BasicForm from '@/components/Form/src/BasicForm.vue'

defineOptions({ name: 'BasicTable' })

const emit = defineEmits([
  'fetchSuccess',
  'fetchError',
  'selectionChange',
  'register',
  'rowClick',
  'rowDbClick',
  'rowContextmenu',
  'rowMouseenter',
  'rowMouseleave',
  'editEnd',
  'editCancel',
  'editRowEnd',
  'editChange',
  'expandedRowsChange',
  'change',
  'columnsChange',
])

const attrs = useAttrs()
const slots = useSlots()

const { getLoading, setLoading } = useLoading()
const { getColumns } = useColumns()
const { getPaginationInfo, setPagination } = usePagination()

const wrapRef = ref(null)
const tableElRef = ref(null)
const tableData = ref([])
const {
  getDataSourceRef,
  getRowKey,
  handleTableChange: onTableChange,
  getScrollX,
} = useDataSource()

const { prefixCls } = useDesign('basic-table')

const getBindValues = computed(() => {
  const dataSource = unref(getDataSourceRef)
  let propsData: any = {
    ...attrs,
    tableLayout: 'fixed',
    rowKey: unref(getRowKey),
    loading: unref(getLoading),
    columns: toRaw(unref(getColumns)),
    pagination: toRaw(unref(getPaginationInfo)),
    dataSource,
    size: 'small',
    scroll: unref(getScrollX),
  }
  propsData = omit(propsData, ['class', 'onChange'])

  return propsData
})
function handleTableChange(pagination: any, filters: any, sorter: any) {
  onTableChange({
    setPagination,
    setLoading,
    tableData,
  }, pagination, filters, sorter, emit)
}
</script>

<template>
  <div
    ref="wrapRef"
  >
    <BasicForm />
    <Table
      v-bind="getBindValues"
      ref="tableElRef"
      :class="prefixCls"
      @change="handleTableChange"
    />
  </div>
</template>
