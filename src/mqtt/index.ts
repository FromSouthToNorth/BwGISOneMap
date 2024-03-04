import mqtt from 'mqtt'
import { buildUUID } from '@/utils/uuid'

class Mqtt {
  clientId: string
  isDebug: boolean
  caller: string
  constructor(isDebug: boolean, caller: string) {
    this.clientId = buildUUID()
    this.isDebug = isDebug
    this.caller = caller
  }

  init() {
    console.log('mqtt init')
  }
}

export { Mqtt }
