import type { TileLayerOptions } from 'leaflet'

interface tileLayer {
  tileUrl: string
  options?: TileLayerOptions
}
const accessToken
  = 'pk.eyJ1IjoiY3VzXzgycW01d2MzIiwiYSI6Ijd5amlkN2xhMmZwMTJ2b2E0cXBseGZ0YWkiLCJ0Ijo0fQ.mE8viqYaaPjHZJTJvxdEZj2zZ5B1E7zHx7Cy4U2Ner4'

export const tileLayers: Array<tileLayer> = [
  {
    tileUrl: import.meta.env.VITE_GLOB_MAP_URL,
    options: {
      accessToken,
    },
  },
]
