// Promo popup — show once per visitor
(function initPromo() {
  const overlay  = document.getElementById('promo-overlay');
  const btnClose = document.getElementById('promo-close');
  const btnDismiss = document.getElementById('promo-dismiss');
  const btnOrder = document.getElementById('promo-order');

  const SEEN_KEY = 'gi_promo_seen';

  function closePopup() {
    overlay.style.transition = 'opacity 0.35s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.classList.add('hidden'), 360);
    localStorage.setItem(SEEN_KEY, '1');
  }

  // Only show if not seen before
  if (localStorage.getItem(SEEN_KEY)) {
    overlay.classList.add('hidden');
    return;
  }

  btnClose.addEventListener('click', closePopup);
  btnDismiss.addEventListener('click', closePopup);
  btnOrder.addEventListener('click', closePopup);   // closes popup then scrolls to menu

  // Click outside modal closes it
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePopup();
  });

  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePopup();
  });
})();

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// Hero background subtle zoom on load
document.querySelector('.hero-bg').classList.add('loaded');

// Mobile burger menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('nav-links');
burger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  const open = navLinks.classList.contains('open');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  spans[1].style.opacity = open ? '0' : '1';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  });
});

// Menu tabs
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

// Duplicate strip for seamless ticker
const stripInner = document.querySelector('.strip-inner');
stripInner.innerHTML += stripInner.innerHTML;

// Scroll reveal (IntersectionObserver)
const revealEls = document.querySelectorAll(
  '.featured-card, .menu-item, .contact-card, .about-content, .about-visual, .g-item'
);
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('revealed');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity 0.55s ease ${(i % 4) * 0.08}s, transform 0.55s ease ${(i % 4) * 0.08}s`;
  revealObs.observe(el);
});
document.head.insertAdjacentHTML('beforeend', '<style>.revealed { opacity: 1 !important; transform: none !important; }</style>');

// Reservation form submit
document.getElementById('res-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Reservation Confirmed!';
  btn.style.background = '#2a6e2a';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = 'Confirm Reservation';
    btn.style.background = '';
    btn.style.color = '';
    e.target.reset();
  }, 3500);
});

// Leaflet map — 151 Crwys Rd, Cardiff CF24 4NH
(function initMap() {
  const LAT = 51.4944, LNG = -3.1764;
  const map = L.map('leaflet-map', { scrollWheelZoom: false }).setView([LAT, LNG], 16);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
  }).addTo(map);

  const goldIcon = L.divIcon({
    className: '',
    html: `<div style="
      width:38px;height:38px;
      background:#c9a84c;
      border:3px solid #0d0b07;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 4px 14px rgba(201,168,76,0.5);
    "></div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -40],
  });

  L.marker([LAT, LNG], { icon: goldIcon })
    .addTo(map)
    .bindPopup(`
      <div style="font-family:'Cormorant Garamond',serif;text-align:center;padding:4px 8px">
        <strong style="font-size:1.05rem;color:#0d0b07">Grand Indian</strong><br>
        <span style="font-size:0.82rem;color:#7a6e5a">151 Crwys Rd, Cardiff CF24 4NH</span><br>
        <a href="tel:02920343705" style="font-size:0.8rem;color:#c9a84c;text-decoration:none">029 2034 3705</a>
      </div>
    `, { maxWidth: 200 })
    .openPopup();
})();

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section[id], div[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const highlightNav = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
  });
};
window.addEventListener('scroll', highlightNav, { passive: true });
