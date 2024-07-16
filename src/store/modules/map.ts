import type { Map } from 'leaflet'
import { defineStore } from 'pinia'

import { store } from '@/store'
import type { CoalSeam, MqttResult } from '@/utils/mqtt/types'

interface CoalBed {
  CoalBed: string
}

interface DwgLayer {
  DwgLayer: string
}

export interface Cad {
  Classfyname: string
  Layers: DwgLayer[]
  coalSeams: CoalBed[]
  code: string
  dwgId: string
  isPublicLayers: boolean
  isCoalBed: boolean
}

export interface CadType {
  Classfyname: string
  Code: string
  cads: Cad[]
}

export const useMapStore = defineStore({
  id: 'map',
  state: () => ({
    map: {},
    cads: [],
    coalSeam: [],
  }),
  getters: {
    getMap(state): Map {
      return state.map as Map
    },
    getCads(state): CadType[] | [] {
      return state.cads
    },
    getCoalSeam(state): CoalSeam[] | [] {
      return state.coalSeam
    },
  },
  actions: {
    setMap(map: Map): void {
      this.map = map
    },
    setCads(result: MqttResult): void {
      const { params, coalSeam } = result
      this.cads = params
      this.coalSeam = coalSeam
    },
    setCoalSeam(coalSeam: CoalSeam[]): void {
      this.coalSeam = coalSeam
    },
  },
})

// Need to be used outside the setup
export function useMapStoreWithOut() {
  return useMapStore(store)
}
