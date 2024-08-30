<script lang="ts" setup>
import {
  Button,
  DropdownButton,
  Menu,
  Tooltip,
} from 'ant-design-vue'
import { DownOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import type { MenuSub, ToSwitch } from '../../types/menu'
import { SizeEnum } from '@/enums/sizeEnum'

const props = defineProps<{ menuSub: MenuSub, activeTabKey: string, loading: boolean }>()

const emit = defineEmits(['menuSubClick'])

const sizeRef = ref<'small' | 'large' | undefined>(SizeEnum.SMALL)
function onClick() {
  emit('menuSubClick', props.menuSub)
}
function onToSwitchClick(toSwitch: ToSwitch) {
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
      :loading="loading && menuSub.id === activeTabKey"
      class="menu-sub"
      :size="sizeRef"
      :type="menuSub.id === activeTabKey ? 'primary' : undefined"
      :disabled="loading"
      @click="onClick"
    >
      {{ menuSub.moduleName }}
      <template #overlay>
        <Menu>
          <Menu.Item
            v-for="(item, index) in menuSub.toSwitchs"
            :key="index"
            @click="onToSwitchClick(item)"
          >
            {{ item.title }}
          </Menu.Item>
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
      :loading="loading && menuSub.id === activeTabKey"
      :type="menuSub.id === activeTabKey ? 'primary' : undefined"
      :disabled="loading"
      @click="onClick"
    >
      {{ menuSub.moduleName }}
    </Button>
  </Tooltip>
</template>

<style lang="less" scoped>
.menu-sub+ .menu-sub {
  margin-left: 4px;
}
.menu-sub {
  margin: 4px 0;
}
</style>
