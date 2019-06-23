import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

if (!firebase.apps.length) {
  const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'home-screen-share.firebaseapp.com',
    databaseURL: 'https://home-screen-share.firebaseio.com',
    projectId: 'home-screen-share',
    storageBucket: 'home-screen-share.appspot.com'
  }
  firebase.initializeApp(config)
}

export default firebase
