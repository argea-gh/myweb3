/* Enhanced app.js for Herbaprima */
/* Config */
const CONFIG = { brand:"Herbaprima", whatsapp:"6282241900467", logo:"https://lh3.googleusercontent.com/d/1xp5ce29F3f-nVa_IEx925L-8YrXXbHo6" };

/* Default products (same as before) */
const DEFAULT_PRODUCTS = [
  {id:1,name:"Madu Pahit",category:"Madu Premium",price:120000,image:"https://hni.net/public/front/img/produk/MADU%20PAHIT-1_04-01-19_.png"},
  {id:2,name:"Centella Teh Sinergi",category:"Minuman Sehat",price:70000,image:"https://hni.net/public/front/img/produk/CENTELLA-1_04-01-19_.png"},
  {id:3,name:"Deep Olive",category:"Minyak Herba",price:145000,image:"https://hni.net/public/front/img/produk/deep-olive-0625_16-06-25_.png"},
  {id:4,name:"Etta Goat Milk",category:"Minuman Sehat",price:75000,image:"https://hni.net/public/front/img/produk/egm-topbrand_14-11-24_.png"},
  {id:5,name:"Madu Multiflora",category:"Madu Premium",price:100000,image:"https://hni.net/public/front/img/produk/MADU%20MULTI%202020_18-05-20_.png"},
  {id:6,name:"Madu Habbat",category:"Madu Premium",price:130000,image:"https://hni.net/public/front/img/produk/MADU%20HABBATS%202020_18-05-20_.png"},
  {id:7,name:"Hni Coffee",category:"Minuman Sehat",price:125000,image:"https://hni.net/public/front/img/produk/hcmockup2021_27-12-21_.png"},
  {id:8,name:"Hania Susu Kambing Full Cream",category:"Minuman Sehat",price:75000,image:"https://hni.net/public/front/img/produk/hania-fc-full_01-03-23_.png"},
  {id:9,name:"Sevel Stamina",category:"Minuman Sehat",price:115000,image:"https://hni.net/public/front/img/produk/sevel-stamina_11-09-25_.png"},
  {id:10,name:"Hania Realco Cappuccino Less Sugar",category:"Minuman Sehat",price:50000,image:"https://hni.net/public/front/img/produk/cappucino-lessugar1_14-11-24_.png"},
  {id:11,name:"Madu HNI Health",category:"Madu Premium",price:80000,image:"https://hni.net/public/front/img/produk/hni-health-3_18-11-24_.png"},
  {id:12,name:"Hania Gluta Juicy Drink",category:"Minuman Sehat",price:185000,image:"https://hni.net/public/front/img/produk/gluta2_27-10-22_.png"},
  {id:13,name:"Mahkota Dara",category:"Aneka Herbal",price:200000,image:"https://hni.net/public/front/img/produk/mahkota%20dara-l_16-06-25_.png"},
  {id:14,name:"Habbatusauda Kapsul",category:"Aneka Herbal",price:60000,image:"https://hni.net/public/front/img/produk/2023-habbats_21-02-24_.png"},
  {id:15,name:"Minyak Herba Sinergi Hot",category:"Minyak Herba",price:55000,image:"https://hni.net/public/front/img/produk/mhs-hot_16-12-24_.png"},
  {id:16,name:"Zareen Bright Glow Serum",category:"Perawatan Kulit",price:70000,image:"https://hni.net/public/front/img/produk/zareen-serum_22-12-22_.png"},
  {id:17,name:"Sabun Kolagen",category:"Perawatan Kulit",price:25000,image:"https://hni.net/public/front/img/produk/SABUN%20KOLAGEN-4_07-01-19_.png"},
  {id:18,name:"Hibis Pantyliner",category:"Perawatan Pribadi",price:225000,image:"https://hni.net/public/front/img/produk/HIBIS%20PANTY-5_26-03-19_.png"}
];

/* Local admin products stored under localProducts (as before) */
function getLocalProducts(){ return JSON.parse(localStorage.getItem("localProducts") || "[]"); }
function getMergedProducts(){ const def = DEFAULT_PRODUCTS; const loc = getLocalProducts().map((p,i)=>({id:1000+i,...p})); return [...def,...loc]; }
let PRODUCTS = getMergedProducts();

/* Utilities */
function rupiah(v){ return 'Rp ' + Number(v).toLocaleString('id-ID'); }
function $q(s){ return document.querySelector(s); }
function $qa(s){ return Array.from(document.querySelectorAll(s)); }

/* RENDERING */
function renderGrid(selector, items){
  const container = document.querySelector(selector);
  if(!container) return;
  container.innerHTML = '';
  items.forEach(p=>{
    const el = document.createElement('div');
    el.className = 'product-card fade-in';
    el.innerHTML = `
      <div class="img-wrap"><img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'"></div>
      <div class="p-body">
        <div>
          <div class="p-title">${p.name}</div>
          <div class="p-price">${rupiah(p.price)} ${p.is_best ? '<span class="badge">Terlaris</span>' : ''}</div>
        </div>
        <div class="actions">
          <button class="btn outline" onclick="openDetail(${p.id})">Detail Produk</button>
          <button class="btn green" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
        </div>
      </div>
    `;
    container.appendChild(el);
    setTimeout(()=>el.classList.add('visible'),50);
  });
}

