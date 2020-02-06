// import firebase from "firebase";
import "firebase/auth";
import * as firebase from 'firebase/app'

var firebaseConfig = {
    apiKey: "AIzaSyAjGcGJftuOzKwdaniWMNm6rDQV0Tmv5P4",
    authDomain: "lakshya-internal.firebaseapp.com",
    databaseURL: "https://lakshya-internal.firebaseio.com",
    projectId: "lakshya-internal",
    storageBucket: "lakshya-internal.appspot.com",
    messagingSenderId: "185421541535",
    appId: "1:185421541535:web:22108ce8453e2d369832aa"
    };
firebase.initializeApp(firebaseConfig);

export default firebase;
