import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC29ZRAt_EB1k5o8vX03b1WW2if6-0Nylg",
  authDomain: "m-news-one.firebaseapp.com",
  projectId: "m-news-one",
  storageBucket: "m-news-one.appspot.com",
  messagingSenderId: "639668030662",
  appId: "1:639668030662:web:b97b3ae80510f753a45bc7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app)
const db = getFirestore(app)

export { app, auth, storage, db }