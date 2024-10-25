import { computed, ref, unref } from 'vue'

const fullscreenRef = ref<boolean>(false)

export function useFullScreen() {
  function setFullScreen(fullscreen: boolean) {
    fullscreenRef.value = fullscreen
  }

  const getFullScreen = computed(() => {
    return unref(fullscreenRef)
  })

  return {
    setFullScreen,
    getFullScreen,
  }
}
