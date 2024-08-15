<script setup lang="ts">
import { Table } from 'ant-design-vue'
import {
  computed,
  inject,
  ref,
  toRaw,
  unref,
  useAttrs,
  useSlots,
  watch,
} from 'vue'
import { debounce, omit } from 'lodash-es'
import { useElementSize } from '@vueuse/core'
import { useDataSource } from './hooks/useDataSource'
import { useLoading } from './hooks/useLoading'
import { useColumns } from './hooks/useColumns'
import { usePagination } from './hooks/usePagination'
import { createTableContext } from './hooks/useTableContext'
import type { BasicTableProps, SizeType, TableActionType } from './types/table'
import TableSetting from './components/settings/index.vue'
import { basicProps } from './props'
import { useTableScroll } from './hooks/useTableScroll'
import { useTableScrollTo } from './hooks/useScrollTo'
import { useDesign } from '@/hooks/web/useDesign'
import BasicForm from '@/components/Form/src/BasicForm.vue'
import { PageWrapperFixedHeightKey } from '@/enums/pageEnum'

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
const formRef = ref(null)
const tableElRef = ref(null)
const { prefixCls } = useDesign('basic-table')

const innerPropsRef = ref<Partial<BasicTableProps>>()
const { height } = useElementSize(wrapRef)
const getProps = computed(() => {
  return { ...props, ...unref(innerPropsRef) } as BasicTableProps
})
const isFixedHeightPage = inject(PageWrapperFixedHeightKey, false)

const { getLoading, setLoading } = useLoading()
const { getColumns, setColumns, getViewColumns } = useColumns()

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
  reload,
} = useDataSource()
const { getScrollRef, redoHeight } = useTableScroll(
  getProps,
  tableElRef,
  getDataSourceRef,
  wrapRef,
  formRef,
)

const debounceRedoHeight = debounce(redoHeight, 50)

const { scrollTo } = useTableScrollTo(tableElRef, getDataSourceRef)

const getBindValues = computed(() => {
  const dataSource = unref(getDataSourceRef)
  let propsData: any = {
    ...attrs,
    ...unref(getProps),
    tableLayout: 'fixed',
    scroll: unref(getScrollRef),
    rowKey: unref(getRowKey),
    loading: unref(getLoading),
    columns: toRaw(unref(getViewColumns)),
    pagination: toRaw(unref(getPaginationInfo)),
    dataSource,
    showSorterTooltip: false,
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

watch(height, () => {
  if (unref(isFixedHeightPage) && props.canResize)
    debounceRedoHeight()
})

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
  scrollTo,
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
    <div
      ref="formRef"
      class="table-header"
    >
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
  background: #fff;
}
.table-header {
  display: flex;
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center; /* 垂直方向居中对齐 */
}
</style>
