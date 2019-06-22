import Vuex from 'vuex'
import md5 from 'md5'

const createStore = () => {
  return new Vuex.Store({
    state: {
      loading: false,
      category: '',
      token: '',
      user: null
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
      },
      setUser(state, user) {
        state.user = user
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
          const avatar = `http://gravatar.com/avatar/${md5(authUserData.email)}?`
          const user = { email: authUserData.email, avatar }
          commit('setUser', user)
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
      isAuthenticated: state => !!state.token,
      user: state => state.user
    }
  })
}

export default createStore
