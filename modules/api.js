import { db, msgRef } from "./firebaseconfig.js";
import { push, ref, query, orderByChild, onValue, serverTimestamp, runTransaction, remove } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";
import { censorBadWords } from "./censor.js";
import { searchGifs, displayGifResults, getSelectedGif, clearSelectedGif } from "./gifapi.js";

const notifSound = document.getElementById("notifSound");
const messageContainer = document.querySelector('#messages-display');
const renderedNotes = new Set();

// function som räknar tiden mellan inlägget som gjordes & nutiden
function formatTime(timestamp) {
    if (!timestamp) return "Just now";

    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    if (weeks < 4) return `${weeks}w ago`

    return;
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
                render(message.text, id, message.createdAt, message.likes || 0, message.gifUrl);
            });
        }
        else {
            messageContainer.innerHTML = '<p class="no-messages">Low on good vibes, be the first to send some!</p>'
        }
    });
}

liveUpdate();

//funktion som lägger till data i firebase
export async function addMsg(text, gifUrl) {
    const resultData = {
            text: text,
            createdAt: serverTimestamp(),
            likes: 0,
            gifUrl: gifUrl,
        };

        const result = await push(msgRef, resultData);
        return result.key;
    }

//function som lägger till DOM-element
function render(text, id, createdAt, likes, gifUrl) {
    const noteCard = document.createElement('article');
    noteCard.classList.add('post-it')
    
    const newPost = createdAt && (Date.now() - createdAt) < 5000;
    if (newPost && !renderedNotes.has(id)) {
        noteCard.classList.add('new-post');

       // ljud,notification för när meddelanden dyker upp
        notifSound.currentTime = 0; 
        notifSound.play().catch(() => {});

         void noteCard.offsetWidth;
        renderedNotes.add(id);
  
    }

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#BB271A"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
    deleteBtn.title = 'Delete message';

    deleteBtn.addEventListener('click', async () => {
        const confirmDelete = confirm("Are you sure you want to remove the good vibes? This cannot be undone.");
        
        if (confirmDelete) {
            try {
                const postRef = ref(db, `messages/${id}`);
                await remove(postRef);
            } catch (error) {
                console.error("Error deleting message:", error);
                alert("Could not delete message. Try again later.");
            }
        }
    });
    noteCard.appendChild(deleteBtn);

    const likeBtn = document.createElement('button');
    likeBtn.className = 'like-btn';
    likeBtn.innerHTML = `❤️ <span>${likes}</span>`;

    likeBtn.style.position = 'relative';
    likeBtn.style.overflow = 'visible';
    likeBtn.addEventListener('click', async () => {
        const postRef = ref(db, `messages/${id}/likes`);
        //--------Heart explosion-------
        noteCard.style.overflow="unset"  // effecten ska kunna overflowas
        await   heartExplosion(likeBtn, {
            num: 40,
            sizeMin: 8,
            sizeMax: 18,
            spread: 300,
            duration: 500,
            colors: ["#ff4d6d", "#ff758f", "#ff8fa3"]});
            //----------
            await setTimeout(()=>{
                noteCard.style.overflow="overflow"  // sätt tillbaka overflow:hidden
                runTransaction(postRef, (currentLikes) => {
            return (currentLikes || 0) + 1;
        })


        },500);
        
    }
)

    noteCard.appendChild(likeBtn);

    if (gifUrl) {
        const gifImg = document.createElement('img');
        gifImg.src = gifUrl;
        gifImg.style.maxWidth = '100%';
        gifImg.style.borderRadius = '8px';
        gifImg.style.marginBottom = '10px';
        noteCard.appendChild(gifImg);
    }

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

//öppnar och stänger message formulär + guidelines
const openBtn = document.querySelector('#openCard');
const card = document.querySelector('#card');
const guidelinesCard = document.querySelector('#guidelines');
const closeBtn = document.querySelector('#closeBtn')

let guidelinesManuallyClosed = false; //flagga för om guidelines har stängts av manuellt

openBtn.addEventListener('click', () => {
    const cardWasHidden = card.classList.contains('hidden') //kollar om formuläret är stängt

    card.classList.toggle('hidden');  

    if(cardWasHidden) {
        //om formuläret öppnades vid 'click'-> visa guidelines
        if (!guidelinesManuallyClosed){
            guidelinesCard.classList.remove('hidden');
        }
    } else {
        // om formuläret stängdes vid 'click'-> flagga nollställs och guidelines stängs
        guidelinesManuallyClosed = false;
        guidelinesCard.classList.add('hidden') 
    }
});

// Stäng guidelines kortet manuellt
closeBtn.addEventListener('click', () => {
    guidelinesCard.classList.add('hidden');
    guidelinesManuallyClosed = true;
});


// message card här (Elin)
const form = document.querySelector('#msgForm');
const input = document.querySelector('#messageInput');
const gifSearchInput = document.querySelector('#gifSearchInput');
const searchGifBtn = document.querySelector('#searchGifBtn');
const gifResults = document.querySelector('#gifResults');

searchGifBtn.addEventListener('click', async () => {
    clearSelectedGif();
    const search = gifSearchInput.value.trim();
    const gifs = await searchGifs(search);
    displayGifResults(gifs, '#gifResults')
})

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = input.value.trim();
  const gifUrl = getSelectedGif();
  if (!text) return;

  const censoredText = censorBadWords(text);

  await addMsg(censoredText, gifUrl);

  form.reset();
  card.classList.add("hidden");
  gifSearchInput.value = '';
  gifResults.innerHTML = '';
  clearSelectedGif();
  guidelinesCard.classList.add('hidden') //guidelines stängs
  guidelinesManuallyClosed = false; // flagga nollställs
});



/** Heart explosion */


  function heartExplosion (container, options = {}){
    
        if(!container) return;
        const num = options.num || 35;
        const sizeMin = options.sizeMin || 10;
        const sizeMax = options.sizeMax || 20;
        const spread = options.spread ||300;
        const colors = options.colors || ["#ff4d6d", "#ff758f", "#ff8fa3"];
        const duration = options.duration || 900;

        for(let i=0; i<num; i++){
            const heart = document.createElement('span');
            heart.classList.add('heart');

            const rect = container.getBoundingClientRect();
            heart.style.left = rect.width / 2 + 'px';
            heart.style.top = rect.height / 2 + 'px';

            const size = sizeMin + Math.random() * (sizeMax - sizeMin);
            heart.style.width = size + 'px';
            heart.style.height = size + 'px';

            const x = (Math.random() - 0.5) * spread + 'px';
            const y = (Math.random() - 0.5) * spread + 'px';
            heart.style.setProperty('--x',x);
            heart.style.setProperty('--y', y);

            heart.style.background = colors[Math.floor(Math.random() * colors.length)];

            container.appendChild(heart);

            setTimeout(() =>{
                heart.remove();
            },duration);

        }

       
    }
