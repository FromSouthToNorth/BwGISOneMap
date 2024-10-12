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

import { useTableStting } from '@/hooks/web/sys/useTableStting'

defineProps({
  tableHide: { type: Boolean, default: false },
})

const { deviceDataSource } = useTableStting()

const [register, { openModal }] = useModal()

function tableOpenModal(record: any) {
  openPopup(record, openModal)
}
</script>

<template>
  <component :is="SlideYTransition">
    <BasicTable
      v-show="tableHide"
      :data-source="deviceDataSource.dataSource"
      :columns="deviceDataSource.columns"
      :row-key="deviceDataSource.key"
      @row-click="tableOpenModal"
    >
      <template #bodyCell="{ column, record, text }">
        <BodyCell
          v-if="column"
          :column="column"
          :record="record"
          :text="text"
        />
      </template>
    </BasicTable>
  </component>
  <TableModal
    @register="register"
  />
</template>
