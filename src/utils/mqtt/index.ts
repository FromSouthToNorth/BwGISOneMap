import { RealTimeData } from './Mqtt'
import { productEnum } from '@/enums/productEnum'

const realTimeData = new RealTimeData(true, productEnum.PRODUCT_CODE)

class Mqtt {
  private realTimeData: any
  private OnConnect: any
  private OnReconnect: any
  constructor() {
    this.realTimeData = realTimeData
    console.log(realTimeData.clientId)
  }
}
