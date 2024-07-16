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
