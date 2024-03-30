import type { Router } from 'vue-router'
import { unref } from 'vue'
import { createPermissionGuard } from './permissionGuard'
import { useAppStoreWithOut } from '@/store/modules/app'
import { useUserStoreWithOut } from '@/store/modules/user'
import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting'

// Don't change the order of creation
export function setupRouterGuard(router: Router) {
  createPageLoadingGuard(router)
  createPermissionGuard(router)
}

// Used to handle page loading status
function createPageLoadingGuard(router: Router) {
  const userStore = useUserStoreWithOut()
  const appStore = useAppStoreWithOut()
  const { getOpenPageLoading } = useTransitionSetting()

  router.beforeEach(async (to) => {
    if (!userStore.getToken)
      return true

    if (to.meta.loaded)
      return true

    if (unref(getOpenPageLoading)) {
      appStore.setPageLoadingAction(true)
      return true
    }

    return true
  })
  router.afterEach(async () => {
    if (unref(getOpenPageLoading)) {
      // TODO Looking for a better way
      // The timer simulates the loading time to prevent flashing too fast,
      setTimeout(() => {
        appStore.setPageLoading(false)
      }, 220)
    }
    return true
  })
}
