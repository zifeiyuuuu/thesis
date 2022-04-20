import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    user: null,
    authToken: sessionStorage.getItem('authToken') || ''
  },
  mutations: {
    updateUser (state, user) {
      state.user = user
    }
  },
  actions: {
    login ({ commit }, payload) {
      sessionStorage.setItem('authToken', payload.authToken)
      commit('updateUser', payload.user)
    }
  },
  getters: {
  }
})
