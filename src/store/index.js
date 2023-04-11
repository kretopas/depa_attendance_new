import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';

export default createStore({
  state: {
  },
  getters: {
    userProfile: (state) => {
      return state.userProfile;
    },
  },
  mutations: {
    userProfile(state, userProfile) {
      state.userProfile = userProfile;
    }
  },
  actions: {
    userProfile(context, userProfile) {
      context.commit('userProfile', userProfile);
    }
  },
  modules: {
  },
  plugins: [
    createPersistedState()
  ]
})
