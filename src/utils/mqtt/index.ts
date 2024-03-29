import { useRoute } from 'vue-router'
import { Mqtt } from './Mqtt'
import { publishInit } from './publish'

export const mqtt = new Mqtt(true)
export const MQTT_CLIENT_ID = mqtt.clientId

export function contextInit() {
  const route = useRoute()
  /* 根据路由的部门ID查询菜单及图纸 */
  const departmentID = route.query?.departmentID || route.params?.departmentID

  mqtt.init()

  /* 通配符订阅消息 */
  mqtt.subscribeCommon()

  /** 获取矿井消息 */
  publishInit(departmentID).forEach((e) => {
    mqtt.publish(e)
  })
}
