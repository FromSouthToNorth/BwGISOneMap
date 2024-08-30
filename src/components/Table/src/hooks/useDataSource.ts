import { cloneDeep, isEmpty } from 'lodash-es'
import { type ComputedRef, type Ref, computed, ref, unref, watch, watchEffect } from 'vue'
import type { Key } from 'ant-design-vue/lib/table/interface'
import type { PaginationProps } from '../types/pagination'
import type { BasicTableProps } from '../types/table'
import { useMenuSub } from '@/components/Menu'

interface ActionType {
  getPaginationInfo?: ComputedRef<boolean | PaginationProps>
  setPagination: (info: Partial<PaginationProps>) => void
  setLoading: (loading: boolean) => void
  tableData: Ref<Recordable[]>
}

const { menuSubClick } = useMenuSub()

export function useDataSource(
  propsRef: ComputedRef<BasicTableProps>,
  {
    getPaginationInfo,
    setPagination,
    setLoading,
    tableData,
  }: ActionType,
  emit: EmitType,
) {
  const dataSourceRef = ref<Recordable[]>([])
  const rawDataSourceRef = ref<Recordable>({})

  watchEffect(() => {
    tableData.value = unref(dataSourceRef)
  })

  watch(
    () => unref(propsRef).dataSource,
    () => {
      const { dataSource } = unref(propsRef)
      if (dataSource) {
        rawDataSourceRef.value = dataSource
        dataSourceRef.value = dataSource
      }
    },
    {
      immediate: true,
    },
  )

  const getDataSource = computed(() => unref(dataSourceRef))

  const getRowKey = computed(() => {
    const { rowKey } = unref(propsRef)
    return rowKey
  })

  function handleTableChange({
    setPagination,
    setLoading,
    tableData,
  }: ActionType, pagination: any, _filters: any, sorter: any, _emit: EmitType) {
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
      dataSourceRef.value = tableData.value
    }
    setLoading(false)
  }

  async function reload() {
    menuSubClick()
  }

  function findTableDataRecord(value: Key, key?: string) {
    console.log(value, key)
    const dataSource = cloneDeep(unref(rawDataSourceRef))
    let data: Recordable[] = []
    if (key) {
      data = dataSource.filter((data: any) => {
        return data[key].includes(value)
      })
    }
    else {
      // console.log(columns)
    }
    dataSourceRef.value = data
  }

  return {
    getDataSourceRef: computed(() => unref(dataSourceRef)),
    getDataSource,
    getRowKey,
    handleTableChange,
    reload,
    findTableDataRecord,
  }
}
