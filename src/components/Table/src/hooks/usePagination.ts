import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue'
import { computed, h, ref, unref } from 'vue'
import type { PaginationProps } from '../types/pagination'
import { PAGE_SIZE, PAGE_SIZE_OPTIONS } from '../const'
import { isBoolean } from '@/utils/is'

interface ItemRender {
  page: number
  type: 'page' | 'prev' | 'next'
  originalElement: any
}

const show = ref(true)

function itemRender({ page, type, originalElement }: ItemRender) {
  if (type === 'prev') {
    return page === 0 ? null : h(LeftOutlined)
  }
  else if (type === 'next') {
    return page === 1 ? null : h(RightOutlined)
  }
  return originalElement
}

export function usePagination() {
  const configRef = ref<PaginationProps>({})
  const show = ref(true)

  const getPaginationInfo = computed((): PaginationProps | boolean => {
    if (!unref(show)) {
      return false
    }

    return {
      current: 1,
      size: 'small',
      defaultPageSize: PAGE_SIZE,
      showTotal: (total, range) => { return `${range[0]} - ${range[1]} 共 ${total} 条` },
      showSizeChanger: true,
      pageSizeOptions: PAGE_SIZE_OPTIONS,
      itemRender,
      showQuickJumper: true,
      ...unref(configRef),
    }
  })

  function setPagination(info: Partial<PaginationProps>) {
    const paginationInfo = unref(getPaginationInfo)
    configRef.value = {
      ...(!isBoolean(paginationInfo) ? paginationInfo : {}),
      ...info,
    }
  }

  function getPagination() {
    return unref(getPaginationInfo)
  }

  function getShowPagination() {
    return unref(show)
  }

  async function setShowPagination(flag: boolean) {
    show.value = flag
  }

  return {
    setPagination,
    getPagination,
    getPaginationInfo,
    getShowPagination,
    setShowPagination,
  }
}
