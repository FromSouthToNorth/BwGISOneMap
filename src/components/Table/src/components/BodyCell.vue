<script setup lang="ts">
import { Badge, Button, Tag } from 'ant-design-vue'
import { NotificationOutlined, SearchOutlined } from '@ant-design/icons-vue'

import { computed, h, ref } from 'vue'
import { SizeEnum } from '@/enums/sizeEnum'
import { getColor } from '@/utils/color'
import { openPopup } from '@/utils/map'

const props = defineProps<{ column: any, record: any, value: any }>()

const sizeRef = ref<'small' | 'large' | undefined>(SizeEnum.SMALL)

const isCommon = computed(() => {
  return props.column.scopedSlots.drawType
    && props.record.L && props.record.B
})

function onClickMark() {
  console.log('onClickMark: ')
}

function onClickPath() {
  console.log('onClickPath: ')
}

function onClickContextSearch() {
  console.log('onContextSearch: ')
}

function onClickBroadcast() {
  console.log('onClickBroadcast: ')
}

function getValue() {
  const { scopedSlots, dataIndex } = props.column
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
  <template
    v-else-if="getValue() === 'isStart'"
  >
    <Tag
      v-if="value === 1"
      color="green"
    >
      是
    </Tag>
    <Tag v-else>
      否
    </Tag>
  </template>
  <template v-else>
    {{ value }}
  </template>
</template>
