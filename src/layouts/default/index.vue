<script lang="ts" setup>
import { Layout } from 'ant-design-vue'
import LayoutContent from './content/index.vue'
import { useDesign } from '@/hooks/web/useDesign'

const { prefixCls } = useDesign('default-layout')
</script>

<template>
  <Layout>
    <Layout :class="`${prefixCls}-main`">
      <LayoutContent />
    </Layout>
  </Layout>
</template>
