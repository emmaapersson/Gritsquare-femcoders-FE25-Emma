// Dropdown menu btn
const menuBtn = document.querySelector('.dropdown-btn')
const menu = document.querySelector('.dropdown-content')

menuBtn.addEventListener('click', (event) => {
    event.stopPropagation(); 
    menu.classList.toggle('active');
});

window.addEventListener('click', (event) => {
    if (menu.classList.contains('active') && !menu.contains(event.target)) {
        menu.classList.remove('active');
    }
});



menuBtn.addEventListener('click', (event) => {
    event.stopPropagation(); 
    menu.classList.toggle('active');
});

window.addEventListener('click', (event) => {
    if (menu.classList.contains('active') && !menu.contains(event.target)) {
        menu.classList.remove('active');
    }
});


const darkMode = document.querySelector('#darkBtn');
darkMode.addEventListener('click', ()=>{
   document.body.classList.toggle('dark');
  
});



const darkModeMobile = document.querySelector('#darkModeMobile');
darkModeMobile.addEventListener('click', ()=>{
  document.body.classList.toggle('dark');
  
});


// Button delete all messages

