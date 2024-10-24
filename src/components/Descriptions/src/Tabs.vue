<script setup lang="ts">
import { Tabs } from 'ant-design-vue'
import Descriptions from './Descriptions.vue'
import Table from './Table.vue'
import { TypeEnum } from '@/enums/tableEnum'
import { tabDeviceTable } from '@/utils/mqtt/publish'

const props = defineProps<{ data: any }>()
function change(index: any) {
  const { Strategy } = props.data.menuSub.subStrategy[index]
  tabDeviceTable(Strategy, props.data)
}
</script>

<template>
  <Tabs
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
  </Tabs>
</template>
