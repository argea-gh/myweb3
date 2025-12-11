/* Herbaprima combined app.js (with storage sync listener) */
const CONFIG = {
  brand: "Herbaprima",
  whatsapp: "6282241900467",
  logo: "https://lh3.googleusercontent.com/d/1xp5ce29F3f-nVa_IEx925L-8YrXXbHo6"
};

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

function getLocalProducts(){ return JSON.parse(localStorage.getItem("localProducts") || "[]"); }
function getMergedProducts(){
  const def = DEFAULT_PRODUCTS;
  const loc = getLocalProducts().map((p, i)=> ({ id: 1000 + i, ...p }));
  return [...def, ...loc];
}

let PRODUCTS = getMergedProducts();

function rupiah(v){ return 'Rp ' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g,'.'); }
function $(s){ return document.querySelector(s); }
function $all(s){ return Array.from(document.querySelectorAll(s)); }

function renderGrid(containerSelector, products){
  const container = document.querySelector(containerSelector);
  if(!container) return;
  container.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.image}" alt="${p.name}" onerror="this.style.display='none'">
      </div>
      <div class="body">
        <h3>${p.name}</h3>
        <div class="price">${rupiah(p.price)}</div>
        <div class="actions">
          <button class="btn green" data-id="${p.id}" onclick="addToCart(${p.id})">Tambah</button>
          <button class="btn outline" onclick="openDetail(${p.id})">Detail</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderHome(){ renderGrid('#homeProducts', PRODUCTS.slice(0,8)); }
function renderAllProducts(){ renderGrid('#productGrid', PRODUCTS); renderGrid('#bestsellerGrid', PRODUCTS.slice(0,6)); }
function renderCategory(category){ renderGrid('#categoryGrid', PRODUCTS.filter(p=>p.category===category)); const title = document.getElementById('categoryTitle'); if(title) title.textContent = category; }
function renderDetailFromQuery(){ const params = new URLSearchParams(location.search); const id = parseInt(params.get('id'),10); if(!id) return; openDetail(id,true); }

function openDetail(id, openInPage=false){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const modal = document.getElementById('productModal');
  if(modal){
    modal.querySelector('.box').innerHTML = `
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        <div style="flex:1;min-width:220px"><img src="${p.image}" style="max-width:100%;border-radius:8px" onerror="this.style.display='none'"></div>
        <div style="flex:1.6;min-width:240px">
          <h2 style="margin:0 0 8px">${p.name}</h2>
          <div style="color:#16a34a;font-weight:700">${rupiah(p.price)}</div>
          <p style="margin:12px 0">Kategori: ${p.category}</p>
          <p style="margin:12px 0">Deskripsi singkat produk tersedia di toko kami.</p>
          <div style="display:flex;gap:8px;margin-top:12px">
            <button class="btn green" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
            <button class="btn outline" onclick="buyNowWhatsApp(${p.id})">Beli via WA</button>
          </div>
        </div>
      </div>
    `;
    if(openInPage){
      const detailArea = document.getElementById('detailContent');
      if(detailArea){
        detailArea.innerHTML = modal.querySelector('.box').innerHTML;
        window.scrollTo({top:0,behavior:'smooth'});
        return;
      }
    }
    modal.classList.add('active');
  } else {
    location.href = '/produk/detail/index.html?id='+p.id;
  }
}
function closeModal(){ const modal = document.getElementById('productModal'); if(modal) modal.classList.remove('active'); }

const CART_KEY = 'herbaprima_cart_v1';
function getCart(){ return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); updateCartCount(); }
function updateCartCount(){ const count = getCart().reduce((s,i)=>s+i.qty,0); $all('.cart-count').forEach(el=>el.textContent = count); }
function addToCart(id){ const p = PRODUCTS.find(x=>x.id===id); if(!p) return alert('Produk tidak ditemukan'); const cart = getCart(); const found = cart.find(i=>i.id===id); if(found) found.qty++; else cart.push({id:id, name:p.name, price:p.price, qty:1}); saveCart(cart); toast('Produk ditambahkan ke keranjang'); }
function clearCart(){ if(confirm('Kosongkan keranjang?')){ localStorage.removeItem(CART_KEY); updateCartCount(); toast('Keranjang dikosongkan'); renderCart(); } }
function renderCart(){ const el = document.getElementById('cartList'); if(!el) return; const cart = getCart(); if(cart.length===0){ el.innerHTML='<p>Keranjang kosong</p>'; document.getElementById('cartTotal').textContent=''; return; } el.innerHTML = cart.map(i=>`<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eef2f6"><div>${i.name} x ${i.qty}</div><div>${rupiah(i.price * i.qty)}</div></div>`).join(''); const total = cart.reduce((s,i)=>s+i.price*i.qty,0); document.getElementById('cartTotal').textContent = rupiah(total); }

function buyNowWhatsApp(id){ const p = PRODUCTS.find(x=>x.id===id); const wa = CONFIG.whatsapp || CONFIG.whatsapp; const msg = `Halo ${CONFIG.brand}, saya mau pesan: ${p.name} - ${rupiah(p.price)}. Qty: 1`; window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank'); }
function checkoutWhatsApp(){ const cart = getCart(); if(cart.length===0) return alert('Keranjang kosong'); const wa = CONFIG.whatsapp; let msg = `Halo ${CONFIG.brand}, saya ingin memesan:\n\n`; cart.forEach(i => msg += `- ${i.name} x${i.qty} (${rupiah(i.price*i.qty)})\n`); const total = cart.reduce((s,i)=>s+i.price*i.qty,0); msg += `\nTotal: ${rupiah(total)}\n\nNama:\nAlamat:\nNo HP:`; window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank'); }

function toast(text){ let t = document.getElementById('appToast'); if(!t){ t = document.createElement('div'); t.id='appToast'; t.style.position='fixed';t.style.left='50%';t.style.top='50%';t.style.transform='translate(-50%,-50%)'; t.style.background='#16a34a';t.style.color='#fff';t.style.padding='12px 18px';t.style.borderRadius='8px';t.style.zIndex=9999; document.body.appendChild(t); } t.textContent = text; t.style.opacity = 1; setTimeout(()=> t.style.opacity = 0,1600); }

document.addEventListener('click', (e)=>{ if(e.target.matches('.modal .close') || e.target.matches('.modal')) { closeModal(); } });

document.addEventListener('DOMContentLoaded', ()=> { $all('.brand img').forEach(img=> img.src = CONFIG.logo); $all('.brand .title').forEach(el => el.textContent = CONFIG.brand); updateCartCount(); renderCart(); renderHome(); renderAllProducts(); renderDetailFromQuery(); });

window.addEventListener("storage", function(e){
  if(e.key === "localProductsUpdated"){
    console.log("Detected product update from Admin Panel. Reloading catalog...");
    PRODUCTS = getMergedProducts();
    if(document.querySelector("#productGrid")){ renderGrid("#productGrid", PRODUCTS); }
    if(document.querySelector("#bestsellerGrid")){ renderGrid("#bestsellerGrid", PRODUCTS.slice(0,6)); }
    if(document.querySelector("#categoryTitle")){ const cat = document.querySelector("#categoryTitle").textContent.trim(); renderCategory(cat); }
    if(document.querySelector("#detailContent")){ renderDetailFromQuery(); }
  }
});
