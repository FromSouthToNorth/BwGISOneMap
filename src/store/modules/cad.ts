import { defineStore } from 'pinia'
import { store } from '@/store'

import type { CadType, CoalSeam, MqttResult } from '@/utils/mqtt/types'

export const useCadStore = defineStore({
  id: 'cad',
  state: () => ({
    cads: [],
    coalSeam: [],
    cadName: '',
  }),
  getters: {
    getCads(state): CadType[] {
      return state.cads
    },
    getCoalSeam(state): CoalSeam[] {
      return state.coalSeam
    },
    getCadName(state): string {
      return state.cadName
    },
  },
  actions: {
    setCads(result: MqttResult): void {
      const { params, coalSeam } = result
      this.cads = params
      this.coalSeam = coalSeam
    },
    setCoalSeam(coalSeam: CoalSeam[]): void {
      this.coalSeam = coalSeam
    },
    setCadName(cadName: string): void {
      this.cadName = cadName
    },
  },
})

// Need to be used outside the setup
export function useCadStoreWithOut() {
  return useCadStore(store)
}
