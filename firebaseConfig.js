import initializeApp from '@react-native-firebase/app';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDSBx_Rm2LdSfFY3Y6s-VUGp7fexN_mBCA',
  authDomain: 'hayat-b0036.firebaseapp.com',
  databaseURL: 'https://hayat-b0036.firebaseio.com',
  projectId: 'hayat-b0036',
  storageBucket: 'hayat-b0036.appspot.com',
  messagingSenderId: 'sender-id',
  appId: 'app-id',
  measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
