import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore  } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBs4a4f3rNphAiEeyg80y46IbLOqcxdsbc",
  authDomain: "caas---candy-as-a-service.firebaseapp.com",
  projectId: "caas---candy-as-a-service",
  storageBucket: "caas---candy-as-a-service.appspot.com",
  messagingSenderId: "535446199489",
  appId: "1:535446199489:web:b196d742219de1736dc840"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }