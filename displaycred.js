import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { firebaseConfig } from "./config.js";





const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);




document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(firebaseAuth, async (user) => {
      const displayName = document.getElementById('displayName');
      const profilePic = document.getElementById('profilePic');
      const loginIcon = document.getElementById('loginIcon');
  
      if (user) {
        const userDoc = doc(firebaseFirestore, 'users', user.uid);
        const userSnap = await getDoc(userDoc);
  
        if (userSnap.exists()) {
          const userData = userSnap.data();
          
          displayName.textContent = userData.displayName;
          profilePic.src = userData.profilePicUrl;
  
          // Show the profile picture and display name, hide the login icon
          displayName.style.display = 'inline';
          profilePic.style.display = 'inline';
          loginIcon.style.display = 'none';
        } else {
          console.error('No user data found!');
        }
      } else {
        // No user is signed in, show the login icon and hide profile details
        displayName.style.display = 'none';
        profilePic.style.display = 'none';
        loginIcon.style.display = 'block';
  
        window.location.href = 'login.html';
      }
    });
});