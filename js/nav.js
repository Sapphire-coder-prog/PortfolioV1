const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active'); // toggle: adds the class if absent, removes it if present
  navLinks.classList.toggle('active');
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
});

const navLinkItems = document.querySelectorAll('.nav-links a');

navLinkItems.forEach((link) => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});