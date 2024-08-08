<script lang="ts" setup>
import { ref } from 'vue'
import { BadgeRibbon, Divider } from 'ant-design-vue'
import CadCheckbox from './CadCheckbox.vue'
import type { CadType } from '@/utils/mqtt/types'

defineProps<{ cadSelect: CadType[] }>()

const emit = defineEmits(['setCadName'])

function setCadName(name: string) {
  emit('setCadName', name)
}

const selectCodes = ref<string[]>([])

function onCadClick(id: string) {
  const index = selectCodes.value.indexOf(id)
  index !== -1 ? selectCodes.value.splice(index, 1) : selectCodes.value.push(id)
}
</script>

<template>
  <div class="cad-container">
    <div
      v-for="cad in cadSelect"
      :key="cad.Code"
    >
      <BadgeRibbon :text="cad.cads.length">
        <div class="cad-checkbox-container">
          <div
            class="cad-head"
            @click="onCadClick(cad.Code)"
          >
            <h4 class="cad-title">
              {{ cad.Classfyname }}
            </h4>
          </div>
          <Divider :style="{ margin: '6px 0' }" />
          <CadCheckbox
            :cad="cad"
            :select-codes="selectCodes"
            @set-cad-name="setCadName"
          />
        </div>
      </BadgeRibbon>
    </div>
  </div>
</template>

<style lang="less" scoped>
.cad-container {
  max-height: 480px;
  padding: 6px 12px 6px 6px;
  overflow-y: auto;
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
</style>
