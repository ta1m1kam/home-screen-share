import firebase from 'firebase/app'
import 'firebase/firestore'

if (!firebase.apps.length) {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    projectId: 'home-screen-share'
  }
  firebase.initializeApp(config)
  firebase.firestore().settings({
    timestampsInSnapshots: true
  })
}

const db = firebase.firestore()

export default db
