const button = document.getElementById("spawnBtn");

button.addEventListener("click", () => {
  for (let i = 0; i < 10; i++) {
    createBubble();
  }
});

function createBubble() {
  const bubble = document.createElement("div");
  bubble.className = "bubble";

  
  bubble.style.left = Math.random() * window.innerWidth + "px";

  
  const size = Math.random() * 40 + 20;
  bubble.style.width = size + "px";
  bubble.style.height = size + "px";

  
  bubble.addEventListener("click", (e) => {
    bubble.classList.add("pop");

    
    const ripple = document.createElement("div");
    ripple.className = "ripple";

    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";

    document.body.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);

   
    setTimeout(() => {
      bubble.remove();
    }, 300);
  });

  document.body.appendChild(bubble);

  
  setTimeout(() => {
    bubble.remove();
  }, 4000);
}