<script lang="ts" setup>
import { ExclamationCircleFilled, PieChartOutlined } from '@ant-design/icons-vue'
import { Tooltip } from 'ant-design-vue'
import { ref, unref, watch } from 'vue'
import { useCadSetting } from './src/hooks/useCadSetting'
import { CoalSeam } from './src/coalSeam'
import { Cads } from './src/cads'
import {
  SlideYTransition,
} from '@/components/Transtition/index'
import type { CadType } from '@/utils/mqtt/types'

const { getCad, getDefaultCad } = useCadSetting()

const cadSelect = ref<CadType[]>([])

watch(() => unref(getCad), (cads) => {
  setCadName(unref(getDefaultCad).typeName)
  cadSelect.value = cads
})

const cadName = ref<string>('')

function setCadName(name: string) {
  cadName.value = name
}
</script>

<template>
  <div class="cad right-top-menu-item cad-dropdown">
    <div class="cad-head">
      <span v-if="cadSelect.length">
        <PieChartOutlined />
        {{ cadName }}
      </span>
      <span
        v-else
        style="color: #faad14;"
      >
        <Tooltip
          color="#faad14"
          placement="left"
          title="查看2037查询图纸策略"
        >
          <ExclamationCircleFilled />
        </Tooltip>
        没有图纸数据
      </span>
    </div>
    <component :is="SlideYTransition">
      <div class="cad-dropdown-container">
        <CoalSeam />
        <Cads
          :cad-select="cadSelect"
          @set-cad-name="setCadName"
        />
      </div>
    </component>
  </div>
</template>

<style lang="less" scoped>
.cad-head {
  width: 180px;
  text-align: center;
  white-space: nowrap;        /* 禁止换行 */
  overflow: hidden;           /* 隐藏超出部分 */
  text-overflow: ellipsis;    /* 超出部分显示省略号 */
}
.cad-dropdown {
  position: relative;
}

.cad-dropdown-container {
  width: 280px;
  display: none;
  position: fixed;
  top: 58px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background-color: #fff;
  animation: s .3s;
  box-shadow: 0 0.75rem 2rem 1rem @component-shadow;
}

.cad-dropdown:hover .cad-dropdown-container {
  display: block;
}

@keyframes s {
  0% {
    opacity: 0;
  }
  30% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.5;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>
