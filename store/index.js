import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state: {
      category: '',
      loading: false
    },
    mutations: {
      setLoading(state, loading) {
        state.loading = loading
      },
      setCategory(state, category) {
        state.category = category
      }
    },
    actions: {

    },
    getters: {
      loading: state => state.loading,
      category: state => state.category
    }
  })
}

export default createStore
