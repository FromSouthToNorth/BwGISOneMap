<script setup lang="ts">
import { Button, TabPane, Tabs } from 'ant-design-vue'
import { BasicModal, useModalInner } from '@/components/Modal'

const [register, { closeModal }] = useModalInner()
</script>

<template>
  <BasicModal
    title="Table Modal Title"
    @register="register"
  >
    <Tabs>
      <TabPane />
    </Tabs>
  </BasicModal>
</template>
