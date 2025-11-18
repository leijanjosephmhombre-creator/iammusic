/* main.js
   Responsible for:
   - Mobile navigation toggle
   - Homepage slider with autoplay and controls (complex feature)
   - Modal handling (quick view / gallery lightbox)
   - Contact form validation and feedback
   - Dynamic loading of products (demonstrates DOM manipulation)
   - Scroll reveal effect
*/

/* ---------- Utilities ---------- */
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

/* ---------- Document ready ---------- */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initSlider();
  initModal();
  initForms();
  initDynamicProducts();
  initScrollReveal();
  setYear();
});

/* ---------- Header / mobile nav toggle ---------- */
function initHeader(){
  const toggles = qsa('.nav-toggle');
  toggles.forEach(btn => {
    const nav = btn.nextElementSibling;
    btn.addEventListener('click', () => {
      // nav may be the .site-nav element
      if(nav){
        nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', nav.classList.contains('open'));
      }
    });
  });

  // close nav when clicking outside (mobile)
  document.addEventListener('click', (e) => {
    const navs = qsa('.site-nav');
    navs.forEach(n => {
      const isOpen = n.classList.contains('open');
      if(isOpen && !n.contains(e.target) && !n.previousElementSibling?.matches('.nav-toggle')) {
        n.classList.remove('open');
      }
    });
  });
}

/* ---------- Slider (home) ---------- */
function initSlider(){
  const slider = qs('#homeSlider');
  if(!slider) return;

  const slides = qsa('.slide', slider);
  let current = 0;
  let interval = null;
  const delay = 3500;

  function goTo(index){
    slides.forEach(s => s.classList.remove('active'));
    const i = (index + slides.length) % slides.length;
    slides[i].classList.add('active');
    current = i;
  }

  function next(){ goTo(current + 1); }
  function prev(){ goTo(current - 1); }

  // Controls
  const btnPrev = qs('[data-action="prev"]', slider);
  const btnNext = qs('[data-action="next"]', slider);
  if(btnPrev) btnPrev.addEventListener('click', () => { prev(); reset(); });
  if(btnNext) btnNext.addEventListener('click', () => { next(); reset(); });

  // Autoplay
  function start(){ interval = setInterval(next, delay); }
  function stop(){ clearInterval(interval); interval = null; }
  function reset(){ stop(); start(); }

  // Pause on hover
  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);

  // Initialize
  goTo(0);
  start();
}

/* ---------- Modal (shared) ---------- */
function initModal(){
  const modal = qs('#modal') || qs('#modal2') || qs('#modal3') || qs('#modalGallery');
  if(!modal) return;

  const modalBody = qs('.modal-body', modal);
  const closeBtn = qs('.modal-close', modal);
  const closeAll = () => {
    modal.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
  };

  // open buttons (delegated)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action="openModal"]') || e.target.closest('.gallery-item');
    if(!btn) return;
    e.preventDefault();
    const src = btn.dataset.src || btn.getAttribute('data-src') || btn.getAttribute('href');
    if(!src) return;
    // show loader then image
    modal.setAttribute('aria-hidden', 'false');

    modalBody.innerHTML = '<p class="small">Loading…</p>';
    const img = new Image();
    img.onload = () => {
      modalBody.innerHTML = '';
      img.style.maxWidth = '100%';
      img.style.height = 'auto';
      modalBody.appendChild(img);
    };
    img.src = src;
  });

  // close events
  if(closeBtn) closeBtn.addEventListener('click', closeAll);
  modal.addEventListener('click', (e) => {
    if(e.target === modal) closeAll();
  });
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeAll();
  });
}

/* ---------- Contact form validation ---------- */
function initForms(){
  const form = qs('#contactForm');
  if(!form) return;

  const feedback = qs('#formFeedback', form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.trim();
    const email = data.get('email')?.trim();
    const reason = data.get('reason')?.trim();
    const message = data.get('message')?.trim();

    let errors = [];

    if(!name || name.length < 2) errors.push('Please enter your full name (2+ characters).');
    if(!email || !validateEmail(email)) errors.push('Please provide a valid email address.');
    if(!reason) errors.push('Please select a reason.');
    if(!message || message.length < 10) errors.push('Message must be at least 10 characters.');

    if(errors.length){
      feedback.textContent = errors.join(' ');
      feedback.style.color = 'crimson';
      return;
    }

    // Simulate successful submission (no backend). Show success message.
    feedback.style.color = '';
    feedback.textContent = 'Thanks! Your message has been sent (demo).';
    form.reset();
  });

  function validateEmail(email){
    // simple email regex (sufficient for demo)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

/* ---------- Dynamic product loading (DOM manipulation) ---------- */
function initDynamicProducts(){
  const container = qs('#allProducts') || qs('#productGrid');
  if(!container) return;

  // sample dataset (placeholder)
  const products = [
    {id:101, title:'Essential Tee', price:'₱799', img:'https://iammusicmerch.com/cdn/shop/  files/17002004043566815703_2048.png?v=1726266331&width=1445https://via.placeholder.com/400x350?text=Product+101'},
    {id:102, title:'Minimal Jacket', price:'₱2,499', img:'https://justinreed.com/cdn/shop/files/1_87d9b1c8-cb91-422c-9ebf-817f70bac3e4.jpg?v=1728319520&width=1445ttps://via.placeholder.com/400x350?text=Product+102'},
    {id:103, title:'Everyday Pants', price:'₱1,299', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmX2fgxy0EI19d7Vc50ni0B6xu0ifXN5gSZQ&s'},
    {id:104, title:'Summer Dress', price:'₱1,899', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQukRIsRr2-cJ8S50OvkumKrCdThXBPd2npeQ&shttps://via.placeholder.com/400x350?text=Product+104'},
    {id:105, title:'Light Hoodie', price:'₱999', img:'https://images.stockx.com/images/Playboi-Carti-Face-Hoodie-White.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1632524889'},
    {id:106, title:'Relaxed Shorts', price:'₱599', img:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH399Oj4tHuF634gNA_xN06zAvXK6X9cQf1g&s'}
  ];

  // initially show first 3 if on products page; otherwise productGrid already has 3.
  if(container.id === 'allProducts'){
    renderProducts(products.slice(0,3));
  }

  const loadBtn = qs('#loadMore');
  if(loadBtn){
    let offset = 3;
    loadBtn.addEventListener('click', () => {
      const next = products.slice(offset, offset + 3);
      renderProducts(next);
      offset += next.length;
      if(offset >= products.length) loadBtn.textContent = 'No more products';
    });
  }

  function renderProducts(list){
    list.forEach(p => {
      const el = document.createElement('article');
      el.className = 'product-card reveal';
      el.innerHTML = `
        <img src="${p.img}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p class="price">${p.price}</p>
        <button class="btn btn-outline btn-view" data-action="openModal" data-src="${p.img.replace('400x350','800x700')}">Quick view</button>
      `;
      container.appendChild(el);
      // small stagger reveal
      setTimeout(()=> el.classList.add('visible'), 60);
    });
  }
}

/* ---------- Scroll reveal effect ---------- */
function initScrollReveal(){
  const reveals = qsa('.reveal');
  if(!reveals.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(ent => {
      if(ent.isIntersecting){
        ent.target.classList.add('visible');
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => observer.observe(r));
}

/* ---------- Utility: set year in footer ---------- */
function setYear(){
  const y = new Date().getFullYear();
  qsa('#year, #yearAbout, #yearProducts, #yearGallery, #yearContact').forEach(el => {
    if(el) el.textContent = y;
  });
}

/* ---------- End of main.js ---------- */