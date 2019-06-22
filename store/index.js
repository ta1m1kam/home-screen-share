import Vuex from 'vuex'
import md5 from 'md5'
import firebase from '~/plugins/firebase'
import { saveUserData, clearUserData } from '~/utils'

const db = firebase.firestore()

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
      },
      clearToken: state => (state.token = ''),
      clearUser: state => (state.user = null)
    },
    actions: {
      async authenticateUser({ commit }, userPayload) {
        let user
        let authUserData
        if (userPayload.action === 'twitter') {
          let accessToken
          commit('setLoading', true)
          const provider = new firebase.auth.TwitterAuthProvider()
          firebase.auth().signInWithPopup(provider).then(function (result) {
            console.log(result)
            user = { email: result.additionalUserInfo.username, avatar: result.additionalUserInfo.profile.profile_image_url_https }
            authUserData = result.additionalUserInfo.username
            console.log(result.additionalUserInfo.username)
            accessToken = result.credential.accessToken

            db.collection('users').doc(authUserData).set(user)
            commit('setUser', user)
            commit('setToken', accessToken)
            commit('setLoading', false)
            const expiresIn = 300
            saveUserData({ accessToken, expiresIn }, user)
          }).catch(function (error) {
            console.log(error)
            commit('setLoading', false)
          })
        } else {
          try {
            commit('setLoading', true)
            authUserData = await this.$axios.$post(
              `/${userPayload.action}/`,
              {
                email: userPayload.email,
                password: userPayload.password,
                returnSecureToken: userPayload.returnSecureToken
              }
            )
            if (userPayload.action === 'register') {
              const avatar = `http://gravatar.com/avatar/${md5(authUserData.email)}?`
              user = { email: authUserData.email, avatar }
              await db.collection('users').doc(userPayload.email).set(user)
            } else if (userPayload.action === 'login') {
              console.log(authUserData)
              const loginRef = db.collection('users').doc(userPayload.email)
              const loggedInUser = await loginRef.get()
              user = loggedInUser.data()
            }
            commit('setUser', user)
            commit('setToken', authUserData.idToken)
            commit('setLoading', false)
            saveUserData(authUserData, user)
          } catch (err) {
            console.log(err)
            commit('setLoading', false)
          }
        }
      },
      setLogoutTimer({ dispatch }, interval) {
        setTimeout(() => dispatch('logoutUser'), interval)
      },
      logoutUser({ commit }) {
        commit('clearToken')
        commit('clearUser')
        clearUserData()
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
