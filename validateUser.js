import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDlG6p7VCEP6Q3XI8J06Whk7ajQChAUUPU",
  authDomain: "a-project-1c132.firebaseapp.com",
  projectId: "a-project-1c132",
  storageBucket: "a-project-1c132.appspot.com",
  messagingSenderId: "171458035988",
  appId: "1:171458035988:web:bc81149cd135b5ebcd8201",
  measurementId: "G-17SP4V15VV"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
onAuthStateChanged(auth, (user) => {
  if (!user && !window.location.href.includes("login.html")) {
      window.location.href = "login.html"; // Redirect to login page if user is not signed in and not already on login page
  } else if (user && !window.location.href.includes("index.html")) {
      window.location.href = "index.html"; // Redirect to home page if user is signed in and not already on home page
  }
});