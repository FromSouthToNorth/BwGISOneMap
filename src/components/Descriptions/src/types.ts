import type { TypeEnum } from '@/enums/tableEnum'

export interface SubStrategy {
  name?: string
  type: TypeEnum
  columns: any[]
  data_type?: string
  Strategy?: number
}
