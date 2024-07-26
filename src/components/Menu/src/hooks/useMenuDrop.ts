import { computed, ref, unref } from 'vue'

const menuDropRef = ref(true)

export function useMenuDrop() {
  function setMenuDrop(menuHide: boolean) {
    menuDropRef.value = menuHide
  }

  const getMenuDrop = computed(() => unref(menuDropRef))

  return {
    setMenuDrop,
    getMenuDrop,
  }
}
