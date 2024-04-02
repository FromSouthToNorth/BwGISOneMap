import type { TileLayerOptions } from 'leaflet'
import { EncryptionFactory } from '@/utils/cipher'

interface TileLayer {
  tileUrl: string
  options?: TileLayerOptions
}
const base64 = EncryptionFactory.createBase64Encryption()

const accessToken
  = base64.decrypt('cGsuZXlKMUlqb2lZM1Z6WHpneWNXMDFkMk16SWl3aVlTSTZJamQ1YW1sa04yeGhNbVp3TVRKMmIyRTBjWEJzZUdaMFlXa2lMQ0owSWpvMGZRLm1FOHZpcVlhYVBqSFpKVEp2eGRFWmoyelo1QjFFN3pIeDdDeTRVMk5lcjQ=')

const tileUrl = import.meta.env.VITE_GLOB_MAP_URL

export const tileLayers: Array<TileLayer> = [
  {
    tileUrl,
    options: {
      accessToken,
    },
  },
]
