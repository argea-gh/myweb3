/* Basic shared JS extracted from your original file (products array + render + modal + scroll) */
/* ----------------- product data (trimmed) ----------------- */
const products = [
  { id:1, name:"Madu Pahit", price:120000, category:"madu", icon:"🍯", image:"https://hni.net/public/front/img/produk/MADU%20PAHIT-1_04-01-19_.png", bestseller:true, description:"Madu pahit berkualitas." },
  { id:2, name:"Centella Teh Sinergi", price:70000, category:"suplemen", icon:"🍵", image:"https://hni.net/public/front/img/produk/CENTELLA-1_04-01-19_.png", bestseller:false, description:"Teh herbal menyegarkan." },
  /* tambahkan sisa data produk Anda di sini (saya ekstrak sebagian dari file). */
];

/* utility */
function formatRupiah(v){ return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR'}).format(v); }

/* render product grid (dipanggil di produk.html) */
function renderProducts(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;
  grid.innerHTML = products.map(p=>{
    return `<div class="card product-card">
      <div style="height:160px;display:flex;align-items:center;justify-content:center;">
        <img src="${p.image}" alt="${p.name}" style="max-width:100%;max-height:100%" onerror="this.style.display='none'">
      </div>
      <h3 style="margin:8px 0">${p.name}</h3>
      <p style="color:#16a34a;font-weight:700">${formatRupiah(p.price)}</p>
      <div style="display:flex;gap:8px;margin-top:12px">
        <button class="btn" onclick="addToCart(${p.id})">Tambah ke Keranjang</button>
        <button class="btn btn-outline" onclick="showDetail(${p.id})">Detail</button>
      </div>
    </div>`;
  }).join('');
}

/* dummy cart */
function addToCart(id){ alert('Produk ditambah ke keranjang: ID '+id); }

/* modal / detail simple */
function showDetail(id){
  const p = products.find(x=>x.id===id);
  if(!p) return alert('Produk tidak ditemukan');
  alert(p.name + "\\n\\n" + p.description + "\\n" + formatRupiah(p.price));
}

/* contact form simple */
document.addEventListener('DOMContentLoaded',function(){
  const cf = document.getElementById('contactForm');
  if(cf){
    cf.addEventListener('submit', e=>{
      e.preventDefault();
      alert('Terima kasih, pesan Anda telah dikirim.');
      cf.reset();
    });
  }

  // render products if on produk.html
  renderProducts();

  // Init Scroll-to-top universal (window + page)
  const scrollBtn = document.getElementById('scrollToTopBtn');
  function checkScroll(){
    const pageScroll = window.scrollY || document.documentElement.scrollTop;
    if(pageScroll > 300) scrollBtn && scrollBtn.classList.add('visible'); else scrollBtn && scrollBtn.classList.remove('visible');
  }
  window.addEventListener('scroll', checkScroll, {passive:true});
  if(scrollBtn){
    scrollBtn.addEventListener('click', ()=>{
      window.scrollTo({top:0,behavior:'smooth'});
    });
  }
});
