<script setup lang="ts">
import { Button } from 'ant-design-vue'
import { BasicModal, useModalInner } from '@/components/Modal'

const [register, { closeModal }] = useModalInner()
</script>

<template>
  <BasicModal title="Table Modal Title" @register="register">
    <Button @click="closeModal">
      Table Modal 从内部关闭弹窗
    </Button>
  </BasicModal>
</template>
