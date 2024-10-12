import { defineStore } from 'pinia'

import { TABLE_SETTING_KEY } from '@/enums/cacheEnum'

import { getCache, removeCache, setCache } from '@/utils/cache'

import type { TableSetting } from '#/store'
import type { ColumnOptionsType, SizeType } from '@/components/Table/src/types/table'

interface TableSettingState {
  setting: Nullable<Partial<TableSetting>>
  deviceDataSource: any
  subDataSource: any
}

export const useTableSettingStore = defineStore({
  id: 'table-setting',
  state: (): TableSettingState => ({
    setting: getCache(TABLE_SETTING_KEY),
    deviceDataSource: {},
    subDataSource: {},
  }),
  getters: {
    getDeviceDataSource(state): any {
      return state.deviceDataSource
    },
    getSubDataSource(state): any {
      return state.subDataSource
    },
    getTableSetting(state): Nullable<Partial<TableSetting>> {
      return state.setting
    },
    //
    getTableSize(state) {
      return state.setting?.size || 'small'
    },
    //
    getShowIndexColumn(state) {
      return (routerName: string) => {
        return state.setting?.showIndexColumn?.[routerName]
      }
    },
    //
    getShowRowSelection(state) {
      return (routerName: string) => {
        return state.setting?.showRowSelection?.[routerName]
      }
    },
    //
    getColumns(state) {
      return (routerName: string) => {
        return state.setting?.columns && state.setting?.columns[routerName]
          ? state.setting?.columns[routerName]
          : null
      }
    },
  },
  actions: {
    setDeviceDataSource(dataSource: any) {
      this.deviceDataSource = dataSource
    },
    setSubDataSource(dataSource: any) {
      this.subDataSource = dataSource
    },
    setTableSetting(setting: Partial<TableSetting>) {
      this.setting = Object.assign({}, this.setting, setting)
      setCache(TABLE_SETTING_KEY, this.setting)
    },
    resetTableSetting() {
      removeCache(TABLE_SETTING_KEY)
      this.setting = null
    },
    //
    setTableSize(size: SizeType) {
      this.setTableSetting(
        Object.assign({}, this.setting, {
          size,
        }),
      )
    },
    //
    setShowIndexColumn(routerName: string, show: boolean) {
      this.setTableSetting(
        Object.assign({}, this.setting, {
          showIndexColumn: {
            ...this.setting?.showIndexColumn,
            [routerName]: show,
          },
        }),
      )
    },
    //
    setShowRowSelection(routerName: string, show: boolean) {
      this.setTableSetting(
        Object.assign({}, this.setting, {
          showRowSelection: {
            ...this.setting?.showRowSelection,
            [routerName]: show,
          },
        }),
      )
    },
    //
    setColumns(routerName: string, columns: Array<ColumnOptionsType>) {
      this.setTableSetting(
        Object.assign({}, this.setting, {
          columns: {
            ...this.setting?.columns,
            [routerName]: columns,
          },
        }),
      )
    },
    clearColumns(routerName: string) {
      this.setTableSetting(
        Object.assign({}, this.setting, {
          columns: {
            ...this.setting?.columns,
            [routerName]: undefined,
          },
        }),
      )
    },
  },
})
