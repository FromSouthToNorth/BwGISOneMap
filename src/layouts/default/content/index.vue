<script lang="ts" setup>
import { ref } from 'vue'
import PageLayout from '@/layouts/page/index.vue'

const content = ref()
</script>

<template>
  <div>
    <PageLayout ref="content" />
  </div>
</template>
