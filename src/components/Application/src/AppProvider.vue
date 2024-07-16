<script lang="ts">
import { defineComponent, ref, toRefs, unref } from 'vue'
import { createAppProviderContext } from './useAppContext'
import { createBreakpointListen } from '@/hooks/event/useBreakpoint'
import { prefixCls } from '@/settings/designSetting'
import { contextInit } from '@/utils/mqtt'

const props = {
  prefixCls: { type: String, default: prefixCls },
}
export default defineComponent({
  name: 'AppProvider',
  inheritAttrs: false,
  props,
  setup(props, { slots }) {
    const isMobile = ref(false)
    // Monitor screen breakpoint information changes
    createBreakpointListen(({ screenMap, sizeEnum, width }) => {
      const lgWidth = screenMap.get(sizeEnum.LG)
      if (lgWidth)
        isMobile.value = width.value - 1 < lgWidth
      handleRestoreState()
    })
    const { prefixCls } = toRefs(props)

    // Inject variables into the global
    createAppProviderContext({ prefixCls, isMobile })
    contextInit()
    /**
     * Used to maintain the state before the window changes
     */
    function handleRestoreState() {
      console.warn('handleRestoreState: ', unref(isMobile))
    }
    return () => slots.default?.()
  },
})
</script>
