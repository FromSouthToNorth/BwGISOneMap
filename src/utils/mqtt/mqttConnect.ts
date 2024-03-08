import type { IClientOptions } from 'mqtt'

export const connect: IClientOptions = {
  clientId: '',
  username: 'bowwell',
  password: 'bowwell',
  keepalive: 10,
  reconnectPeriod: 10000, // 两次重新连接之间的间隔
  connectTimeout: 30 * 1000, // 等待收到CONNACK的时间
  will: {
    topic: '',
    payload: '',
  },
}
