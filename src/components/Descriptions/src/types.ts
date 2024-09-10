export interface SubStrategy {
  name: string
  type: 'info' | 'table' | 'iframe'
  columns: any[]
  data_type: string
  Strategy?: number
}
