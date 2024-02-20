import { PageEnum } from '@/enums/pageEnum'
import type { AppRouteRecordRaw } from '@/router/types'

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
  component: () => import('@/views/index.vue'),
  meta: {
    title: 'Index',
  },
}

export const basicRoutes = [
  RootRoute,
  IndexRoute,
]
