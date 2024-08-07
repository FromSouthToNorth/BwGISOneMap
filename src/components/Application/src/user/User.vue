<script lang="ts" setup>
import { UserOutlined } from '@ant-design/icons-vue'
import { Dropdown, Menu, MenuItem } from 'ant-design-vue'
import { useUserSetting } from '@/hooks/web/sys/useUserSetting'
import { useUserStoreWithOut } from '@/store/modules/user'

const userStore = useUserStoreWithOut()

const { userInfo } = useUserSetting()
</script>

<template>
  <div class="user-name right-top-menu-item">
    <Dropdown>
      <span>
        <UserOutlined />
        {{ userInfo.name }}
      </span>
      <template #overlay>
        <Menu>
          <MenuItem @click="userStore.logout()">
            退出登录
          </MenuItem>
        </Menu>
      </template>
    </Dropdown>
  </div>
</template>

<style lang="less" scoped>
</style>
