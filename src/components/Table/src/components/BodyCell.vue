<script setup lang="ts">
import { Button } from 'ant-design-vue'

import { ref } from 'vue'
import { SizeEnum } from '@/enums/sizeEnum'

const props = defineProps<{ data: any }>()
const { column, value, text, record } = props.data

const sizeRef = ref<'small' | 'large' | undefined>(SizeEnum.SMALL)

// console.log(column, value)
</script>

<template>
  <template
    v-if="column.dataIndex === 'common'
      || column.dataIndex === 'commonDraw'"
  >
    <Button :size="sizeRef">
      操作
    </Button>
  </template>
  <template v-else>
    {{ value }}
  </template>
</template>
