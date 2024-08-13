import { computed, ref, unref } from 'vue'

const columnsRef = ref([])

export function useColumns() {
  function setColumns(columns: []) {
    columnsRef.value = columns
  }
  const getColumns = computed(() => unref(columnsRef))

  return {
    setColumns,
    getColumns,
  }
}
