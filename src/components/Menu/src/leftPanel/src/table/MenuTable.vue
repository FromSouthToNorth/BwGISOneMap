<script setup lang="ts">
import {
  BasicTable,
  BodyCell,
  TableModal,
} from '@/components/Table'
import { useModal } from '@/components/Modal'
import { openPopup } from '@/utils/map'
import {
  SlideYTransition,
} from '@/components/Transtition'

defineProps({
  tableHide: { type: Boolean, default: false },
})

const [register, { openModal }] = useModal()

function tableOpenModal(record: any) {
  openPopup(record, openModal)
}
</script>

<template>
  <component :is="SlideYTransition">
    <BasicTable
      v-show="tableHide"
      @row-click="tableOpenModal"
    >
      <template #bodyCell="{ column, record, value }">
        <BodyCell
          v-if="column"
          :column="column"
          :record="record"
          :value="value"
        />
      </template>
    </BasicTable>
  </component>
  <TableModal
    @register="register"
  />
</template>
