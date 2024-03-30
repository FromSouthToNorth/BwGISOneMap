<script lang="ts" setup>
import { ref } from 'vue'
import PageLayout from '@/layouts/page/index.vue'
import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting'
import { useDesign } from '@/hooks/web/useDesign'

defineOptions({ name: 'LayoutContent' })

const { prefixCls } = useDesign('layout-content')
const { getOpenPageLoading } = useTransitionSetting()
const content = ref()
</script>

<template>
  <div ref="content" v-loading="getOpenPageLoading" :class="prefixCls">
    <PageLayout ref="content" />
  </div>
</template>
