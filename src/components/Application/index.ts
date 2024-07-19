import appProvider from './src/AppProvider.vue'
import appSearch from './src/search/AppSearch.vue'
import mineName from './src/mineName/MineName.vue'
import user from './src/user/User.vue'
import { withInstall } from '@/utils'

export { useAppProviderContext } from './src/useAppContext'

export const AppProvider = appProvider
export const AppSearch = withInstall(appSearch)
export const MineName = withInstall(mineName)
export const User = withInstall(user)
