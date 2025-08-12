import { FirebaseOptions, initializeApp } from 'firebase/app'

const productionFirebaseConfig = {
  apiKey: 'AIzaSyDXeHph-EXXU76UnH_QvpmCuUuQSt830J4',
  authDomain: 'gfx-oku.firebaseapp.com',
  projectId: 'gfx-oku',
  storageBucket: 'gfx-oku.appspot.com',
  messagingSenderId: '995090713626',
  appId: '1:995090713626:web:fe9816b0b67304036555a3',
  measurementId: 'G-R2K4F97EPW',
}

const stagingFirebaseConfig = {
  apiKey: 'AIzaSyA4TSccj3No5icxslAyIa2kDQNSEfuUkek',
  authDomain: 'oku-dev.firebaseapp.com',
  projectId: 'oku-dev',
  storageBucket: 'oku-dev.appspot.com',
  messagingSenderId: '257185890006',
  appId: '1:257185890006:web:0c1d0892e5052b52529377',
  measurementId: 'G-F2MDRMG1QJ',
}

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig: FirebaseOptions =
  process.env.NODE_ENV === 'production' ? productionFirebaseConfig : stagingFirebaseConfig

export const firebase = initializeApp(firebaseConfig)
