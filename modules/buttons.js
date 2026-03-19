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