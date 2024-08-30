import type { WatchStopHandle } from 'vue'
import { onUnmounted, ref, toRaw, unref, watch } from 'vue'
import type { Key } from 'ant-design-vue/lib/table/interface'
import type { BasicColumn, BasicTableProps, TableActionType } from '../types/table'
import type { PaginationProps } from '../types/pagination'
import type { DynamicProps } from '#/utils'
import { getDynamicProps } from '@/utils'
import { isProdMode } from '@/utils/env'

type Props = Partial<DynamicProps<BasicTableProps>>

export function useTable(tableProps?: Props): [
  (instance: TableActionType) => void,
  TableActionType & {},
] {
  const tableRef = ref<Nullable<TableActionType>>(null)
  const loadedRef = ref<Nullable<boolean>>(false)

  let stopWatch: WatchStopHandle

  function register(instance: TableActionType) {
    if (isProdMode()) {
      onUnmounted(() => {
        tableRef.value = null
        loadedRef.value = null
      })
    }

    if (unref(loadedRef) && isProdMode() && instance === unref(tableRef))
      return

    tableRef.value = instance
    if (tableProps) {
      instance.setProps(getDynamicProps(tableProps))
    }
    loadedRef.value = true

    stopWatch?.()

    stopWatch = watch(
      () => tableProps,
      () => {
        if (tableProps) {
          instance.setProps(getDynamicProps(tableProps))
        }
      },
      {
        immediate: true,
        deep: true,
      },
    )
  }

  function getTableInstance(): TableActionType {
    const table = unref(tableRef)
    if (!table) {
      console.error('The table instance has not been obtained yet, please make sure the table is presented when performing the table operation!')
    }
    return table as TableActionType
  }

  const methods: TableActionType & {} = {
    reload: async () => {
      return await getTableInstance().reload()
    },
    setProps: (props: Partial<BasicTableProps>) => {
      getTableInstance().setProps(props)
    },
    redoHeight: () => {
      getTableInstance().redoHeight()
    },
    setLoading: (loading: boolean) => {
      getTableInstance().setLoading(loading)
    },
    getDataSource: () => {
      return getTableInstance().getDataSource()
    },
    getSearchInfo: () => {
      return getTableInstance().getSearchInfo()
    },
    getColumns: ({ ignoreIndex = false }: { ignoreIndex?: boolean } = {}) => {
      const columns = getTableInstance().getColumns({ ignoreIndex }) || []
      return toRaw(columns)
    },
    setColumns: (columns: BasicColumn[]) => {
      getTableInstance().setColumns(columns)
    },
    setTableData: (values: any[]) => {
      return getTableInstance().setTableData(values)
    },
    setPagination: (info: Partial<PaginationProps>) => {
      return getTableInstance().setPagination(info)
    },
    getPaginationRef: () => {
      return getTableInstance().getPaginationRef()
    },
    getSize: () => {
      return toRaw(getTableInstance().getSize())
    },
    findTableDataRecord: (keyValue: Key) => {
      return getTableInstance().findTableDataRecord(keyValue)
    },
    setShowPagination: async (show: boolean) => {
      getTableInstance().setShowPagination(show)
    },
    getShowPagination: () => {
      return toRaw(getTableInstance().getShowPagination())
    },
    scrollTo: (pos: string) => {
      getTableInstance().scrollTo(pos)
    },
  }

  return [register, methods]
}
