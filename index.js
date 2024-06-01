import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
import {getAuth, signOut, onAuthStateChanged,} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, doc, updateDoc} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import {getStorage, ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";
import { firebaseConfig } from "./config.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
let uid;


document.addEventListener('DOMContentLoaded', () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      uid = user.uid;
      await renderPost();
    } else {
      window.location.href = 'login.html';
    }
  });
});

// Function to render posts
const renderPost = async () => {
  // Check if uid is null (user not authenticated yet), then return
  if (!uid) {
    console.log("User not authenticated yet");
    return;
  }

  document.getElementById("postRender").innerHTML = "";

  const querySnapshot = await getDocs(collection(db, "posts"));

  // Create a map to cache user data and reduce the number of Firestore reads
  const userCache = new Map();

  for (const docSnapshot of querySnapshot.docs) {
    const post = docSnapshot.data();
    console.log("Post data:", post);
    const postDate = post.postDate.toDate();
    const currentDate = new Date();
    const timeDiff = Math.abs(currentDate - postDate);
    const hoursDiff = Math.round(timeDiff / (1000 * 60 * 60));

    // Fetch user data from Firestore if not already cached
    let userData;
    if (userCache.has(post.userId)) {
      userData = userCache.get(post.userId);
    } else {
      try {
        const userDoc = await getDoc(doc(db, "users", post.userId));
        if (userDoc.exists()) {
          userData = userDoc.data();
          userCache.set(post.userId, userData);
          console.log("Fetched user data:", userData);
        } else {
          console.error("No user data found for userId:", post.userId);
          continue;
        }
      } catch (error) {
        console.error("Error fetching user data for userId:", post.userId, error);
        continue;
      }
    }

    let delElement =
      uid === post.userId
        ? `<button class="deleteBtn" postId=${docSnapshot.id}>Delete</button>
        <button class="updateBtn" onclick="openUpdateModal('${docSnapshot.id}')">Update</button>`
        : "";
    
    let postDiv = document.createElement("div");
    postDiv.className = "postCard";
    postDiv.innerHTML = `
      <div class="post-header">
        <img src="${userData.profilePicUrl}" alt="Profile Picture">
        <h2>${userData.displayName}</h2>
        <p>Posted ${hoursDiff} hours ago</p>
      </div>
      <div class="post-content">
        <img src="${post.postImg}" alt="Post Image">
        <p>${post.postContent}</p>
      </div>
      <div class="post-footer">
        <i class="fa-solid fa-heart"></i>
        <i class="fa-solid fa-comment"></i>
        <i class="fa-solid fa-share"></i>
      </div>
      ${delElement}`;

    document.getElementById("postRender").appendChild(postDiv);
  }

  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const postId = e.target.getAttribute("postId");
      try {
        await deleteDoc(doc(db, "posts", postId));
        renderPost(); // After deleting, re-render the posts
      } catch (error) {
        console.log(error);
      }
    });
  });
};

if (auth.currentUser) {
  uid = auth.currentUser.uid;
  renderPost();
};


// Event listener for adding a new post
document.getElementById("addPost").addEventListener("click",async function (e) {
  e.preventDefault();
  const postContent = document.getElementById("postText").value;
  const postImg = document.getElementById("postImage").files[0];

  // Validation: Check if fields are empty
  if (!postContent || !postImg) {
    alert("Please fill in both fields.");
    return; // Exit if validation fails
  }


  const docRef = collection(db, "posts");
  console.log(postContent, postImg);
  let postImgUrl = '';
  if (postImg){
    try {
      const imgRef = ref(storage, `postImages/${Date.now()}_${postImg.name}`);
      await uploadBytes(imgRef, postImg);
      postImgUrl = await getDownloadURL(imgRef);
    } catch (error) {
      console.error("error uploading the image", error);
      return; //exit if theres an error
    }
  }

  try {
    const newDocRef = await addDoc(docRef, {
      postContent: postContent,
      postImg: postImgUrl,
      userId: uid,
      postDate: new Date(),
    });
      console.log("Document written with Id: ", docRef.id);
      document.getElementById("postText").value = "";
      document.getElementById("postImage").value = "";
      renderPost(); // After adding, re-render the posts
  } catch(error) {
      console.log(error);
    };
});

// Event listener for logging out
document.getElementById("logoutBtn").addEventListener("click", function () {
  signOut(auth)
    .then(() => {
      window.location.href = "login.html";
    })
    .catch((error) => {
      console.log(error);
    });
});







const search = window.location.search;
const params = new URLSearchParams(search);
const id = params.get("id");

if (!id) {
  console.error("No ID found in URL parameters.");
  // Optionally handle the missing ID scenario, like redirecting the user or displaying an error message.
}

// Update post
document.getElementById("updatePostButton").addEventListener("click", function (e) {
  e.preventDefault();
  
  const postContent = document.getElementById("updateContent").value; 
  
  if (!currentPostId) {
    console.error("Cannot update post: ID is null.");
    return; // Exit the function if ID is null
  }
  
  const docRef = doc(db, "posts", currentPostId);
  updateDoc(docRef, {
    postContent: postContent,
    updated_at: new Date()
  })
  .then(() => {
    console.log("Post updated successfully");
    document.getElementById("updateModal").style.display = "none";
    renderPost();
  })
  .catch((error) => {
    console.error("Error updating post", error);
  });
});