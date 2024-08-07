<script lang="ts" setup>
import { ref, unref, watch } from 'vue'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons-vue'
import { useCadSetting } from '../hooks/useCadSetting'
import CoalSeamCheckbox from './CoalSeamCheckbox.vue'
import type { CoalSeam } from '@/utils/mqtt/types'

import {
  SlideYTransition,
} from '@/components/Transtition/index'

const { getCoalSeam } = useCadSetting()
const coalSeamSelect = ref<CoalSeam[]>()
watch(() => unref(getCoalSeam), (coalSeam) => {
  coalSeamSelect.value = coalSeam
})
const hide = ref(true)
</script>

<template>
  <div class="cad-coal-seam-container">
    <div class="cad-coal-seam-head" @click="hide = !hide">
      <CaretDownOutlined v-if="hide" />
      <CaretUpOutlined v-else />
      <span class="cad-coal-seam-title">
        煤层:
      </span>
    </div>
    <component :is="SlideYTransition">
      <div
        v-show="hide"
        class="cad-coal-seam-checkbox-s"
      >
        <CoalSeamCheckbox
          v-for="coalSeam in coalSeamSelect"
          :key="coalSeam.ID"
          :coal-seam="coalSeam"
        />
      </div>
    </component>
  </div>
</template>

<style lang="less" scoped>
.cad-coal-seam-container {
  padding: 6px;
  box-shadow: 0 0 .75rem 0 @component-shadow;
}

.cad-coal-seam-head {
  user-select: none;
  transition: color .3s, transform .3s;
}

.cad-coal-seam-head:hover {
  color: @hover-text-color-base;
}

.cad-coal-seam-title {
  font-size: 14px;
  font-weight: bold;
}
</style>
