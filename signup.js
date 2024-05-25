import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, collection, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-storage.js";
import { firebaseConfig } from "./config.js";

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseFirestore = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

const signupForm = document.getElementById('signupForm');

registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const displayName = document.getElementById('displayName').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const profilePic = document.getElementById('profilePic').files[0];
  const defaultProfilePic = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  // Password verification
  if (password.length < 6) {
    alert('Password must be at least 6 characters long');
    return;
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    if (!user) {
      throw new Error('User not found');
    }

    await updateProfile(user, {
      displayName: displayName
    });

    // Set default profile picture if no picture uploaded
    let profilePicUrl = defaultProfilePic;

    // Upload profile picture if provided
    if (profilePic) {
      const storageRef = ref(firebaseStorage, `profilePictures/${user.uid}`);
      await uploadBytes(storageRef, profilePic);

      profilePicUrl = await getDownloadURL(storageRef);
    }

    // Store user data in Firestore
    await setDoc(doc(firebaseFirestore, 'users', user.uid), {
      displayName: displayName,
      profilePicUrl: profilePicUrl,
      uid: user.uid // Storing UID
    });

    console.log('User signed up successfully');
    window.location.href = './index.html';
  } catch (error) {
    console.error('Error signing up:', error.message);
    alert(error.message);
  }
});
