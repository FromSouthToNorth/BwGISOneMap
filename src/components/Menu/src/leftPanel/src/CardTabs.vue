<script lang="ts" setup>
import { Button, Card } from 'ant-design-vue'
import { RollbackOutlined } from '@ant-design/icons-vue'
import { h, ref, toRaw, unref, watch } from 'vue'
import type { CardTabListType } from 'ant-design-vue/lib/card/Card'
import { useMenuSetting } from '../../hooks/useMenuSetting'
import type { MenuItem } from '../../types/menu'
import { useDesign } from '@/hooks/web/useDesign'

const emit = defineEmits(['click'])
const { prefixCls } = useDesign('car-tab')

const { getMenu } = useMenuSetting()

interface MCardTabListType extends CardTabListType {
  menu: MenuItem
}

const tabList = ref<MCardTabListType[]>([])
watch(() => unref(getMenu), (menu: MenuItem[]) => {
  tabList.value = toRaw(menu).map((m: MenuItem) => {
    return { key: m.id, tab: m.name, menu: m }
  })
})

const activeTabKey = ref('')

const activeTab = ref<MCardTabListType>()
function onClick() {
  emit('click')
}

function onTabChange(key: string) {
  activeTabKey.value = key
  activeTab.value = unref(tabList).find((tab) => { return tab.key === key })
}
</script>

<template>
  <Card
    :active-tab-key
    :tab-list="tabList"
    :class="prefixCls"
    @tab-change="key => onTabChange(key)"
  >
    <template #tabBarExtraContent>
      <Button
        :icon="h(RollbackOutlined)"
        type="link"
        @click="onClick"
      >
        返回
      </Button>
    </template>
  </Card>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-car-tab';
.@{prefix-cls} {
  margin-top: 0.5em;
  overflow: hidden;
}
</style>
