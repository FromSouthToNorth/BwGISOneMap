// import { useRoute } from 'vue-router'
// import { watch } from 'vue'
import { Mqtt } from './Mqtt'
import { publishMineInfo } from './publish'
import { getUserInfo } from '@/api/sys/login'
import { useUserStoreWithOut } from '@/store/modules/user'

// import { useUserSetting } from '@/hooks/web/sys/useUser'

export const mqtt = new Mqtt(true)
export const MQTT_CLIENT_ID = mqtt.clientId

export function contextInit() {
  const userState = useUserStoreWithOut()
  getUserInfo().then((res) => {
    userState.setUserInfo(res)
  }).catch((error) => {
    console.error(error)
  })

  mqtt.init()

  /* 通配符订阅消息 */
  mqtt.subscribeCommon()

  /** 获取矿井消息 */
  mqtt.publish(publishMineInfo())

  // const route = useRoute()

  // const { mineInfo } = useUserSetting()
  // watch(() => mineInfo.value, () => {
  //   /* 根据路由的部门ID查询菜单及图纸 */
  //   const departmentID = route.query?.departmentID
  //     || route.params?.departmentID
  //   publishInit(departmentID)
  // })
}
