<script setup lang="ts">
import { Badge, Button, Tag } from 'ant-design-vue'
import { NotificationOutlined, SearchOutlined } from '@ant-design/icons-vue'

import { computed, h, ref } from 'vue'
import { SizeEnum } from '@/enums/sizeEnum'
// import { LayerType } from '@/enums/mapEnum'
import { getColor } from '@/utils/color'
import { openPopup } from '@/utils/map'

const props = defineProps<{ data: any }>()

const { column, value, text, record } = props.data

const sizeRef = ref<'small' | 'large' | undefined>(SizeEnum.SMALL)

const isCommon = computed(() => {
  return column.scopedSlots.drawType
    // && column.scopedSlots.drawType === LayerType.MARKER
    && record.L && record.B
})

function onClickMark() {
  console.log('onClickMark: ')
  console.log('onClickMark: ', column)
  console.log('onClickMark: ', record)
}

function onClickPath() {
  console.log('onClickPath: ')
  console.log('onClickPath: ', column)
  console.log('onClickPath: ', record)
}

function onClickContextSearch() {
  console.log('onContextSearch: ')
  console.log('onContextSearch: ', column)
  console.log('onContextSearch: ', record)
}

function onClickBroadcast() {
  console.log('onClickBroadcast: ')
  console.log('onClickBroadcast: ', column)
  console.log('onClickBroadcast: ', record)
}

function getValue() {
  const { scopedSlots, dataIndex } = column
  return scopedSlots && scopedSlots.customRender ? scopedSlots.customRender : dataIndex
}
</script>

<template>
  <template
    v-if="getValue() === 'common'"
  >
    <Button
      v-if="isCommon"
      :size="sizeRef"
      type="primary"
      @click="openPopup(record)"
    >
      位置
    </Button>
    <Button
      v-else
      :size="sizeRef"
      type="primary"
      danger
      @click="onClickMark"
    >
      标注
    </Button>
  </template>
  <template
    v-else-if="getValue() === 'workingFaceState'"
  >
    <Tag
      :color="getColor(value)"
    >
      {{ value }}
    </Tag>
  </template>
  <template
    v-else-if="getValue() === 'whetherOnline'"
  >
    <Badge :status="value ? 'processing' : 'default'" />
    {{ value ? '在线' : '离线' }}
  </template>
  <template
    v-else-if="getValue() === 'trState'"
  >
    <Tag
      :color="getColor(value)"
    >
      {{ value }}
    </Tag>
  </template>
  <template
    v-else-if="getValue() === 'path'"
  >
    <Button
      :size="sizeRef"
      type="primary"
      @click="onClickPath"
    >
      路线
    </Button>
  </template>
  <template
    v-else-if="getValue() === 'contextSearch'"
  >
    <Button
      :size="sizeRef"
      :icon="h(SearchOutlined)"
      @click="onClickContextSearch"
    />
  </template>
  <template
    v-else-if="getValue() === 'broadcast'"
  >
    <Button
      :size="sizeRef"
      :icon="h(NotificationOutlined)"
      @click="onClickBroadcast"
    />
  </template>
  <template v-else>
    {{ value }}
  </template>
</template>
