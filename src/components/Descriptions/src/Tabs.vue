<script setup lang="ts">
import { Tabs, Tooltip } from 'ant-design-vue'
import { CloseOutlined, FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { useFullscreen } from '@vueuse/core'
import Descriptions from './Descriptions.vue'
import Table from './Table.vue'
import { TypeEnum } from '@/enums/tableEnum'
import { tabDeviceTable } from '@/utils/mqtt/publish'
import { clearPopLayer } from '@/utils/map/popup'

const props = defineProps<{ data: any, rightExtra: boolean }>()
const tabsRef = ref(null)

const { toggle, isFullscreen } = useFullscreen(tabsRef)

function change(index: any) {
  const { Strategy } = props.data.menuSub.subStrategy[index]
  tabDeviceTable(Strategy, props.data)
}
</script>

<template>
  <Tabs
    ref="tabsRef"
    size="small"
    type="card"
    @change="change"
  >
    <Tabs.TabPane
      v-for="(tab, index) in data.menuSub.subStrategy"
      :key="index"
      :tab="tab.name"
    >
      <Descriptions
        v-if="tab.type === TypeEnum.INFO"
        :columns="tab.columns"
        :data="data"
      />
      <Table
        v-else-if="tab.type === TypeEnum.TABLE"
        :columns="tab.columns"
      />
    </Tabs.TabPane>
    <template
      v-if="rightExtra"
      #rightExtra
    >
      <Tooltip placement="top">
        <template #title>
          <span>全屏</span>
        </template>
        <FullscreenOutlined
          v-if="!isFullscreen"
          @click="toggle"
        />
        <FullscreenExitOutlined
          v-else
          @click="toggle"
        />
      </Tooltip>
      <Tooltip placement="top">
        <template #title>
          <span>关闭</span>
        </template>
        <CloseOutlined
          class="popup-close"
          @click="clearPopLayer"
        />
      </Tooltip>
    </template>
  </Tabs>
</template>

<style lang="less" scoped>
.popup-close {
  margin-left: 10px;
}
</style>
