import md5 from 'md5'
import firebase from '~/plugins/firebase'
import { saveUserData, clearUserData } from '~/utils'

const db = firebase.firestore()
const firestorage = firebase.storage()

export const state = () => ({
  loading: false,
  category: '',
  token: '',
  user: null,
  screenImages: []
})

export const mutations = {
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
  clearUser: state => (state.user = null),
  setScreenImage(state, screenImages) {
    state.screenImages = screenImages
  }
}

export const actions = {
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
        const expiresIn = 3000
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
  },
  uploadImage({ state }, payload) {
    firestorage.ref('images/' + payload.name)
      .put(payload.file)
      .then((snapshot) => {
        console.log(snapshot)
        snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          const image = await db.collection('images').add({ downloadURL })
          const userRef = db.collection(`images/${image.id}/user`)
          await userRef.doc(state.user.email).set(state.user)
        })
      })
  },
  async loadScreenImage({ commit }) {
    commit('setLoading', true)
    const imageRef = await db.collection('images')
    imageRef.get().then((querySnapshot) => {
      console.log(querySnapshot)
      const loadedScreenImage = []
      querySnapshot.forEach((doc) => {
        loadedScreenImage.push(doc.data())
      })
      this.commit('setScreenImage', loadedScreenImage)
    })
    commit('setLoading', false)
  }
}

export const getters = {
  loading: state => state.loading,
  category: state => state.category,
  token: state => state.token,
  isAuthenticated: state => !!state.token,
  user: state => state.user,
  screenImages: state => state.screenImages
}