/* Home render */
function renderHome(){
  PRODUCTS = getMergedProducts();
  renderGrid('#homeProducts', PRODUCTS.slice(0,12));
  renderGrid('#bestsellerGrid', PRODUCTS.slice(0,6));
  renderCategories();
}

/* Categories */
const CATEGORIES = ["Minuman Sehat","Madu Premium","Minyak Herba","Aneka Herbal","Perawatan Kulit","Perawatan Pribadi"];
function renderCategories(){
  const el = $q('#categoryGrid');
  if(!el) return;
  el.innerHTML = '';
  CATEGORIES.forEach(c=>{
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.innerHTML = `<div class="cat-icon">🌿</div><div>${c}</div>`;
    card.onclick = ()=> location.href = `produk/${c.toLowerCase().replace(/\s+/g,'_')}/index.html`;
    el.appendChild(card);
  });
}

/* Category page render */
function renderCategory(category){
  PRODUCTS = getMergedProducts();
  const items = PRODUCTS.filter(p=>p.category === category);
  renderGrid('#categoryGrid', items);
  const title = document.getElementById('categoryTitle');
  if(title) title.textContent = category;
}

/* Detail render */
function renderDetailFromQuery(){
  PRODUCTS = getMergedProducts();
  const params = new URLSearchParams(location.search);
  const id = Number(params.get('id'));
  if(!id) return;
  openDetail(id, true);
}

/* Modal detail */
function openDetail(id, openInPage=false){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const modal = document.getElementById('productModal');
  const content = `
    <button class="close-x" onclick="closeModal()">✕</button>
    <div class="detail-grid">
      <div><img src="${p.image}" style="width:100%;border-radius:8px" onerror="this.style.display='none'"></div>
      <div>
        <h2>${p.name}</h2>
        <div class="p-price">${rupiah(p.price)} ${p.is_best ? '<span class="badge">Terlaris</span>' : ''}</div>
        <p class="muted">Kategori: ${p.category}</p>
        <h4>Deskripsi</h4><p>Produk herbal berkualitas. Silakan hubungi kami untuk informasi lebih lengkap.</p>
        <h4>Manfaat</h4><p>Menjaga kesehatan, meningkatkan stamina, dan mendukung gaya hidup sehat.</p>
        <h4>Komposisi</h4><p>Terbuat dari bahan alami pilihan.</p>
        <div style="margin-top:12px;display:flex;gap:8px">
          <button class="btn green" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
          <button class="btn outline" onclick="buyNowWhatsApp(${p.id})">Beli via WhatsApp</button>
        </div>
      </div>
    </div>
  `;
  if(modal){
    modal.querySelector('.box').innerHTML = content;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  } else if(openInPage){
    const area = document.getElementById('detailContent');
    if(area){ area.innerHTML = content; window.scrollTo({top:0,behavior:'smooth'}); return; }
  } else {
    location.href = `/produk/detail/index.html?id=${p.id}`;
  }
}
function closeModal(){ const modal = document.getElementById('productModal'); if(modal){ modal.style.display='none'; document.body.style.overflow=''; } }

/* Hero slider (basic) */
let slideIndex = 0;
function initHero(){
  const slides = document.querySelectorAll('.slide');
  if(!slides.length) return;
  function show(n){ slides.forEach(s=>s.classList.remove('active')); slides[n].classList.add('active'); }
  show(slideIndex);
  setInterval(()=>{ slideIndex = (slideIndex+1)%slides.length; show(slideIndex); },4500);
}

/* Utilities */
function slug(s){ return s.toLowerCase().replace(/\s+/g,'_').replace(/[^\w\-]+/g,''); }

/* CART functionality */
const CART_KEY = 'herbaprima_cart_v1';
function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(c){ localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartUI(); }
function updateCartUI(){
  const cart = getCart();
  const count = cart.reduce((s,i)=>s+i.qty,0);
  $qa('.cart-count').forEach(el=>el.textContent = count);
  const list = $q('#cartList');
  if(list){
    if(cart.length===0){ list.innerHTML = '<div class="muted">Keranjang kosong</div>'; $q('#cartTotal') && ($q('#cartTotal').textContent=''); return; }
    list.innerHTML = cart.map(item=>{
      const p = PRODUCTS.find(x=>x.id===item.id) || {name:item.name, image:item.image, price:item.price};
      return `<div class="cart-item">
        <img src="${p.image}" style="width:56px;height:56px;object-fit:contain;border-radius:8px">
        <div style="flex:1">
          <div style="font-weight:700">${p.name}</div>
          <div class="muted">${rupiah(p.price)}</div>
          <div style="margin-top:6px;display:flex;gap:8px;align-items:center">
            <button class="btn-sm" onclick="changeQty(${item.id}, -1)">-</button>
            <div style="min-width:28px;text-align:center">${item.qty}</div>
            <button class="btn-sm" onclick="changeQty(${item.id}, 1)">+</button>
            <button class="btn-sm outline" style="margin-left:8px" onclick="removeFromCart(${item.id})">Hapus</button>
          </div>
        </div>
      </div>`;
    }).join('');
    const total = cart.reduce((s,i)=> s + ((PRODUCTS.find(x=>x.id===i.id)||{price:i.price}).price * i.qty),0);
    $q('#cartTotal').textContent = rupiah(total);
  }
}

