import appProvider from './src/AppProvider.vue'
import appSearch from './src/search/AppSearch.vue'
import mineName from './src/mineName/MineName.vue'
import user from './src/user/User.vue'
import cad from './src/cad/Cad.vue'
import satellite from './src/satellite/Satellite.vue'
import { withInstall } from '@/utils'

export { useAppProviderContext } from './src/useAppContext'
export { useSatelliteSetting } from './src/satellite/hooks/useSatelliteSetting'
export { useHideMinePoint } from './src/mineName/hooks/useHideMinePoint'

export const AppProvider = appProvider
export const AppSearch = withInstall(appSearch)
export const MineName = withInstall(mineName)
export const User = withInstall(user)
export const Cad = withInstall(cad)
export const Satellite = withInstall(satellite)
