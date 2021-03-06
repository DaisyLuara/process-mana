import Vue from 'vue'
import Vuex from 'vuex'
import appSetting from './modules/appSetting'
import curUserInfo from './modules/curUserInfo'
import notificationCount from './modules/notificationCount'
import processState from './modules/processState'
import getters from './getters'
import mutations from './mutations'
import appState from './modules/appState'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    page: null,
    components: [],
    store: {},
    comments: {}
  },
  modules: {
    appSetting,
    curUserInfo,
    appState,
    notificationCount,
    processState
  },
  getters,
  // actions,
  mutations
})