function addToCart(id){
  PRODUCTS = getMergedProducts();
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return alert('Produk tidak ditemukan');
  const cart = getCart();
  const found = cart.find(i=>i.id===id);
  if(found) found.qty++;
  else cart.push({id:id, qty:1});
  saveCart(cart);
  toast('Produk ditambahkan ke keranjang');
}

function changeQty(id, delta){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0){
    if(confirm('Hapus item dari keranjang?')){ const idx = cart.findIndex(i=>i.id===id); cart.splice(idx,1); }
    else { item.qty = 1; }
  }
  saveCart(cart);
}

function removeFromCart(id){
  if(!confirm('Hapus item?')) return;
  const cart = getCart();
  const idx = cart.findIndex(i=>i.id===id);
  if(idx>=0) cart.splice(idx,1);
  saveCart(cart);
}

function clearCart(){
  if(!confirm('Kosongkan keranjang?')) return;
  localStorage.removeItem(CART_KEY);
  updateCartUI();
}

/* Checkout via WhatsApp */
function checkoutWhatsApp(){
  const cart = getCart();
  if(cart.length === 0){ alert('Keranjang kosong'); return; }
  let msg = `Halo ${CONFIG.brand}, saya ingin memesan:%0A%0A`;
  cart.forEach(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id) || {};
    msg += `- ${p.name || i.name} Qty: ${i.qty}%0A`;
  });
  const total = cart.reduce((s,i)=> s + ((PRODUCTS.find(x=>x.id===i.id)||{price:i.price}).price * i.qty),0);
  msg += `%0ATotal: ${rupiah(total)}%0A%0ANama:%0AAlamat:%0ANo HP:`;
  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`);
}

/* Toast */
function toast(txt){ let t = $q('#appToast'); if(!t){ t = document.createElement('div'); t.id='appToast'; t.style.position='fixed';t.style.bottom='100px';t.style.left='50%';t.style.transform='translateX(-50%)';t.style.background='var(--green-500)';t.style.color='#fff';t.style.padding='10px 14px';t.style.borderRadius='8px';t.style.zIndex=9999;document.body.appendChild(t);} t.textContent = txt; t.style.opacity = 1; setTimeout(()=>t.style.opacity=0,1400); }

/* Cart drawer toggle */
function toggleCart(){ const d = $q('.cart-drawer'); if(!d) return; d.classList.toggle('open'); updateCartUI(); }

/* Storage listener to auto-refresh product lists */
window.addEventListener('storage', (e)=>{
  if(e.key === 'localProductsUpdated' || e.key === 'localProducts'){
    PRODUCTS = getMergedProducts();
    if($q('#productGrid')) renderGrid('#productGrid', PRODUCTS);
    if($q('#homeProducts')) renderGrid('#homeProducts', PRODUCTS.slice(0,12));
    if($q('#bestsellerGrid')) renderGrid('#bestsellerGrid', PRODUCTS.slice(0,6));
    if($q('#categoryGrid') && $q('#categoryTitle')) renderCategory($q('#categoryTitle').textContent.trim());
    updateCartUI();
  }
});

/* Init handlers on DOM load */
document.addEventListener('DOMContentLoaded', ()=>{
  // logo
  $qa('.brand img').forEach(img=>img.src = CONFIG.logo);
  $qa('.brand .title').forEach(el=>el.textContent = CONFIG.brand);
  // hero slider
  initHero();
  // render home if elements present
  if($q('#homeProducts')) renderHome();
  if($q('#productGrid')) renderAllProducts();
  if($q('#categoryGrid') && $q('#categoryTitle')) renderCategory($q('#categoryTitle').textContent.trim());
  if($q('#detailContent')) renderDetailFromQuery();
  // cart UI
  updateCartUI();
  // preloader hide
  const pre = $q('#preloader'); if(pre) pre.style.display='none';
  // hamburger
  const hb = $q('.hamburger'); if(hb){ hb.addEventListener('click', ()=>{ document.querySelector('.nav-links').classList.toggle('open'); }) }
  // dark mode toggle (if button available)
  const dm = $q('#darkToggle'); if(dm){ dm.addEventListener('click', ()=>{ document.documentElement.classList.toggle('dark'); localStorage.setItem('prefersDark', document.documentElement.classList.contains('dark')?'1':'0'); }) }
  // apply saved dark
  if(localStorage.getItem('prefersDark')==='1'){ document.documentElement.classList.add('dark'); }
});

/* Helper to render all products */
function renderAllProducts(){ PRODUCTS = getMergedProducts(); renderGrid('#productGrid', PRODUCTS); renderGrid('#bestsellerGrid', PRODUCTS.slice(0,6)); }
