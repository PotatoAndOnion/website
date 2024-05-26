import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { firebaseConfig } from "./config.js";
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