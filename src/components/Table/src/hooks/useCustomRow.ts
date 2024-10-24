import { type ComputedRef, unref } from 'vue'
import type { BasicTableProps } from '../types/table'

interface Options {
  emit: EmitType
}

export function useCustomRow(
  propsRef: ComputedRef<BasicTableProps>,
  { emit }: Options,
) {
  const customRow = (record: Recordable, index: number) => {
    return {
      onClick: (e: Event) => {
        e?.stopPropagation()
        try {
          function handleClick() {
            console.warn('handleClick: ', unref(propsRef))
          }
          handleClick()
          emit('rowClick', record, index, e)
        }
        catch (error) {
          console.error(error)
        }
      },
      onDblclick: (event: Event) => {
        emit('rowDbClick', record, index, event)
      },
      // onContextmenu: (event: Event) => {
      //   emit('rowContextmenu', record, index, event)
      // },
      // onMouseenter: (event: Event) => {
      //   emit('rowouseenter', record, index, event)
      // },
      // onMouseleave: (event: Event) => {
      //   emit('rowouseleave', record, index, event)
      // },
    }
  }

  return {
    customRow,
  }
}
