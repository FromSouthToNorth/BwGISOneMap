import mqtt from 'mqtt'
import type { MqttClient } from 'mqtt'
import { buildUUID } from '../uuid'
import { getMineDesc, getToken } from '../auth'
import { connect } from './mqttConnect'

export class RealTimeData {
  public isDebug: boolean
  public caller: string
  public clientId: string
  public client: MqttClient

  constructor(isDebug: boolean, caller: string) {
    this.isDebug = isDebug
    this.caller = caller
    this.clientId = buildUUID()
    this.client = this.init()
    console.log(this.client)
  }

  async init() {
    const token = getToken()
    const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
    let client
    try {
      const connectStr = `${protocol}${location.host}${import.meta.env.VITE_PUBLIC_PATH}mqtt`
      connect.clientId = this.clientId
      connect.will = {
        topic: `/${getMineDesc()}/Get/${this.clientId}/LastWill`,
        payload: JSON.stringify({
          type: 'LastWill',
          token,
          clientId: this.clientId,
          caller: this.caller,
        }),
      }
      client = mqtt.connect(connectStr, connect)
    }
    catch (error) {
      console.error('mqtt connect error: ', error)
    }

    client.on('connect', () => {
      if (this.isDebug)
        console.log(`连接成功[${getDate()}]`)
    })
    return client
  }
}
