<script lang="ts" setup>
import { ref } from 'vue'
import PageLayout from '@/layouts/page/index.vue'
import { useDesign } from '@/hooks/web/useDesign'
import { useRootSetting } from '@/hooks/setting/useRootSetting'

defineOptions({ name: 'LayoutContent' })

const { prefixCls } = useDesign('layout-content')
const { getPageLoading } = useRootSetting()
const content = ref()
</script>

<template>
  <div ref="content" v-loading="getPageLoading" :class="prefixCls">
    <PageLayout ref="content" />
  </div>
</template>
