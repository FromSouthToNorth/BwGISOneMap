import type { Router } from 'vue-router'
import { createPermissionGuard } from './permissionGuard'

// Don't change the order of creation
export function setupRouterGuard(router: Router) {
  createPermissionGuard(router)
}
