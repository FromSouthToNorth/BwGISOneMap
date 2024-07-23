<script lang="ts" setup>
import { Checkbox } from 'ant-design-vue'
import { coalSeamByRemoveCadLayer, coalSeamBySetCadLayer, hasCoalSeamSet } from '@/utils/map/cadsLayer'

defineProps({
  coalSeam: Object,
})
function onchange(checked: boolean, coalSeam: string) {
  if (checked)
    coalSeamBySetCadLayer(coalSeam)
  else
    coalSeamByRemoveCadLayer(coalSeam)
}
</script>

<template>
  <Checkbox
    class="coalseam-checkbox"
    :checked="hasCoalSeamSet(coalSeam!.Value)"
    @change="onchange($event.target.checked, coalSeam!.Value)"
  >
    {{ coalSeam?.Txt }}
  </Checkbox>
</template>

<style lang="less" scoped>
.coalseam-checkbox {
  margin: 0 2px;
}
</style>
