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
import { createTableContext } from './hooks/useTableContext'
import type { BasicTableProps, SizeType, TableActionType } from './types/table'
import TableSetting from './components/settings/index.vue'
import { basicProps } from './props'
import { useDesign } from '@/hooks/web/useDesign'
import BasicForm from '@/components/Form/src/BasicForm.vue'

defineOptions({ name: 'BasicTable' })

const props = defineProps(basicProps)

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

const tableData = ref([])
const showName = ref(false)
const wrapRef = ref(null)
const tableElRef = ref(null)

const innerPropsRef = ref<Partial<BasicTableProps>>()

const { getLoading, setLoading } = useLoading()
const { getColumns, setColumns } = useColumns()
const {
  getPaginationInfo,
  setPagination,
  getPagination,
} = usePagination()
const {
  getDataSource,
  setDataSource,
  getDataSourceRef,
  getRowKey,
  handleTableChange: onTableChange,
  getScrollX,
  reload,
} = useDataSource()

const { prefixCls } = useDesign('basic-table')

const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) } as BasicTableProps
})

const getBindValues = computed(() => {
  const dataSource = unref(getDataSourceRef)
  let propsData: any = {
    ...attrs,
    ...unref(getProps),
    tableLayout: 'fixed',
    rowKey: unref(getRowKey),
    loading: unref(getLoading),
    columns: toRaw(unref(getColumns)),
    pagination: toRaw(unref(getPaginationInfo)),
    dataSource,
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

function setProps(props: Partial<BasicTableProps>) {
  innerPropsRef.value = { ...unref(innerPropsRef), ...props }
}

const tableAction: TableActionType = {
  setProps,
  getDataSourceRef,
  getDataSource,
  setDataSource,
  setPagination,
  setColumns,
  setLoading,
  getPaginationRef: getPagination,
  getColumns,
  reload,
  emit,
  getSize: () => {
    return unref(getBindValues).size as SizeType
  },
}

createTableContext({ ...tableAction, wrapRef, getBindValues })

defineExpose({ tableElRef, ...tableAction })
</script>

<template>
  <div
    ref="wrapRef"
    :class="prefixCls"
  >
    <div class="table-header">
      <BasicForm />
      <TableSetting />
    </div>
    <Table
      v-bind="getBindValues"
      ref="tableElRef"
      @change="handleTableChange"
    />
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-basic-table';
.@{prefix-cls} {
  background: #fff
}
.table-header {
  display: flex;
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center; /* 垂直方向居中对齐 */
}
</style>
