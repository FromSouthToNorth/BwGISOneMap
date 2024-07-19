<script lang="ts" setup>
import { Button, Dropdown, Input, InputGroup, Menu, MenuItem, Switch, Tooltip } from 'ant-design-vue'
import { DownOutlined, SearchOutlined } from '@ant-design/icons-vue'
import { ref } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'

const { prefixCls } = useDesign('app-search')
const checked = ref<boolean>(false)
</script>

<template>
  <div :class="prefixCls">
    <InputGroup compact>
      <Input style="width: calc(100% - 15%)" :allow-clear="true">
        <template #suffix>
          <Tooltip title="搜索">
            <SearchOutlined />
          </Tooltip>
        </template>
      </Input>
      <Dropdown>
        <Button @click.prevent>
          <template #icon>
            <DownOutlined />
          </template>
        </Button>
        <template #overlay>
          <Menu>
            <MenuItem>
              <Switch v-model:checked="checked" />
            </MenuItem>
          </Menu>
        </template>
      </Dropdown>
    </InputGroup>
  </div>
</template>

<style lang="less" scoped>
@prefix-cls: ~'@{namespace}-app-search';
.@{prefix-cls} {
  width: 260px;
}
</style>
