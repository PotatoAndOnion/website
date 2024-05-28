import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {getAuth, signInWithEmailAndPassword, sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {firebaseConfig} from "./config.js"


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();


//log in function
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  console.log(email, password);

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
        window.location.href = "index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Logged in unsuccessfully, please try again.");
    });
});



//password reset function
document.getElementById("forgotPassword").addEventListener("click", (e) => {
  e.preventDefault();
  const email = prompt("Please enter your email:");
  if (email) {
    sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("Password reset email sent");
    })
    .catch((error) => {
      alert(`Error ${error.message}`);
    });
  }
});