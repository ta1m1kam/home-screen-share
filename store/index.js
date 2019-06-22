import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loading: false,
      category: '',
      token: ''
    },
    mutations: {
      setLoading(state, loading) {
        state.loading = loading
      },
      setCategory(state, category) {
        state.category = category
      },
      setToken(state, token) {
        state.token = token
      }
    },
    actions: {
      async authenticateUser({ commit }, userPayload) {
        try {
          commit('setLoading', true)
          const authUserData = await this.$axios.$post(
            '/register/',
            userPayload
          )
          commit('setToken', authUserData.idToken)
          console.log(authUserData) // TODO: 削除する
          commit('setLoading', false)
        } catch (err) {
          console.log(err)
          commit('setLoading', false)
        }
      }
    },
    getters: {
      loading: state => state.loading,
      category: state => state.category,
      token: state => state.token,
      isAuthenticated: state => !!state.token
    }
  })
}

export default createStore
