import type { IClientOptions } from 'mqtt'
import { MqttEnum } from '@/enums/mqttEnum'
import { HttpTypeEnum } from '@/enums/httpEnum'
import { getMineDesc, getToken } from '@/utils/auth'

export function clientOptions(clientId: string, caller: string): IClientOptions {
  const type = 'LastWill'
  const topic = `/${getMineDesc()}/Get/${clientId}/${type}`
  const token = getToken()

  return {
    clientId,
    username: 'bowwell',
    password: 'bowwell',
    keepalive: 10,
    reconnectPeriod: 10000, // 两次重新连接之间的间隔
    connectTimeout: 30 * 1000, // 等待收到CONNACK的时间
    will: {
      topic,
      payload: JSON.stringify({
        type,
        token,
        clientId,
        caller,
      }),
    },
  }
}

export function brokerUrl(): string {
  const { protocol, host } = window.location
  const pro = protocol === HttpTypeEnum.HTTPS ? MqttEnum.WSS : MqttEnum.WS
  return `${pro}${host}${import.meta.env.VITE_PUBLIC_PATH}mqtt`
}
