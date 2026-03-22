import { db, msgRef } from "./firebaseconfig.js";
import { get, push, ref, query, orderByChild, onValue, serverTimestamp, runTransaction } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";

const messageContainer = document.querySelector('#messages-display');
const renderedNotes = new Set();

// function som räknar tiden mellan inlägget som gjordes & nutiden
function formatTime(timestamp) {
    if (!timestamp) return "Just now";

    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    return "Earlier";
}

//funktion som hämtar datan från firebase live
 export function liveUpdate() {
    const sortedMessages = query(msgRef, orderByChild('createdAt'));

    onValue(sortedMessages, (snapshot) => {
        messageContainer.innerHTML = ''

        const messages = snapshot.val();
        if (messages) {
            const messageList = Object.entries(messages);
            messageList.reverse().forEach((entry) => {
                const id = entry[0];
                const message = entry[1]
                render(message.text, id, message.createdAt, message.likes || 0);
            });
        }
        else {
            messageContainer.innerHTML = '<p class="no-messages">Low on good vibes, be the first to send some!</p>'
        }
    });
}

liveUpdate();

//funktion som lägger till data i firebase
export async function addMsg(text) {
    const result = await push(msgRef, {
            text: text,
            createdAt: serverTimestamp(),
            likes: 0
        });
        return result.key
    }

//function som lägger till DOM-element
function render(text, id, createdAt, likes) {
    const noteCard = document.createElement('article');
    noteCard.classList.add('post-it')
    
    const newPost = createdAt && (Date.now() - createdAt) < 5000;
    if (newPost && !renderedNotes.has(id)) {
        noteCard.classList.add('new-post');

        void noteCard.offsetWidth;
        renderedNotes.add(id);
    }

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.innerHTML = `❤️ <span>${likes}</span>`;

    likeBtn.addEventListener('click', () => {
        const postRef = ref(db, `messages/${id}/likes`);

        runTransaction(postRef, (currentLikes) => {
            return (currentLikes || 0) + 1;
        })
    })
    noteCard.appendChild(likeBtn);

    const p = document.createElement('p');
    p.innerText = text;

    if (createdAt) {
        const timeLabel = document.createElement('span');
        timeLabel.classList.add('time-stamp');
        timeLabel.innerText = formatTime(createdAt);
        noteCard.appendChild(timeLabel);
    }

    noteCard.appendChild(p);
    messageContainer.appendChild(noteCard);
}

//öppnar och stänger card
const openBtn = document.querySelector('#openCard');
const card = document.querySelector('#card');

openBtn.addEventListener('click', () => {
    card.classList.toggle('hidden');  
});


// message card här (Elin)
const form = document.querySelector('#msgForm');
const input = document.querySelector('#messageInput');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const text = input.value;

    if (!text) return;

    await addMsg(text);       

    form.reset();
    card.classList.add('hidden');
});