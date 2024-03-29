import type { MqttClient, PacketCallback } from 'mqtt'
import mqtt from 'mqtt'
import { getMineDesc } from '../auth'
import { brokerUrl, clientOptions } from './settings'
import { mqttFun } from './fun'
import type { MqttResult } from './types'
import { buildUUID } from '@/utils/uuid'
import { formatToDateTime } from '@/utils/dateUtil'
import { MqttEnum } from '@/enums/mqttEnum'

class Mqtt {
  clientId: string
  isDebug: boolean
  caller: string
  client: MqttClient
  constructor(isDebug: boolean) {
    this.clientId = buildUUID()
    this.isDebug = isDebug
    this.caller = import.meta.env.VITE_PRODUCT_CODE
    this.client = mqtt.connect(brokerUrl(), clientOptions(this.clientId, this.caller))
  }

  init() {
    const _client = this.client
    _client.on('connect', () => {
      if (this.isDebug)
        console.warn(`[${formatToDateTime(new Date())}] 连接成功`)
    })

    _client.on('reconnect', () => {
      if (this.isDebug)
        console.warn(`[${formatToDateTime(new Date())}] 重新连接开始`)
    })

    _client.on('close', () => {
      if (this.isDebug)
        console.warn(`[${formatToDateTime(new Date())}] 断开连接`)
    })

    _client.on('error', (error) => {
      if (this.isDebug)
        console.warn(`[${formatToDateTime(new Date())}] 错误: `, error)
    })

    _client.on('message', (topic, message) => {
      try {
        const str = message.toString()
        if (!str)
          console.error(`${topic}, 收到数据为空。`)

        const result = JSON.parse(str) as MqttResult
        console.warn(`[${formatToDateTime(new Date())}] 收到消息: `, topic, result)
        mqttFun(result.generalFunc, result.params)
      }
      catch (error) {
        console.error(error)
      }
    })
  }

  publish(message: object, callback?: PacketCallback) {
    const topic = `/${getMineDesc()}${MqttEnum.PUBLISH}/${this.clientId}`

    if (this.isDebug)
      console.warn(`[${formatToDateTime(new Date())}] 发布消息: `, topic, message)
    this.client.publish(topic, JSON.stringify(message), callback)
    return this
  }

  subscribeCommon() {
    const topicObject = `/${getMineDesc()}${MqttEnum.SUBSCRIBE}/${this.clientId}/#`
    this.client.subscribe(topicObject)
  }
}

export { Mqtt }
