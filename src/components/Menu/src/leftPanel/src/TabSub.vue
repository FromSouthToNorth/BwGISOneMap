<script lang="ts" setup>
import { Button, DropdownButton, Menu, MenuItem, Tooltip } from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import type { MenuSub, ToSwitch } from '../../types/menu'
import { SizeEnum } from '@/enums/sizeEnum'

const props = defineProps<{ menuSub: MenuSub, activeTabKey: string }>()
const emit = defineEmits(['menuSubClick'])

const sizeRef = ref<'small' | 'large' | undefined>(SizeEnum.SMALL)
function onClick() {
  emit('menuSubClick', props.menuSub)
}
function onMenuClick(toSwitch: ToSwitch) {
  console.log('click', toSwitch)
}
</script>

<template>
  <Tooltip
    :title="menuSub.strategy"
    trigger="contextmenu"
  >
    <DropdownButton
      v-if="menuSub.toSwitchs && menuSub.id === activeTabKey"
      class="menu-sub"
      :size="sizeRef"
      :type="menuSub.id === activeTabKey ? 'primary' : undefined"
      @click="onClick"
    >
      {{ menuSub.name }}
      <template #overlay>
        <Menu>
          <MenuItem
            v-for="(item, index) in menuSub.toSwitchs"
            :key="index"
            @click="onMenuClick(item)"
          >
            {{ item.title }}
          </MenuItem>
        </Menu>
      </template>
      <template #icon>
        <DownOutlined />
      </template>
    </DropdownButton>
    <Button
      v-else
      class="menu-sub"
      :size="sizeRef"
      :type="menuSub.id === activeTabKey ? 'primary' : undefined"
      @click="onClick"
    >
      {{ menuSub.name }}
    </Button>
  </Tooltip>
</template>

<style lang="less" scoped>
.menu-sub {
  margin: 1px;
}
</style>
