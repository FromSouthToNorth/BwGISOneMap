import { type ComputedRef, computed, ref, toRaw, unref, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { BasicColumn, BasicTableProps } from '../types/table'
import type { PaginationProps } from '../types/pagination'
import { DEFAULT_ALIGN } from '../const'
import { isBoolean, isFunction } from '@/utils/is'
import { SpecialColTypeEnum } from '@/enums/tableEnum'

function handleItem(item: BasicColumn, ellipsis: boolean) {
  const { key, dataIndex, children } = item
  item.align = item.align || DEFAULT_ALIGN
  if (ellipsis) {
    if (!key) {
      item.key = typeof dataIndex == 'object' ? dataIndex.join('-') : dataIndex
    }
    if (!isBoolean(item.ellipsis)) {
      Object.assign(item, {
        ellipsis,
      })
    }
  }
  if (children && children.length) {
    handleChildren(children, !!ellipsis)
  }
}

function handleChildren(children: BasicColumn[] | undefined, ellipsis: boolean) {
  if (!children)
    return
  children.forEach((item) => {
    const { children } = item
    handleItem(item, ellipsis)
    handleChildren(children, ellipsis)
  })
}

export function useColumns(
  propsRef: ComputedRef<BasicTableProps>,
  getPaginationRef: ComputedRef<boolean | PaginationProps>,
) {
  const columnsRef = ref<BasicColumn[]>([])
  const originColumnsRef = ref<BasicColumn[]>([])

  watch(
    () => unref(propsRef).columns,
    (columns) => {
      setColumns(columns)
    },
  )

  function setColumns(columnList: BasicColumn[]) {
    const columnsStr = JSON.stringify(columnList)
    columnList = JSON.parse(columnsStr, funReviver)
    originColumnsRef.value = columnList as BasicColumn[]
    columnsRef.value = columnList.filter((e) => {
      const { dataIndex } = e
      return !Object.values(SpecialColTypeEnum).includes(dataIndex)
    })
  }

  const getColumnsRef = computed(() => {
    const columns = cloneDeep(unref(columnsRef))
    if (!columns) {
      return []
    }
    const { ellipsis } = unref(propsRef)

    columns.forEach((item) => {
      const { customRender, slots } = item

      handleItem(
        item,
        Reflect.has(item, 'ellipsis') ? !!item.ellipsis : !!ellipsis && !customRender && !slots,
      )
    })
    return columns
  })

  function getColumns() {
    const columns = toRaw(unref(getColumnsRef))
    return columns
  }

  const getOriginColumns = computed(() => {
    return toRaw(unref(originColumnsRef))
  })

  const getViewColumns = computed(() => {
    const viewColumns = sortFixedColumn(unref(getColumnsRef))
    const columns = cloneDeep(viewColumns)
    return columns.filter(column => isIfShow(column))
  })

  function isIfShow(column: BasicColumn): boolean {
    const ifShow = column.ifShow

    let isIfShow = true

    if (isBoolean(ifShow)) {
      isIfShow = ifShow
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(column)
    }
    return isIfShow
  }

  return {
    setColumns,
    getColumns,
    getColumnsRef,
    getViewColumns,
    getOriginColumns,
  }
}

function funReviver(_key: string, value: string) {
  if (typeof value === 'string' && value.indexOf(SpecialColTypeEnum._BW_FUNCTION_) === 0) {
    value = value.replace(/_bw_function_/g, 'function')
    // eslint-disable-next-line no-new-func
    const dom = new Function(`return ${value}`)()
    if (typeof dom !== 'function')
      return
    // let { text, record } = this
    return dom
  }
  return value
}

function sortFixedColumn(columns: BasicColumn[]) {
  const fixedLeftColumns: BasicColumn[] = []
  const fixedRightColumns: BasicColumn[] = []
  const defColumns: BasicColumn[] = []
  for (const column of columns) {
    if (column.fixed === 'left') {
      fixedLeftColumns.push(column)
      continue
    }
    if (column.fixed === 'right') {
      fixedRightColumns.push(column)
      continue
    }
    defColumns.push(column)
  }
  // 筛选逻辑
  const filterFunc = (item: any) => !item.defaultHidden
  // 筛选首层显示列（1级表头）
  const viewColumns = [...fixedLeftColumns, ...defColumns, ...fixedRightColumns].filter(filterFunc)
  // 筛选>=2级表头（深度优先）
  const list = [...viewColumns]
  while (list.length) {
    const current = list[0]
    if (Array.isArray(current.children)) {
      current.children = current.children.filter(filterFunc)
      list.shift()
      list.unshift(...current.children)
    }
    else {
      list.shift()
    }
  }
  return viewColumns
}
