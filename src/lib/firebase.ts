import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

import firebase from 'firebase/compat/app'

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: 'AIzaSyBGzyMwFwpMn5C487Xk3N_hHddWtxhvWmM',

  authDomain: 'nextfireship-be702.firebaseapp.com',

  projectId: 'nextfireship-be702',

  storageBucket: 'nextfireship-be702.appspot.com',

  messagingSenderId: '136568726775',

  appId: '1:136568726775:web:dea4f98e860bb894ca1ff2'
}

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}
export async function getUserWithUsername(username: any) {
  const usersRef = firestore.collection('users')
  const query = usersRef.where('username', '==', username).limit(1)
  const userDoc = (await query.get()).docs[0]
  return userDoc
}
export const fromMillis = firebase.firestore.Timestamp.fromMillis
export function postToJSON(doc: { data: () => any }) {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis()
  }
}
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()
export type IFirestoreDocument = firebase.firestore.DocumentData
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp

export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED
