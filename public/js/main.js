// public/js/main.js
// Vanilla JS untuk toggle menu hamburger di mobile (Tailwind: hidden <-> flex)

document.addEventListener("DOMContentLoaded", function () {
  const hamburgerBtn = document.getElementById("hamburgerBtn");
  const navMenu = document.getElementById("navMenu");

  if (!hamburgerBtn || !navMenu) return;

  function openMenu() {
    navMenu.classList.remove("hidden");
    navMenu.classList.add("flex");
    hamburgerBtn.classList.add("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "true");
    hamburgerBtn.setAttribute("aria-label", "Tutup menu navigasi");
  }

  function closeMenu() {
    navMenu.classList.add("hidden");
    navMenu.classList.remove("flex");
    hamburgerBtn.classList.remove("is-open");
    hamburgerBtn.setAttribute("aria-expanded", "false");
    hamburgerBtn.setAttribute("aria-label", "Buka menu navigasi");
  }

  hamburgerBtn.addEventListener("click", function () {
    const isOpen = navMenu.classList.contains("flex");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Tutup menu ketika salah satu link nav diklik (khusus mobile)
  navMenu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      closeMenu();
    });
  });

  // Tutup menu jika layar di-resize ke ukuran desktop (breakpoint md = 768px)
  window.addEventListener("resize", function () {
    if (window.innerWidth >= 768 && navMenu.classList.contains("flex")) {
      closeMenu();
    }
  });
});
