<script lang="ts" setup>
import { ref } from 'vue'
import { Button, Checkbox } from 'ant-design-vue'
import { isArray } from '@/utils/is'
import {
  SlideYTransition,
} from '@/components/Transtition/index'

import {
  addSelectDwgLayerSet,
  deleteSelectDwgLayerSet,
  hasDwgLayerSet,
} from '@/utils/map/cadsLayer'

import type { Cad } from '@/utils/mqtt/types'

const props = defineProps<{ item: Cad }>()

const dwgId = ref('')
function onclick(id: string) {
  if (dwgId.value === id)
    id = ''
  dwgId.value = id
}

function onLChange(checked: boolean, dwgLayer: string) {
  checked ? addSelectDwgLayerSet(dwgLayer, props.item) : deleteSelectDwgLayerSet(dwgLayer, props.item)
}
</script>

<template>
  <Button
    v-show="isArray(item.Layers)"
    type="link"
    @click="onclick(item.dwgId)"
  >
    图层
  </Button>
  <component :is="SlideYTransition">
    <div
      v-show="(dwgId === item.dwgId) && isArray(item.Layers)"
      class="cad-layers"
    >
      <div
        v-for="l in item.Layers"
        :key="l.DwgLayer"
      >
        <Checkbox
          :checked="hasDwgLayerSet(l.DwgLayer)"
          @change="onLChange($event.target.checked, l.DwgLayer)"
        >
          <span class="">{{ l.DwgLayer }}</span>
        </Checkbox>
      </div>
    </div>
  </component>
</template>

<style lang="less" scoped>
.cad-layers {
  width: 220px;
  height: 200px;
  margin: 4px 0;
  padding: 8px;
  overflow-x: hidden;
  border-radius: 4px;
  box-shadow: 0 0.5rem 0.5rem 0.5rem @component-shadow;
}
</style>
