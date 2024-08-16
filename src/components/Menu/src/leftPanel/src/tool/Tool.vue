<script lang="ts" setup>
import {
  Badge,
  Button,
  Checkbox,
  Divider,
  DropdownButton,
  Menu,
  MenuItem,
} from 'ant-design-vue'
import { CaretDownOutlined, DeleteTwoTone } from '@ant-design/icons-vue'
import { h, ref, unref } from 'vue'
import { useTool } from './hooks/useTool'
import { SizeEnum } from '@/enums/sizeEnum'

const aggSwitch = ref(true)
const layerOverlay = ref(false)
const titleSet = ref<Set<string>>(new Set())
unref(titleSet).add('聚合')
const sizeRef = ref<'small' | 'large' | undefined>(SizeEnum.SMALL)
const { setIsAggSwitch, setIsLayerOverlay } = useTool()

function aggCheckbox() {
  const title = '聚合'
  set(title, unref(aggSwitch))
  setIsAggSwitch(unref(aggSwitch))
}

function layerCheckbox() {
  const title = '图层'
  set(title, unref(layerOverlay))
  setIsLayerOverlay(unref(layerOverlay))
}

function set(title: string, isSet: boolean) {
  const set = unref(titleSet)
  if (isSet)
    set.add(title)

  else
    set.delete(title)
}

function clear() {
  console.log('clear')
}
</script>

<template>
  <Divider type="vertical" />
  <DropdownButton
    class="tool-drop"
    :size="sizeRef"
  >
    <Badge
      v-show="titleSet.size === 0"
      status="default"
    />
    <Badge
      v-for="(title, index) in titleSet"
      :key="index"
      status="processing"
      :text="title"
    />
    <template #overlay>
      <Menu>
        <MenuItem>
          <Checkbox
            v-model:checked="aggSwitch"
            @change="aggCheckbox"
          >
            聚合开关
          </Checkbox>
        </MenuItem>
        <MenuItem>
          <Checkbox
            v-model:checked="layerOverlay"
            @change="layerCheckbox"
          >
            图层叠加
          </Checkbox>
        </MenuItem>
      </Menu>
    </template>
    <template #icon>
      <CaretDownOutlined />
    </template>
  </DropdownButton>
  <Button
    :size="sizeRef"
    :icon="h(DeleteTwoTone)"
    @click="clear"
  >
    清空
  </Button>
</template>

<style lang="less" scoped>
.tool-drop {
  margin: 1px;

  span + span {
    margin-right: 6px;
  }
}
</style>
