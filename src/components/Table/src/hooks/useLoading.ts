import { computed, ref, unref } from 'vue'

const loadingRef = ref(false)

export function useLoading() {
  const getLoading = computed(() => unref(loadingRef))

  function setLoading(loading: boolean) {
    loadingRef.value = loading
  }

  return { getLoading, setLoading }
}
