<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { Dropdown, Menu, type MenuProps, Tooltip } from 'ant-design-vue'
import { ColumnHeightOutlined } from '@ant-design/icons-vue'
import type { SizeType } from '../../types/table'
import { useTableContext } from '../../hooks/useTableContext'
import { getPopupContainer } from '@/utils'

import { useTableSettingStore } from '@/store/modules/tableSetting'

defineOptions({ name: 'SizeSetting' })

const tableSettingStore = useTableSettingStore()

const table = useTableContext()

const selectedKeysRef = ref<SizeType[]>([table.getSize()])

const handleTitleClick: MenuProps['onClick'] = ({ key }) => {
  selectedKeysRef.value = [key as SizeType]

  tableSettingStore.setTableSize(key as SizeType)

  table.setProps({
    size: key as SizeType,
  })
}

onMounted(() => {
  selectedKeysRef.value = [tableSettingStore.getTableSize]
  table.setProps({
    size: selectedKeysRef.value[0],
  })
})
</script>

<template>
  <Tooltip placement="top">
    <template #title>
      <span>密度</span>
    </template>

    <Dropdown placement="bottom" :trigger="['click']" :get-popup-container="getPopupContainer">
      <ColumnHeightOutlined />
      <template #overlay>
        <Menu v-model:selectedKeys="selectedKeysRef" selectable @click="handleTitleClick">
          <Menu.Item key="default">
            <span>默认</span>
          </Menu.Item>
          <Menu.Item key="middle">
            <span>中等</span>
          </Menu.Item>
          <Menu.Item key="small">
            <span>紧凑</span>
          </Menu.Item>
        </Menu>
      </template>
    </Dropdown>
  </Tooltip>
</template>
