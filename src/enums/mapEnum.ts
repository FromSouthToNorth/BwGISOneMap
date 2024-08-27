export enum MapURLEnum {
  CAD_URL = '/gis/bwcadgis/gwc/service/wms',
  CAD_URLS = '/gis/bwcadgis/geoserver/bwcad/wms',
  URL = '/BwMap/tiles/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY3VzXzgycW01d2MzIiwiYSI6Ijd5amlkN2xhMmZwMTJ2b2E0cXBseGZ0YWkiLCJ0Ijo0fQ.mE8viqYaaPjHZJTJvxdEZj2zZ5B1E7zHx7Cy4U2Ner4',
}

export enum MineLayersEnum {
  MINE_BOUNDARY = 'mineBoundary',
  MINE_MARKER = 'mineMarker',
  MINE_SATELLITE = 'satellite',
}

export enum PublicTile {
  PUBLIC = '_CJGCGYTC',
  CQL_FILTER_START = 'layer in(',
  CQL_FILTER_END = ')',
}

export enum BasePoint {
  BASE_POINT = 'BasePoint',
  CENTER_POINT = 'centerPoint',
}

export enum LayerType {
  MARKER = 'Marker',
  POLYLINE = 'Polyline',
  POLYGON = 'Polygon',
}
