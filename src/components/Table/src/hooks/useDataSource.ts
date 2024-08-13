import { isEmpty } from 'lodash-es'
import { type ComputedRef, type Ref, computed, ref, unref } from 'vue'
import type { PaginationProps } from '../types/pagination'

interface ActionType {
  getPaginationInfo?: ComputedRef<boolean | PaginationProps>
  setPagination: (info: Partial<PaginationProps>) => void
  setLoading: (loading: boolean) => void
  tableData: Ref<Recordable[]>
}

const dataSourceRef = ref([])
const rowKeyRef = ref('')

export function useDataSource() {
  function setDataSource(dataSource: []) {
    dataSourceRef.value = dataSource
  }
  const getDataSource = computed(() => unref(dataSourceRef))

  function setRowKey(key: string) {
    rowKeyRef.value = key
  }
  const getRowKey = computed(() => unref(rowKeyRef))

  function handleTableChange({
    setPagination,
    setLoading,
    tableData,
  }: ActionType, pagination: any, _filters: any, sorter: any) {
    setPagination(pagination)
    setLoading(true)
    if (!isEmpty(sorter)) {
      const { order, field } = sorter
      tableData.value = [...unref(getDataSource)].sort((a: any, b: any) => {
        if (order === 'ascend') {
          return a[field] > b[field] ? 1 : -1
        }
        else {
          return a[sorter.field] < b[sorter.field] ? 1 : -1
        }
      })
    }
    setLoading(false)
  }

  return {
    getDataSourceRef: computed(() => unref(dataSourceRef)),
    setDataSource,
    getDataSource,
    setRowKey,
    getRowKey,
    handleTableChange,
  }
}
