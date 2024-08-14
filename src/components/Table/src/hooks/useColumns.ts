import { computed, ref, unref } from 'vue'
import { cloneDeep } from 'lodash-es'
import type { BasicColumn } from '../types/table'
import { specialColTypeEnum } from '@/enums/tableEnum'

const columnsRef = ref<BasicColumn[]>([])
const originColumnsRef = ref<BasicColumn[]>([])
const specialColumnsRef = ref({})

function funReviver(_key: string, value: string) {
  if (typeof value === 'string' && value.indexOf(specialColTypeEnum._BW_FUNCTION_) === 0) {
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

export function useColumns() {
  function setColumns(columnList: BasicColumn[]) {
    const columnsStr = JSON.stringify(columnList)

    columnList = JSON.parse(columnsStr, funReviver)
    const col: BasicColumn[] = []
    columnList.forEach((c: any) => {
      const { dataIndex, customRender } = c
      if (Object.values(specialColTypeEnum).includes(dataIndex)) {
        // setScrollX(c.value[dataIndex])
      }
      else if (customRender) {
        //
      }
      else {
        col.push(c)
      }
      originColumnsRef.value.push(c)
    })
    columnsRef.value = col
  }
  const getColumns = computed(() => unref(columnsRef))

  const getSpecialColumns = computed(() => unref(specialColumnsRef))

  const getViewColumns = computed(() => {
    const viewColumns = sortFixedColumn(unref(columnsRef))
    const columns = cloneDeep(viewColumns)
    console.log(columns)
    return columns
  })

  return {
    setColumns,
    getColumns,
    getSpecialColumns,
    getViewColumns,
  }
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
