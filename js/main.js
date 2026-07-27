/* ================================================================
   FLY BAZAAR — main.js  (FIXED & COMPLETE)
   Fixes applied:
   1. Hero slider — index++ before render was skipping slide 0
   2. Hamburger mobile menu — added (was completely missing)
   3. Mobile dropdown accordion — added
   4. Auto body-padding sync with real header height
   5. Dropdown auto-close on link click (all devices)
================================================================ */

/* ----------------------------------------------------------------
   1. HERO SLIDER — FIXED
   Bug was: index++ ran BEFORE showing slide[0], so slide 0
   was never visible. Now slide 0 shows first, then increments.
---------------------------------------------------------------- */
const slides = document.querySelectorAll(".slide");
let slideIndex = 0;

if (slides.length > 0) {
  // Ensure slide 0 is active immediately on page load
  slides.forEach((s, i) => s.classList.toggle("active", i === 0));

  setInterval(() => {
    slides[slideIndex].classList.remove("active");
    slideIndex = (slideIndex + 1) % slides.length;
    slides[slideIndex].classList.add("active");
  }, 3000);
}

/* ----------------------------------------------------------------
   2. AUTO BODY PADDING
   Only the .header is position:fixed (removed from page flow).
   All other elements — announcement bars, category headings —
   are in NORMAL PAGE FLOW and push content down naturally.
   So body padding-top = header height ONLY.
---------------------------------------------------------------- */
function syncPadding() {
  const header = document.querySelector('.header');
  if (!header) return;
  document.body.style.setProperty(
    'padding-top', header.offsetHeight + 'px', 'important'
  );
}

syncPadding();
document.addEventListener('DOMContentLoaded', syncPadding);
window.addEventListener('load', syncPadding);
setTimeout(syncPadding, 50);
window.addEventListener('resize', syncPadding);

/* ----------------------------------------------------------------
   3. HEADER SCROLL SHADOW
---------------------------------------------------------------- */
window.addEventListener('scroll', () => {
  const h = document.querySelector('.header');
  if (!h) return;
  h.style.boxShadow = window.scrollY > 60
    ? '0 4px 20px rgba(249,115,22,0.2)'
    : '0 2px 10px rgba(0,0,0,0.1)';
});

/* ----------------------------------------------------------------
   4. CLOSE ALL DROPDOWNS
---------------------------------------------------------------- */
function closeAllDropdowns() {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.dropdown-menu').forEach(m => {
    m.style.opacity = '0';
    m.style.visibility = 'hidden';
    setTimeout(() => { m.style.opacity = ''; m.style.visibility = ''; }, 350);
  });
}

/* ----------------------------------------------------------------
   5. HAMBURGER TOGGLE — mobile nav open/close
---------------------------------------------------------------- */
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('.nav');

if (hamburger && nav) {

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = hamburger.classList.toggle('open');
    nav.classList.toggle('open', isOpen);
    if (!isOpen) closeAllDropdowns();
    setTimeout(syncPadding, 20);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header')) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      closeAllDropdowns();
      setTimeout(syncPadding, 20);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      closeAllDropdowns();
      setTimeout(syncPadding, 20);
    }
  });
}

/* ----------------------------------------------------------------
   6. MOBILE DROPDOWN — tap to toggle (accordion)
      Desktop: CSS :hover opens it automatically
---------------------------------------------------------------- */
document.querySelectorAll('.dropdown > a').forEach(trigger => {
  trigger.addEventListener('click', function (e) {
    if (window.innerWidth <= 767) {
      e.preventDefault();
      e.stopPropagation();
      const parent = this.closest('.dropdown');
      const wasOpen = parent.classList.contains('open');
      document.querySelectorAll('.dropdown.open').forEach(d => {
        if (d !== parent) d.classList.remove('open');
      });
      parent.classList.toggle('open', !wasOpen);
      setTimeout(syncPadding, 20);
    }
  });
});

/* ----------------------------------------------------------------
   7. DROPDOWN AUTO-CLOSE on any nav link click (all devices)
      Bug fixed: this previously selected '.nav-links > li > a',
      which ALSO matched the dropdown TRIGGER link itself (e.g.
      "Categories"). That caused a race condition on mobile —
      tapping "Categories" would open the dropdown (section 6)
      AND immediately close it again (this handler), so it never
      visibly opened. Now we only attach auto-close to actual
      dropdown menu links and top-level links that are NOT
      dropdown triggers.
---------------------------------------------------------------- */
document.querySelectorAll('.dropdown-menu a').forEach(link => {
  link.addEventListener('click', () => {
    closeAllDropdowns();
    if (hamburger && nav) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      setTimeout(syncPadding, 20);
    }
  });
});

document.querySelectorAll('.nav-links > li > a').forEach(link => {
  // Skip dropdown trigger links — they're handled separately in section 6
  if (link.closest('.dropdown') && link.nextElementSibling?.classList.contains('dropdown-menu')) {
    return;
  }
  link.addEventListener('click', () => {
    closeAllDropdowns();
    if (hamburger && nav) {
      hamburger.classList.remove('open');
      nav.classList.remove('open');
      setTimeout(syncPadding, 20);
    }
  });
});

/* ----------------------------------------------------------------
   8. SMOOTH SCROLL for anchor links
---------------------------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerH = document.querySelector('.header')?.offsetHeight || 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - headerH - 10,
        behavior: 'smooth'
      });
    }
  });
});

/* ----------------------------------------------------------------
   9. WISHLIST HEART TOGGLE
        32+ wishlist icons exist on product cards but had zero JS
        attached — clicking them did absolutely nothing.
---------------------------------------------------------------- */
document.querySelectorAll('.wishlist').forEach(icon => {
  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    const heartIcon = icon.querySelector('i');
    const isActive = icon.classList.toggle('active');
    if (heartIcon) {
      heartIcon.classList.toggle('fa-solid', isActive);
      heartIcon.classList.toggle('fa-regular', !isActive);
    }
    icon.style.background = isActive ? '#f97316' : '';
  });
});

/* ----------------------------------------------------------------
   10. CONTACT FORM — validation + success message
        Form had no submit handler, so "Send Message" just
        reloaded the page with zero feedback to the user.
---------------------------------------------------------------- */
const contactForm = document.querySelector('#contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.querySelector('#contactName');
    const email = document.querySelector('#contactEmail');
    const message = document.querySelector('#contactMessage');
    const success = document.querySelector('#contactSuccess');

    if (!name || !email || !message) return;
    if (!name.value.trim() || !email.value.trim() || !message.value.trim()) return;

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    if (!emailOk) {
      email.style.border = '2px solid #ff4d4d';
      setTimeout(() => { email.style.border = ''; }, 2000);
      return;
    }

    if (success) success.style.display = 'block';
    contactForm.reset();
    setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
  });
}

/* ----------------------------------------------------------------
   11. ACTIVE PAGE NAV HIGHLIGHT
---------------------------------------------------------------- */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links > li > a').forEach(link => {
  const href = link.getAttribute('href') || '';
  if (href && href.includes(currentPage) && !link.closest('.dropdown')) {
    link.style.color = '#f97316';
    link.style.borderBottom = '2px solid #f97316';
    link.style.paddingBottom = '3px';
  }
});
