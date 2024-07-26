import { computed, ref, unref } from 'vue'

const menuHideRef = ref(false)

export function useMenuHide() {
  function setMenuHide(menuHide: boolean) {
    menuHideRef.value = menuHide
  }

  const getMenuHide = computed(() => unref(menuHideRef))

  return {
    getMenuHide,
    setMenuHide,
  }
}
