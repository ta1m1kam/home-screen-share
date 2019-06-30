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
  homeScreens: [],
  homeScreen: null,
  feed: []
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
  clearFeed: state => (state.feed = []),
  setHomeScreens(state, homeScreens) {
    state.homeScreens = homeScreens
  },
  setHomeScreen(state, homeScreen) {
    state.homeScreen = homeScreen
  },
  setFeed(state, homeScreens) {
    state.feed = homeScreens
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
        user = { email: result.additionalUserInfo.username, avatar: result.additionalUserInfo.profile.profile_image_url_https }
        authUserData = result.additionalUserInfo.username
        accessToken = result.credential.accessToken

        db.collection('users').doc(authUserData).set(user)
        commit('setUser', user)
        commit('setToken', accessToken)
        commit('setLoading', false)
        const expiresIn = 3000
        saveUserData({ accessToken, expiresIn }, user)
        return user.email
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
  async loadUserFeed({ state }) {
    if (state.user) {
      const feedRef = db.collection(`users/${state.user.email}/feed`)
      await feedRef.onSnapshot((hoge) => {
        let homeScreens = []
        hoge.forEach((doc) => {
          homeScreens.push(doc.data())
          this.commit('setFeed', homeScreens)
        })
        if (hoge.empty) {
          homeScreens = []
          this.commit('setFeed', homeScreens)
        }
      })
    }
  },
  async removeHomeScreenFromFeed({ state }, homeScreen) {
    const homeScreenRef = db.collection(`users/${state.user.email}/feed`).doc(homeScreen.id)
    await homeScreenRef.delete()
  },
  uploadImage({ state }, payload) {
    firestorage.ref('home_screens/' + payload.name)
      .put(payload.file)
      .then((snapshot) => {
        console.log(snapshot)
        snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          const image = await db.collection('home_screens').add({ downloadURL })
          const userRef = db.collection(`home_screens/${image.id}/user`)
          await userRef.doc(state.user.email).set(state.user)
        })
      })
  },
  async loadHomeScreens({ commit }) {
    commit('setLoading', true)
    const imageRef = await db.collection('home_screens')
    imageRef.get().then((querySnapshot) => {
      const loadedHomeScreens = []
      querySnapshot.forEach((doc) => {
        const screen = { image_url: doc.data().downloadURL, id: doc.id }
        loadedHomeScreens.push(screen)
      })
      this.commit('setHomeScreens', loadedHomeScreens)
    })
    commit('setLoading', false)
  },
  async loadHomeScreen(context, homeScreenId) {
    const screenImageRef = db.collection('home_screens').doc(homeScreenId)
    await screenImageRef.get().then((doc) => {
      const screen = { image_url: doc.data().downloadURL, id: doc.id }
      this.commit('setHomeScreen', screen)
    })
  },
  async addHomeScreenToFeed({ state }, homeScreen) {
    const feedRef = db.collection(`users/${state.user.email}/feed`).doc(homeScreen.id)
    await feedRef.set(homeScreen)
  }
}

export const getters = {
  loading: state => state.loading,
  category: state => state.category,
  token: state => state.token,
  isAuthenticated: state => !!state.token,
  user: state => state.user,
  homeScreens: state => state.homeScreens,
  homeScreen: state => state.homeScreen,
  feed: state => state.feed
}
