const input = document.getElementById("messageInput");
const counter = document.getElementById("counter");
const maxLength = 200;

input.addEventListener("input", () => {
  if (input.value.length > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }

  counter.textContent = `${input.value.length}/${maxLength}`;
});

async function sendMessage() {
  const message = input.value.trim();

  if (message.length === 0) return;

  if (message.length > maxLength) {
    alert("Meddelandet är för långt");
    return;
  }

  await push(ref(db, "messages"), {
    text: message,
    createdAt: Date.now(),
  });

  input.value = "";
  counter.textContent = `0/${maxLength}`;
}
