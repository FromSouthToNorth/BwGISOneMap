<script lang="ts" setup>
import { nextTick, ref, unref } from 'vue'
import { useScrollTo } from '@/hooks/src/useScrollTo'
import type { ScrollbarType } from '@/components/Scrollbar'
import { Scrollbar } from '@/components/Scrollbar'

defineOptions({ name: 'ScrollContainer' })

defineProps({
  scrollHeight: {
    type: Number,
  },
})

const scrollbarRef = ref<Nullable<ScrollbarType>>(null)

function getScrollWrap() {
  const scrollbar = unref(scrollbarRef)
  if (!scrollbar) {
    return null
  }
  return scrollbar.wrap
}

/**
 * Scroll to the specified position
 */
function scrollTo(to: number, duration = 500) {
  const wrap = unref(getScrollWrap())
  nextTick(() => {
    if (!wrap) {
      return
    }
    const { start } = useScrollTo({
      el: wrap,
      to,
      duration,
    })
    start()
  })
}

/**
 * Scroll to the bottom
 */
function scrollBottom() {
  const wrap = unref(getScrollWrap())
  nextTick(() => {
    if (!wrap) {
      return
    }
    const scrollHeight = wrap.scrollHeight as number
    const { start } = useScrollTo({
      el: wrap,
      to: scrollHeight,
    })
    start()
  })
}

defineExpose({
  scrollTo,
  scrollBottom,
})
</script>

<template>
  <Scrollbar
    ref="scrollbarRef"
    class="scroll-container"
    :scroll-height="scrollHeight"
    v-bind="$attrs"
  >
    <slot />
  </Scrollbar>
</template>

<style lang="less">
  .scroll-container {
    width: 100%;
    height: 100%;

    .scrollbar__wrap {
      margin-bottom: 18px !important;
    }

    .scrollbar__view {
      box-sizing: border-box;
    }
  }
</style>
