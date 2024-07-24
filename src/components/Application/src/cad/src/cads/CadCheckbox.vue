<script lang="ts" setup>
import { WarningTwoTone } from '@ant-design/icons-vue'
import { Checkbox, Tooltip } from 'ant-design-vue'
import Layers from './Layers.vue'
import type { Cad, CadType } from '@/utils/mqtt/types'
import {
  SlideYTransition,
} from '@/components/Transtition/index'
import {
  hasCadsMap,
  removeCadLayer,
  setCadLayer,
} from '@/utils/map/cadsLayer'

defineProps<{ cad: CadType, selectCodes: string[] }>()

function onCadChange(checked: boolean, cad: Cad) {
  checked ? setCadLayer(cad) : removeCadLayer(cad)
}
</script>

<template>
  <component :is="SlideYTransition">
    <div v-show="!selectCodes.includes(cad.Code)">
      <div
        v-for="item in cad.cads"
        :key="item.dwgId"
        class="cad-checkbox"
      >
        <Checkbox
          :checked="hasCadsMap(item.dwgId)"
          @change="onCadChange($event.target.checked, item)"
        >
          <span class="cad-name">{{ item.typeName }}</span>
        </Checkbox>
        <span v-show="item.exceedDay">
          <Tooltip
            :title="`发布已超时(${item.exceedDay})天`"
          >
            <WarningTwoTone two-tone-color="#f50" />
          </Tooltip>
        </span>
        <Layers :item="item" />
      </div>
    </div>
  </component>
</template>

<style lang="less" scoped>
.cad-name {
  display: inline-block;
  max-width: 160px;
  text-align: center;
  white-space: nowrap;        /* 禁止换行 */
  overflow: hidden;           /* 隐藏超出部分 */
  text-overflow: ellipsis;    /* 超出部分显示省略号 */
}

.exceed-day {
  font-size: 10px;
}

.exceed-day-text {
  font-size: 12px;
  color: #fa541c;
}
</style>
