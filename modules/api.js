import { db, msgRef } from "./firebaseconfig.js";
import { get, push, ref } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js";


//funktion som hämtar datan från firebase
export async function getAllMsg() {
        const snapshot = await get(msgRef);
        if (snapshot.exists()) {
            return snapshot.val();
        }
}

//funktion som lägger till data i firebase
export async function addMsg(text) {
    const result = await push(msgRef, {
            text: text,
        });
        return result.key
    }

//funktion som displayar messages med en forEach metod som anropar render functionen
async function displayMsgs() {
    const messages = await getAllMsg();
    
    if (messages) {
        Object.values(messages).forEach((message) => {
            render(message.text);
        });
    }
}

//function som lägger till DOM-element
function render(text) {
    const container = document.querySelector('#messages');

    const p = document.createElement('p');
    p.innerText = text;

    container.appendChild(p);
}

displayMsgs();

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
    render(text);       

    form.reset();
    card.classList.add('hidden');
});