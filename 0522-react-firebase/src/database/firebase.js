// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCqeyKVR2KaobBatDNckUvWMshNi0zeSrM",
  authDomain: "practice-85cec.firebaseapp.com",
  projectId: "practice-85cec",
  storageBucket: "practice-85cec.appspot.com",
  messagingSenderId: "884083206485",
  appId: "1:884083206485:web:b4ba8a61d8f8577cb727dc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 사용하고자하는 서비스를 들고와서 사용 
// 인증서비스에 관한 내용 들고와서 사용
export const auth = getAuth(app);