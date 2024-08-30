import { computed, ref, unref } from 'vue'

const modelTabsRef = ref()

export function useModalTabs() {
  function setMenuHide(modelTabs: boolean) {
    modelTabsRef.value = modelTabs
  }

  const getModelTabs = computed(() => unref(modelTabsRef))

  return {
    setMenuHide,
    getModelTabs,
  }
}
