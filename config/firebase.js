import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
	apiKey: "AIzaSyDtB2zu1RKZ2gNB-y_-yJ17urXvlFEOPyg",
	authDomain: "chat-app-61106.firebaseapp.com",
	projectId: "chat-app-61106",
	storageBucket: "chat-app-61106.appspot.com",
	messagingSenderId: "691396173215",
	appId: "1:691396173215:web:77a7d7637519d8e947f1aa"
};

initializeApp(firebaseConfig);
export const auth = getAuth()
export const database = getFirestore()