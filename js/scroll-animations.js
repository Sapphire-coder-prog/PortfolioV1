//This file contains the scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
    if (entry.isIntersecting) {
         entry.target.classList.add('is-visible');
         observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.15,
});

const animatedElements = document.querySelectorAll('.fade-in, .fade-in-stagger');

animatedElements.forEach((el) => {
  observer.observe(el);
});