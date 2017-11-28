  import firebase from 'firebase';

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBnNfGLSva8FBrx1s6azxNYgvBNihkQq0M",
    authDomain: "emoji-game-22270.firebaseapp.com",
    databaseURL: "https://emoji-game-22270.firebaseio.com",
    projectId: "emoji-game-22270",
    storageBucket: "emoji-game-22270.appspot.com",
    messagingSenderId: "41567621807"
  };
  firebase.initializeApp(config);
  export const firebasedb = firebase.database();
