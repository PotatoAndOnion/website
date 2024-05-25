import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, doc, getDocs, collection, getDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlG6p7VCEP6Q3XI8J06Whk7ajQChAUUPU",
  authDomain: "a-project-1c132.firebaseapp.com",
  databaseURL: "https://a-project-1c132-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "a-project-1c132",
  storageBucket: "a-project-1c132.appspot.com",
  messagingSenderId: "171458035988",
  appId: "1:171458035988:web:bc81149cd135b5ebcd8201",
  measurementId: "G-17SP4V15VV"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const firestore = getFirestore(app);

// Elements
const userSelect = document.getElementById('user-select');
const startChatButton = document.getElementById('start-chat-button');
const chatContainer = document.getElementById('chat-container');
const messagesDiv = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Event listeners
startChatButton.addEventListener('click', startChat);
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// User and Chat IDs
let currentUserId;
let selectedUserId;
let chatId;

// Function to generate dynamic chat ID
function generateChatId(user1, user2) {
    return user1 < user2 ? `chat_${user1}_${user2}` : `chat_${user2}_${user1}`;
}

// Function to load users for selection
async function loadUsers() {
    const usersSnapshot = await getDocs(collection(firestore, 'users'));
    usersSnapshot.forEach(doc => {
        const user = doc.data();
        if (doc.id !== currentUserId) {
            const option = document.createElement('option');
            option.value = doc.id;
            option.textContent = user.displayName;
            userSelect.appendChild(option);
        }
    });
}

// Function to start chat with selected user
function startChat() {
    selectedUserId = userSelect.value;
    chatId = generateChatId(currentUserId, selectedUserId);
    chatContainer.style.display = 'block';
    listenForMessages();
}

// Send message function
function sendMessage() {
    const text = messageInput.value.trim();
    if (text !== '') {
        const messageRef = push(ref(database, `chats/${chatId}/messages`));
        set(messageRef, {
            sender: currentUserId,
            text: text,
            timestamp: Date.now()
        });
        messageInput.value = '';
    }
}

// Listen for new messages
function listenForMessages() {
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    onChildAdded(messagesRef, async (snapshot) => {
        const message = snapshot.val();
        const senderRef = doc(firestore, 'users', message.sender);
        try {
            const senderSnap = await getDoc(senderRef);
            if (senderSnap.exists()) {
                const sender = senderSnap.data();
                displayMessage(sender.displayName, sender.profilePicUrl, message.text);
            } else {
                console.error('Sender document does not exist:', message.sender);
            }
        } catch (error) {
            console.error('Error getting sender document:', error);
        }
    });
}

// Display message function
function displayMessage(displayName, profilePicUrl, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');

    const img = document.createElement('img');
    img.src = profilePicUrl;
    img.alt = displayName;
    img.classList.add('profile-picture');

    const nameSpan = document.createElement('span');
    nameSpan.textContent = `${displayName}: `;
    nameSpan.classList.add('display-name');

    const textSpan = document.createElement('span');
    textSpan.textContent = text;

    messageDiv.appendChild(img);
    messageDiv.appendChild(nameSpan);
    messageDiv.appendChild(textSpan);

    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Monitor auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUserId = user.uid;
        loadUsers();
    } else {
        console.error('No user is signed in');
    }
});
