<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, unref, useAttrs, watch } from 'vue'
import { Button, Checkbox, Divider, Popover, Tooltip } from 'ant-design-vue'
import type { CheckboxChangeEvent } from 'ant-design-vue/lib/checkbox/interface'
import { DragOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { cloneDeep, omit } from 'lodash-es'
import Sortablejs from 'sortablejs'
import { useRoute } from 'vue-router'
import type { BasicColumn, ColumnChangeParam, ColumnOptionsType } from '../../types/table'
import { useTableContext } from '../../hooks/useTableContext'
import { useColumns } from '../../hooks/useColumns'
import Icon from '@/components/Icon/Icon.vue'
import { ScrollContainer } from '@/components/Container'
import { useDesign } from '@/hooks/web/useDesign'
import { isFunction, isNil } from '@/utils/is'
import { getPopupContainer as getParentContainer } from '@/utils'
import { INDEX_COLUMN_FLAG } from '@/components/Table/src/const'

// 列表设置缓存
import { useTableSettingStore } from '@/store/modules/tableSetting'
import type { TableRowSelection } from '@/components/Table/src/types/table'

defineOptions({ name: 'ColumnSetting' })

const props = withDefaults(
  defineProps<{
    /**
     * 是否缓存列的设置
     */
    cache?: boolean
  }>(),
  {
    cache: () => false,
  },
)

const emit = defineEmits(['columnsChange'])

const tableSettingStore = useTableSettingStore()
const { getColumns, setColumns } = useColumns()

const route = useRoute()

const { prefixCls } = useDesign('basic-column-setting')

const attrs = useAttrs()
const table = useTableContext()

function getPopupContainer() {
  return isFunction(attrs.getPopupContainer) ? attrs.getPopupContainer() : getParentContainer()
}

// 默认值
let defaultRowSelection: TableRowSelection<Recordable<any>>
let defaultColumnOptions: ColumnOptionsType[] = []

// 是否已经从缓存恢复
let isRestored = false
let isInnerChange = false

// 列可选项
const columnOptions = ref<ColumnOptionsType[]>([])
const columnOptionsRef = ref(null)
// 已选列
const columnCheckedOptions = ref<string[]>([])
// 已选变化
watch(() => unref(columnCheckedOptions), () => {
  // 恢复缓存后生效
  if (isRestored) {
    // 显示
    columnOptions.value
      .filter(o => columnCheckedOptions.value.includes(o.value))
      .forEach((o) => {
        o.column.defaultHidden = false
      })
    // 隐藏
    columnOptions.value
      .filter(o => !columnCheckedOptions.value.includes(o.value))
      .forEach((o) => {
        o.column.defaultHidden = true
        o.fixed = undefined
      })

    // 从 列可选项 更新 全选状态
    isColumnAllSelectedUpdate()

    // 列表列更新
    tableColumnsUpdate()
    // 更新列缓存
    if (props.cache) {
      columnOptionsSave()
    }
  }
})

// 全选
const isColumnAllSelected = ref<boolean>(false)
function onColumnAllSelectChange() {
  if (columnCheckedOptions.value.length < columnOptions.value.length) {
    columnCheckedOptions.value = columnOptions.value.map(o => o.value)
  }
  else {
    columnCheckedOptions.value = []
  }
}

// 半选状态
const indeterminate = computed(() => {
  return (
    columnCheckedOptions.value.length > 0
    && columnCheckedOptions.value.length < columnOptions.value.length
  )
})

// 更新列缓存
function columnOptionsSave() {
  if (typeof route.name === 'string') {
    // 按路由 name 作为缓存的key（若一个路由内存在多个表格，需自行调整缓存key来源）
    tableSettingStore.setColumns(route.name, columnOptions.value)
  }
}

// 重置
function onReset() {
  // 重置默认值
  columnOptions.value = cloneDeep(defaultColumnOptions)
  // 更新表单状态
  formUpdate()
}

// 设置列的 fixed
function onColumnFixedChange(opt: ColumnOptionsType, type: 'left' | 'right') {
  if (type === 'left') {
    if (!opt.fixed || opt.fixed === 'right') {
      opt.fixed = 'left'
    }
    else {
      opt.fixed = undefined
    }
  }
  else if (type === 'right') {
    if (!opt.fixed || opt.fixed === 'left') {
      opt.fixed = 'right'
    }
    else {
      opt.fixed = undefined
    }
  }

  // 列表列更新
  tableColumnsUpdate()
  // 更新列缓存
  if (props.cache)
    columnOptionsSave()
}

// 沿用逻辑
async function sortableFix() {
  // Sortablejs存在bug，不知道在哪个步骤中会向el append了一个childNode，因此这里先清空childNode
  // 有可能复现上述问题的操作：拖拽一个元素，快速的上下移动，最后放到最后的位置中松手
  if (columnOptionsRef.value) {
    const el = (columnOptionsRef.value as InstanceType<typeof Checkbox.Group>).$el
    Array.from(el.children).forEach(item => el.removeChild(item))
  }
  await nextTick()
}

// 列是否显示逻辑
function columnIfShow(column?: Partial<Omit<BasicColumn, 'children'>>) {
  if (column) {
    if ('ifShow' in column) {
      if (typeof column.ifShow === 'boolean') {
        return column.ifShow
      }
      else if (column.ifShow) {
        return column.ifShow(column)
      }
    }
    return true
  }
  return false
}

// 获取数据列
function getTableColumns() {
  return unref(getColumns).filter((col: Partial<Omit<BasicColumn, 'children'>>) => columnIfShow(col))
}

// 设置列表列
function tableColumnsSet(columns: BasicColumn[]) {
  isInnerChange = true
  setColumns(columns)

  // 沿用逻辑
  const columnChangeParams: ColumnChangeParam[] = columns.map(col => ({
    dataIndex: col.dataIndex ? col.dataIndex.toString() : '',
    fixed: col.fixed,
    visible: !col.defaultHidden,
  }))
  emit('columnsChange', columnChangeParams)
}

// 列表列更新
function tableColumnsUpdate() {
  // 考虑了所有列
  const columns = cloneDeep(unref(getColumns))

  // 从左 fixed 最一列开始排序（除了 序号列）
  let count = columns.filter(
    o => o.flag !== INDEX_COLUMN_FLAG && (o.fixed === 'left' || o.fixed === true),
  ).length

  // 按 columnOptions 的排序 调整 table.getColumns() 的顺序和值
  for (const opt of columnOptions.value) {
    const colIdx = columns.findIndex(o => o.dataIndex === opt.value)
    //
    if (colIdx > -1) {
      const target = columns[colIdx]
      target.defaultHidden = opt.column?.defaultHidden
      target.fixed = opt.fixed
      columns.splice(colIdx, 1)
      columns.splice(count++, 0, target) // 递增插入
    }
  }

  // 是否存在 action
  const actionIndex = columns.findIndex(o => o.dataIndex === 'action')
  if (actionIndex > -1) {
    const actionCol = columns.splice(actionIndex, 1)
    columns.push(actionCol[0])
  }
  // 设置列表列
  tableColumnsSet(columns)
}

// 打开浮窗
async function onOpenChange() {
  await nextTick()

  if (columnOptionsRef.value) {
    // 注册排序实例
    const el = (columnOptionsRef.value as InstanceType<typeof Checkbox.Group>).$el
    Sortablejs.create(unref(el), {
      animation: 500,
      delay: 400,
      delayOnTouchOnly: true,
      handle: '.table-column-drag-icon ',
      dataIdAttr: 'data-no',
      onEnd: (evt: any) => {
        const { oldIndex, newIndex } = evt
        if (isNil(oldIndex) || isNil(newIndex) || oldIndex === newIndex) {
          return
        }

        const options = cloneDeep(columnOptions.value)

        // 排序
        if (oldIndex > newIndex) {
          options.splice(newIndex, 0, options[oldIndex])
          options.splice(oldIndex + 1, 1)
        }
        else {
          options.splice(newIndex + 1, 0, options[oldIndex])
          options.splice(oldIndex, 1)
        }

        // 更新 列可选项
        columnOptions.value = options

        // 列表列更新
        tableColumnsUpdate()
        // 更新列缓存
        if (props.cache)
          columnOptionsSave()
      },
    })
  }
}

// remove消失的列、push新出现的列
function diff() {
  if (typeof route.name === 'string') {
    let cache = tableSettingStore.getColumns(route.name)
    if (cache) {
      // value、label是否一致
      if (
        JSON.stringify(columnOptions.value.map(o => ({ value: o.value, label: o.label })))
        !== JSON.stringify(cache.map(o => ({ value: o.value, label: o.label })))
      ) {
        const map = columnOptions.value.reduce((map, item) => {
          map[item.value] = item.label
          return map
        }, {})
        if (Array.isArray(cache)) {
          // remove消失的列
          cache = cache.filter(o => map[o.value])
          // 更新label
          cache.forEach((o) => {
            o.label = map[o.value]
          })
          const cacheKeys = cache.map(o => o.value)
          // push新出现的列
          cache = cache.concat(columnOptions.value.filter(o => !cacheKeys.includes(o.value)))
          // 更新缓存
          tableSettingStore.setColumns(route.name, cache)
        }
      }
    }
  }
}

// 从缓存恢复
function restore() {
  if (typeof route.name === 'string') {
    const cache = tableSettingStore.getColumns(route.name)
    // 设置过才恢复
    if (Array.isArray(cache)) {
      columnOptions.value = cache
    }
  }
}

// 从 列可选项 更新 已选列
function columnCheckedOptionsUpdate() {
  columnCheckedOptions.value = columnOptions.value
    .filter(o => !o.column?.defaultHidden)
    .map(o => o.value)
}
// 从 列可选项 更新 全选状态
function isColumnAllSelectedUpdate() {
  isColumnAllSelected.value = columnOptions.value.length === columnCheckedOptions.value.length
}
// 更新 showIndexColumn
function showIndexColumnUpdate(showIndexColumn: any) {
  isInnerChange = true
  table.setProps({
    showIndexColumn,
  })
}
// 更新 rowSelection
function showRowSelectionUpdate(showRowSelection: any) {
  isInnerChange = true
  table.setProps({
    rowSelection: showRowSelection
      ? {
          ...omit(defaultRowSelection, ['selectedRowKeys']),
          fixed: true,
        }
      : undefined,
  })
}

// 更新表单状态
function formUpdate() {
  // 从 列可选项 更新 已选列
  columnCheckedOptionsUpdate()

  // 从 列可选项 更新 全选状态
  isColumnAllSelectedUpdate()

  // 列表列更新
  tableColumnsUpdate()
}

async function init() {
  if (!isRestored) {
    // 获取数据列
    const columns = getTableColumns()

    // 沿用逻辑
    table.setCacheColumns?.(columns)

    // 生成 默认值
    const options: ColumnOptionsType[] = []
    for (const col of columns) {
      // 只缓存 string 类型的列
      options.push({
        label:
            typeof col.title === 'string'
              ? col.title
              : col.customTitle === 'string'
                ? col.customTitle
                : '',
        value:
            typeof col.dataIndex === 'string'
              ? col.dataIndex
              : col.title === 'string'
                ? col.title
                : '',
        column: {
          defaultHidden: col.defaultHidden,
        },
        fixed: col.fixed,
      })
    }

    // 默认值 缓存
    defaultColumnOptions = options

    // 默认值 赋值
    columnOptions.value = cloneDeep(options)

    // remove消失的列、push新出现的列
    if (props.cache)
      diff()

    // 从缓存恢复
    if (props.cache)
      restore()

    // 更新表单状态
    formUpdate()

    isRestored = true
  }
}

// 初始化
async function once() {
  // 仅执行一次
  await sortableFix()
  init()
}
once()

onMounted(() => {
  watch(() => unref(getColumns), () => {
    if (!isInnerChange) {
      isRestored = false
      console.warn('onMounted isRestored')
      init()
    }
    else {
      isInnerChange = false
    }
  })
})
</script>

<template>
  <Tooltip placement="top">
    <template #title>
      <span>列设置</span>
    </template>
    <Popover
      placement="bottomLeft"
      trigger="click"
      :overlay-class-name="`${prefixCls}__column-list`"
      :get-popup-container="getPopupContainer"
      @open-change="onOpenChange"
    >
      <template #title>
        <div :class="`${prefixCls}__popover-title`">
          <Checkbox
            v-model:checked="isColumnAllSelected"
            :indeterminate="indeterminate"
            @change="onColumnAllSelectChange"
          >
            列展示
          </Checkbox>

          <Button size="small" type="link" @click="onReset">
            重置
          </Button>
        </div>
      </template>

      <template #content>
        <ScrollContainer>
          <Checkbox.Group ref="columnOptionsRef" v-model:value="columnCheckedOptions">
            <template v-for="opt in columnOptions" :key="opt.value">
              <div :class="`${prefixCls}__check-item`" :data-no="opt.value">
                <DragOutlined class="table-column-drag-icon" />
                <Checkbox :value="opt.value">
                  {{ opt.label }}
                </Checkbox>

                <Tooltip
                  placement="bottomLeft"
                  :mouse-leave-delay="0.4"
                  :get-popup-container="getPopupContainer"
                >
                  <template #title>
                    固定左侧
                  </template>
                  <Icon
                    icon="line-md:arrow-align-left"
                    :class="[
                      `${prefixCls}__fixed-left`,
                      {
                        active: opt.fixed === 'left',
                        disabled: opt.value ? !columnCheckedOptions.includes(opt.value) : true,
                      },
                    ]"
                    @click="onColumnFixedChange(opt, 'left')"
                  />
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip
                  placement="bottomLeft"
                  :mouse-leave-delay="0.4"
                  :get-popup-container="getPopupContainer"
                >
                  <template #title>
                    固定右侧
                  </template>
                  <Icon
                    icon="line-md:arrow-align-left"
                    :class="[
                      `${prefixCls}__fixed-right`,
                      {
                        active: opt.fixed === 'right',
                        disabled: opt.value ? !columnCheckedOptions.includes(opt.value) : true,
                      },
                    ]"
                    @click="onColumnFixedChange(opt, 'right')"
                  />
                </Tooltip>
              </div>
            </template>
          </Checkbox.Group>
        </ScrollContainer>
      </template>
      <SettingOutlined />
    </Popover>
  </Tooltip>
