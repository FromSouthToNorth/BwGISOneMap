<script setup lang="ts">
import { Descriptions } from 'ant-design-vue'
import type { SubStrategy } from './types'

const props = defineProps<{ subStrategy: SubStrategy }>()
console.log(props.subStrategy)
</script>

<template>
  <Descriptions>
    <Descriptions.Item
      v-for="({ value }, index) in subStrategy.columns"
      :key="index"
      :label="value.title"
    />
  </Descriptions>
</template>
