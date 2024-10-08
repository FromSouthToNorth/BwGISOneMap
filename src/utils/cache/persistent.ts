import type { MineInfo, UserInfo } from '#/store'

import type {
  ACCESS_NET_TOKEN,
  MAP_LOCATION,
  MINE_DESC_KEY,
  MINE_INFO_KEY,
  MINE_NAME_KEY,
  TABLE_SETTING_KEY,
  TOKEN_KEY,
  USER_INFO_KEY,
} from '@/enums/cacheEnum'

interface BasicStore {
  [TOKEN_KEY]: string | number | null | undefined
  [ACCESS_NET_TOKEN]: string | number | null | undefined
  [USER_INFO_KEY]: UserInfo
  [MINE_INFO_KEY]: MineInfo
  [MINE_DESC_KEY]: string | null | undefined
  [MAP_LOCATION]: string
  [MINE_NAME_KEY]: string
  [TABLE_SETTING_KEY]: string
}

export type BasicKeys = keyof BasicStore
