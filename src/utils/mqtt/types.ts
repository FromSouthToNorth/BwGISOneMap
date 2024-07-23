import type { MqttFunEnum } from '@/enums/mqttEnum'

export interface Param {
  name: string
  value: any
}

export interface Publish {
  code: number
  token?: string
  caller?: string
  clientId?: string
  mineDesc?: string
  strategyParams?: Param[]
}

export interface Params {
  code: number
  data: []
}

export interface CoalSeam {
  ID: string
  Txt: string
  Value: string
  tunnelCount: number
}

export interface MqttResult {
  generalFunc: MqttFunEnum
  params: Params
  coalSeam?: CoalSeam[]
}

export interface CoalBed {
  CoalBed: string
}

export interface DwgLayer {
  DwgLayer: string
}

export interface CadType {
  Classfyname: string
  Code: string
  cads: Cad[]
}

export interface Cad {
  Classfyname: string
  Layers: DwgLayer[]
  coalSeams: CoalBed[]
  code: string
  dwgId: string
  isPublicLayers: boolean
  isCoalBed: boolean
  typeName: string
  publish_days: number
  exceedDay: number
}
