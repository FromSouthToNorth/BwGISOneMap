<script setup lang="ts">
import { Badge, Button, Tag } from 'ant-design-vue'
import { NotificationOutlined, SearchOutlined } from '@ant-design/icons-vue'

import { computed, h, ref } from 'vue'
import { SizeEnum } from '@/enums/sizeEnum'
import { getColor } from '@/utils/color'
import { openPopup } from '@/utils/map'

const props = defineProps<{ column: any, record: any, text: any }>()

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

function specialLaneElevation() {
  const key = [[], ['井口', '井底'], [], ['上口', '下口']]
  const { record } = props
  if (record.TunnelType === 3 || record.TunnelType === 1) {
    const z: number[] = []
    record.MarkType.coordinates.forEach((val: any) => {
      const { seq } = val
      const index = seq.indexOf('-')
      z.push(seq.substring(index + 1, seq.length))
    })
    return `<span>${key[record.TunnelType][0]}: <b>${z[0]}</b>
                </span>&nbsp;&nbsp;&nbsp;&nbsp;
                <span>${key[record.TunnelType][1]}: <b>${z[1]}</b>
                </span>`
  }
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
      :color="getColor(text)"
    >
      {{ text }}
    </Tag>
  </template>
  <template
    v-else-if="getValue() === 'whetherOnline'"
  >
    <Badge :status="text ? 'processing' : 'default'" />
    {{ text ? '在线' : '离线' }}
  </template>
  <template
    v-else-if="getValue() === 'trState'"
  >
    <Tag
      :color="getColor(text)"
    >
      {{ text }}
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
      v-if="text === 1"
      color="green"
    >
      是
    </Tag>
    <Tag v-else>
      否
    </Tag>
  </template>
  <template v-else-if="getValue() === 'IsWalk'">
    <Tag :color="text ? 'green' : 'red'">
      {{ text ? '是' : '否' }}
    </Tag>
  </template>
  <template v-else-if="getValue() === 'OutOffUse'">
    <Tag :color="text ? 'red' : 'green'">
      {{ text ? '是' : '否' }}
    </Tag>
  </template>
  <template v-else-if="getValue() === 'specialLane'">
    <div v-html="specialLaneElevation()" />
  </template>
  <template v-else>
    {{ text }}
  </template>
</template>
