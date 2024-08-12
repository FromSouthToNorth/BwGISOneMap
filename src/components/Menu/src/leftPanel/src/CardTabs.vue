<script lang="ts" setup>
import type { CardSize } from 'ant-design-vue'
import { Button, Card } from 'ant-design-vue'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { h, ref, toRaw, unref, watch } from 'vue'
import type { CardTabListType } from 'ant-design-vue/lib/card/Card'
import { useMenuSetting, useMenuSub } from '../../../index'
import type { MenuItem, MenuSub } from '../../types/menu'
import { Tool } from './tool'
import TabSub from './TabSub.vue'
import { useDesign } from '@/hooks/web/useDesign'
import { SizeEnum } from '@/enums/sizeEnum'

const props = defineProps({
  activeTabKey: { type: String, default: '' },
})
const emit = defineEmits(['click', 'subClick'])
const { prefixCls } = useDesign('car-tab')

const { getMenu } = useMenuSetting()
const { getMenuSub, getMenuSubLoading } = useMenuSub()

interface MCardTabListType extends CardTabListType {
  menu: MenuItem
}

const activeTabKey = ref<string>('')
const menuSubActiveKey = ref<string>('')
const tabList = ref<MCardTabListType[]>([])

const menuSubList = ref<MenuSub[] | undefined>([])
const sizeRef = ref<CardSize>(SizeEnum.SMALL)
watch(
  () => unref(getMenu),
  (menu: MenuItem[]) => {
    tabList.value = toRaw(menu).map((m: MenuItem) => {
      return {
        key: m.id,
        tab: m.name,
        menu: m,
      }
    })
  },
)

watch(
  () => unref(getMenuSubLoading),
  (disabled: boolean) => {
    tabList.value.forEach((tab) => {
      tab.disabled = disabled
    })
  },
)

watch(
  () => unref(getMenuSub),
  (menuSub) => {
    menuSubList.value = menuSub
  },
)

watch(
  () => props.activeTabKey,
  (key: string) => {
    activeTabKey.value = key
  },
)

function onClick(key?: string) {
  console.log(unref(getMenuSubLoading))

  if (unref(getMenuSubLoading))
    return

  if (key) {
    const tab = unref(tabList).find((tab) => {
      return tab.key === key
    })
    emit('click', tab!.menu)
  }
  else {
    emit('click')
  }
}

function menuSubClick(menuSub: MenuSub) {
  menuSubActiveKey.value = menuSub.id
  emit('subClick', menuSub)
}
</script>

<template>
  <Card
    :active-tab-key="activeTabKey"
    :tab-list="tabList"
    :class="prefixCls"
    :size="sizeRef"
    @tab-change="key => onClick(key)"
  >
    <template #tabBarExtraContent>
      <Button
        :icon="h(RollbackOutlined)"
        type="link"
        @click="onClick()"
      >
        返回
      </Button>
    </template>
    <div class="tag-container">
      <TabSub
        v-for="menuSub in menuSubList"
        :key="menuSub.id"
        :menu-sub="menuSub"
        :loading="getMenuSubLoading"
        :active-tab-key="menuSubActiveKey"
        @menu-sub-click="menuSubClick"
      />
      <Tool />
    </div>
  </Card>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-car-tab';
.@{prefix-cls} {
  margin-top: 0.5em;
  overflow: hidden;
}
</style>
