<script lang="ts" setup>
import { ref, watch } from 'vue'
import { BadgeRibbon, Button, Checkbox, Divider, Tooltip } from 'ant-design-vue'
import { WarningTwoTone } from '@ant-design/icons-vue'
import { isArray } from 'lodash-es'
import { useCadSetting } from '@/hooks/setting/useCadSetting'
import type { Cad, CadType, DwgLayer } from '@/utils/mqtt/types'

import { useCadStoreWithOut } from '@/store/modules/cad'

import {
  SlideYTransition,
} from '@/components/Transtition/index'
import { hasCadsMap, removeCadLayer, setCadLayer } from '@/utils/map/cadsLayer'

const cadStore = useCadStoreWithOut()

const { cads } = useCadSetting()

const cadSelect = ref<CadType[]>()
watch(() => cads.value, (cads) => {
  cadSelect.value = cads
})

const dwgId = ref('')
const selectCodes = ref<string[]>([])

function onCadChange(checked: boolean, cad: Cad) {
  const { dwgId, typeName } = cad
  if (checked) {
    cadStore.setCadName(typeName)
    setCadLayer(dwgId)
  }
  else { removeCadLayer(dwgId) }
}

function onLChange(checked: boolean, dwgLayer: DwgLayer) {
  console.log(checked, dwgLayer)
}

function onclick(id: string) {
  if (dwgId.value === id)
    id = ''
  dwgId.value = id
}

function onCadClick(id: string) {
  const index = selectCodes.value.indexOf(id)
  if (index !== -1)
    selectCodes.value.splice(index, 1)
  else
    selectCodes.value.push(id)
}
</script>

<template>
  <div class="cad-cads-container">
    <div
      v-for="cad in cadSelect"
      :key="cad.Code"
      class="cad-badge"
    >
      <BadgeRibbon :text="cad.cads.length">
        <div class="cad-checkbox-container">
          <div class="cad-head" @click="onCadClick(cad.Code)">
            <h4 class="cad-title">
              {{ cad.Classfyname }}
            </h4>
          </div>
          <Divider :style="{ margin: '6px 0' }" />
          <component :is="SlideYTransition">
            <div v-show="!selectCodes.includes(cad.Code)">
              <div
                v-for="item in cad.cads"
                :key="item.dwgId"
                class="cad-checkbox"
              >
                <Checkbox :checked="hasCadsMap(item.dwgId)" @change="onCadChange($event.target.checked, item)">
                  {{ item.typeName }}
                </Checkbox>
                <span v-show="item.exceedDay">
                  <Tooltip :title="`发布已超时(${item.exceedDay})天`">
                    <WarningTwoTone two-tone-color="#f50" />
                  </Tooltip>
                </span>
                <Button
                  v-show="isArray(item.Layers)"
                  type="link"
                  @click="onclick(item.dwgId)"
                >
                  图层
                </Button>
                <div
                  v-show="(dwgId === item.dwgId) && isArray(item.Layers)"
                  class="cad-layers"
                >
                  <div
                    v-for="l in item.Layers"
                    :key="l.DwgLayer"
                  >
                    <Checkbox
                      @change="onLChange($event.target.checked, l)"
                    >
                      {{ l.DwgLayer }}
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>
          </component>
        </div>
      </BadgeRibbon>
    </div>
  </div>
</template>

<style lang="less" scoped>
.cad-cads-container {
  max-height: 480px;
  min-width: 260px;
  padding: 6px 12px 6px 6px;
  overflow-y: auto;
}

.cad-checkbox-container {
  max-width: 360px;
}

.cad-checkbox-container {
  border: 1px solid @border-color-base;
  border-radius: 2px;
  padding: 6px;
  margin-bottom: 2px;
}

.cad-title {
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: @text-color-base;
  transition: color .3s, transform .3s;
}

.cad-title:hover {
  color: @hover-text-color-base;
}

.exceed-day {
  font-size: 10px;
}

.exceed-day-text {
  font-size: 12px;
  color: #fa541c;
}

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
