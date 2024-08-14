import { computed, ref, unref } from 'vue'
import type { BasicColumn } from '../types/table'
import { useDataSource } from './useDataSource'
import { specialColTypeEnum } from '@/enums/tableEnum'

const { setScrollX } = useDataSource()

const columnsRef = ref<Partial<BasicColumn>[] | (string | string[])[]>([])
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
  function setColumns(columnList: Partial<BasicColumn>[] | (string | string[])[]) {
    const columnsStr = JSON.stringify(columnList)
    columnList = JSON.parse(columnsStr, funReviver)
    const col: any[] = []
    columnList.forEach((c: any) => {
      const { dataIndex } = c.value
      if (dataIndex === specialColTypeEnum.SCROLL_X) {
        setScrollX(c.value[dataIndex])
      }
      else {
        col.push(c.value)
      }
    })
    columnsRef.value = col
  }
  const getColumns = computed(() => unref(columnsRef))

  const getSpecialColumns = computed(() => unref(specialColumnsRef))

  return {
    setColumns,
    getColumns,
    getSpecialColumns,
  }
}
