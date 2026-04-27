// ===== PRODUCT DATA =====
const products = [
  { id:1, name:'Château Margaux Grand Cru', country:'ฝรั่งเศส', vintage:'2019', type:'red', price:4800, oldPrice:5500, rating:4.9, reviews:128, badge:'แนะนำ', badgeType:'gold', img:'images/wine_red.png' },
  { id:2, name:'Cloudy Bay Sauvignon Blanc', country:'นิวซีแลนด์', vintage:'2022', type:'white', price:1890, oldPrice:null, rating:4.7, reviews:94, badge:'ใหม่', badgeType:'', img:'images/wine_white.png' },
  { id:3, name:'Whispering Angel Rosé', country:'โพรวองซ์, ฝรั่งเศส', vintage:'2022', type:'rose', price:2200, oldPrice:2600, rating:4.8, reviews:76, badge:'ลด 15%', badgeType:'', img:'images/wine_rose.png' },
  { id:4, name:'Moët & Chandon Impérial', country:'แชมเปญ, ฝรั่งเศส', vintage:'NV', type:'sparkling', price:3400, oldPrice:null, rating:4.9, reviews:210, badge:'ขายดี', badgeType:'gold', img:'images/wine_sparkling.png' },
  { id:5, name:'Penfolds Grange Shiraz', country:'ออสเตรเลีย', vintage:'2018', type:'red', price:18500, oldPrice:null, rating:5.0, reviews:43, badge:'พรีเมียม', badgeType:'gold', img:'images/wine_red.png' },
  { id:6, name:'Santa Margherita Pinot Grigio', country:'อิตาลี', vintage:'2021', type:'white', price:1250, oldPrice:1450, rating:4.5, reviews:182, badge:'ลด 14%', badgeType:'', img:'images/wine_white.png' },
  { id:7, name:'Miraval Rosé by Brad Pitt', country:'โพรวองซ์, ฝรั่งเศส', vintage:'2021', type:'rose', price:1800, oldPrice:null, rating:4.6, reviews:67, badge:null, badgeType:'', img:'images/wine_rose.png' },
  { id:8, name:'Veuve Clicquot Yellow Label', country:'แชมเปญ, ฝรั่งเศส', vintage:'NV', type:'sparkling', price:2900, oldPrice:3200, rating:4.8, reviews:156, badge:'ลด 9%', badgeType:'', img:'images/wine_sparkling.png' },
];

// ===== STATE =====
let cart = [];
let currentFilter = 'all';

// ===== RENDER PRODUCTS =====
function renderProducts(filter) {
  const grid = document.getElementById('productGrid');
  const filtered = filter === 'all' ? products : products.filter(p => p.type === filter);
  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-id="${p.id}">
      ${p.badge ? `<span class="product-badge ${p.badgeType}">${p.badge}</span>` : ''}
      <div class="product-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy"/>
        <button class="product-wishlist" data-id="${p.id}" aria-label="ถูกใจ">♡</button>
      </div>
      <div class="product-info">
        <p class="product-country">${p.country}</p>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-vintage">ปีวินเทจ: ${p.vintage}</p>
        <div class="product-rating">
          <span class="stars-sm">${'★'.repeat(Math.floor(p.rating))}${p.rating % 1 ? '☆' : ''}</span>
          <span class="rating-num">${p.rating} (${p.reviews})</span>
        </div>
        <div class="product-footer">
          <div>
            <div class="product-price">฿${p.price.toLocaleString()}</div>
            ${p.oldPrice ? `<div class="product-old-price">฿${p.oldPrice.toLocaleString()}</div>` : ''}
          </div>
          <button class="add-to-cart" data-id="${p.id}">+ ตะกร้า</button>
        </div>
      </div>
    </div>
  `).join('');

  // Wishlist toggle
  grid.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    });
  });

  // Add to cart
  grid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
  });
}

// ===== CART FUNCTIONS =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  updateCartUI();
  showToast(`เพิ่ม "${product.name}" ลงตะกร้าแล้ว 🍷`);
}

function updateCartUI() {
  const badge = document.getElementById('cartBadge');
  const total = cart.reduce((s, c) => s + c.qty, 0);
  badge.textContent = total;
  badge.style.display = total > 0 ? 'flex' : 'none';

  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');

  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty"><span>🛒</span><p>ยังไม่มีสินค้าในตะกร้า</p></div>';
    footerEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.img}" alt="${item.name}"/>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">฿${(item.price * item.qty).toLocaleString()}</div>
          <div class="cart-item-controls">
            <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `).join('');
    footerEl.style.display = 'block';
    const sum = cart.reduce((s, c) => s + c.price * c.qty, 0);
    totalEl.textContent = '฿' + sum.toLocaleString();

    itemsEl.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        const item = cart.find(c => c.id === id);
        if (action === 'inc') item.qty++;
        else if (action === 'dec') {
          item.qty--;
          if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
        }
        updateCartUI();
      });
    });
  }
}

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ===== FILTER TABS =====
document.querySelectorAll('.filter-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    currentFilter = tab.dataset.filter;
    renderProducts(currentFilter);
  });
});

// Category card click
document.querySelectorAll('.category-card, .dropdown-item').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const filter = el.dataset.filter;
    if (!filter) return;
    document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      document.querySelectorAll('.filter-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.filter === filter);
      });
      renderProducts(filter);
    }, 400);
  });
});

// ===== CART SIDEBAR =====
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartCloseBtn = document.getElementById('cartCloseBtn');

function openCart() { cartSidebar.classList.add('active'); cartOverlay.classList.add('active'); }
function closeCart() { cartSidebar.classList.remove('active'); cartOverlay.classList.remove('active'); }

cartBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ===== SEARCH =====
const searchBtn = document.getElementById('searchBtn');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const searchInput = document.getElementById('searchInput');

searchBtn.addEventListener('click', () => {
  searchOverlay.classList.toggle('active');
  if (searchOverlay.classList.contains('active')) searchInput.focus();
});
searchClose.addEventListener('click', () => searchOverlay.classList.remove('active'));

// ===== MOBILE MENU =====
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
mobileMenuBtn.addEventListener('click', () => mainNav.classList.toggle('open'));

// ===== SCROLL HEADER =====
window.addEventListener('scroll', () => {
  document.getElementById('header').classList.toggle('scrolled', window.scrollY > 50);
});

// ===== NEWSLETTER =====
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  showToast('✅ สมัครรับข่าวสารสำเร็จ! รับส่วนลด 15% ได้เลย');
  e.target.reset();
});

// ===== INIT =====
renderProducts('all');
updateCartUI();
