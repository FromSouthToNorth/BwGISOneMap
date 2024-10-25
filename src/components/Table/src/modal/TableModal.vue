<script setup lang="ts">
import { BasicModal, useModalInner } from '@/components/Modal'
import { Tabs } from '@/components/Descriptions'

defineProps<{ data: any }>()
const [register, { closeModal }] = useModalInner()
</script>

<template>
  <BasicModal
    :show-cancel-btn="false"
    :show-ok-btn="false"
    @register="register"
  >
    <Tabs
      :data="data"
      :right-extra="false"
    />
  </BasicModal>
</template>
