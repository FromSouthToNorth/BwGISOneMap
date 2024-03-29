import { Mqtt } from './Mqtt'
import { publishGetMineInfo } from './publish'

export const mqtt = new Mqtt(true)
export const MQTT_CLIENT_ID = mqtt.clientId

export function createMqtt() {
  mqtt.init()

  /* 通配符订阅消息 */
  mqtt.subscribeCommon()

  /** 获取矿井消息 */
  mqtt.publish(publishGetMineInfo())
}
