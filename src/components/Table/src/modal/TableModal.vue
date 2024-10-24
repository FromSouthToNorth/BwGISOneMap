<script setup lang="ts">
import { BasicModal, useModalInner } from '@/components/Modal'
import { Tabs } from '@/components/Descriptions'

defineProps<{ data: any }>()
const [register, { closeModal }] = useModalInner()
</script>

<template>
  <BasicModal
    @register="register"
  >
    <Tabs :data="data" />
  </BasicModal>
</template>
