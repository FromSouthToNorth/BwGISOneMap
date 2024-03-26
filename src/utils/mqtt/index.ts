import { Mqtt } from './Mqtt'
import { publishGetMineInfo } from './publish'

export const mqtt = new Mqtt(true)
export const MQTT_CLIENT_ID = mqtt.clientId

export function createMqtt() {
  mqtt.init()
  mqtt.subscribeCommon()
  mqtt.publish(publishGetMineInfo())
  return mqtt
}
