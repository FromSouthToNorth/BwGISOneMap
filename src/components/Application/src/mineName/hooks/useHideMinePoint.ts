import { computed, ref, unref } from 'vue'

const hideMinePointRef = ref(true)

export function useHideMinePoint() {
  function seHideMinePoint(hideMinePoint: boolean) {
    hideMinePointRef.value = hideMinePoint
  }

  const getHideMinePoint = computed(() => unref(hideMinePointRef))

  return {
    seHideMinePoint,
    getHideMinePoint,
  }
}
