document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav-links");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      toggle.setAttribute(
        "aria-expanded",
        nav.classList.contains("active") ? "true" : "false"
      );
    });
  } else {
    console.warn("Menu toggle or nav-links element not found on this page.");
  }
});


// Navbar scroll behavior
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

  if (currentScroll > lastScrollTop) {
    // Scrolling down → stick to top fully
    navbar.classList.add('navbar-fixed');
  } else {
    // Scrolling up → revert to original floating style
    navbar.classList.remove('navbar-fixed');
  }

  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Avoid negative values
});