</template>

<style lang="less">
  @prefix-cls: ~'@{namespace}-basic-column-setting';

  .table-column-drag-icon {
    margin: 0 5px;
    cursor: move;
  }

  .@{prefix-cls} {
    &__popover-title {
      display: flex;
      position: relative;
      align-items: center;
      justify-content: space-between;
    }

    &__check-item {
      display: flex;
      align-items: center;
      min-width: 100%;
      padding: 4px 16px 8px 0;

      .ant-checkbox-wrapper {
        width: 100%;

        &:hover {
          color: @primary-color;
        }
      }
    }

    &__fixed-left,
    &__fixed-right {
      color: rgb(0 0 0 / 45%);
      cursor: pointer;

      &.active,
      &:hover {
        color: @primary-color;
      }

      &.disabled {
        color: @disabled-color;
        cursor: not-allowed;
      }
    }

    &__fixed-right {
      transform: rotate(180deg);
    }

    &__column-list {
      svg {
        width: 1em !important;
        height: 1em !important;
      }

      .ant-popover-inner-content {
        // max-height: 360px;
        padding-right: 0;
        padding-left: 0;
        // overflow: auto;
      }

      .ant-checkbox-group {
        display: inline-block;
        width: 100%;
        min-width: 260px;
        // flex-wrap: wrap;
      }

      .scrollbar {
        height: 220px;
      }
    }
  }
</style>
