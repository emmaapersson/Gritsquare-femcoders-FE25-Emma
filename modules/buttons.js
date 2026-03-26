// Dropdown menu btn
const menus = document.querySelectorAll('.mobile-nav');

menus.forEach(nav => {
    const btn = nav.querySelector('.dropdown-btn');
    const menu = nav.querySelector('.dropdown-content');

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) =>{
        e.stopPropagation();
        menu.classList.toggle('active');
    });

    window.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !btn.contains(e.target)) {
            menu.classList.remove('active');
        }
    });
});

// Button for dark-mode
const darkButtons = document.querySelectorAll('.dark-mode');

darkButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
  });
});


// Button delete all messages

