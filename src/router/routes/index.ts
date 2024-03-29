import { PageEnum } from '@/enums/pageEnum'
import type { AppRouteRecordRaw } from '@/router/types'
import { LAYOUT } from '@/router/constant'

export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.BASE_HOME,
  meta: {
    title: 'Root',
  },
}

export const IndexRoute: AppRouteRecordRaw = {
  path: '/index',
  name: 'Index',
  component: LAYOUT,
  redirect: '/index',
  meta: {
    title: 'Index',
  },
  children: [
    {
      path: '/index',
      name: 'map',
      component: () => import('@/views/index.vue'),
      meta: {
        title: '2DGIS一张图',
      },
    },
  ],
}

export const basicRoutes = [
  RootRoute,
  IndexRoute,
]
