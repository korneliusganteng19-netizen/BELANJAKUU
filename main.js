/* BELANJAKU - logika utama: layout, kartu, slider, halaman */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const page=document.body.dataset.page, params=new URLSearchParams(location.search);
const user=()=>Store.get('bk_user',null);

/* ---------- Header & Footer (dipakai semua halaman) ---------- */
function renderLayout(){
 const u=user(), nav=(h,t,k)=>`<a href="${h}" class="${page===k?'active':''}">${t}</a>`;
 $('#site-header').innerHTML=`<header class="hdr"><div class="topbar">🚚 Gratis ongkir min. belanja Rp100.000 · Cashback hingga 50%</div>
 <div class="wrap"><div class="hdr-main">
  <a href="index.html" class="logo"><i>B</i>BELANJAKU</a>
  <div class="catbtn"><button id="catToggle" type="button">☰ Kategori</button>
   <div class="catmenu" id="catMenu">${CATEGORIES.map(c=>`<a href="produk.html?cat=${c.id}"><span>${c.icon}</span>${c.name}</a>`).join('')}</div></div>
  <form class="search" id="searchForm" role="search"><input id="q" type="search" placeholder="Cari produk di BELANJAKU..." autocomplete="off" aria-label="Cari produk"><button>Cari</button></form>
  <a href="keranjang.html" class="cart-link" aria-label="Keranjang">🛒<span class="cart-badge">0</span></a>
  <div class="auth">${u?`<span>Hai, <b>${u.name.split(' ')[0]}</b></span><button class="btn btn-outline" id="logout">Keluar</button>`
   :`<a class="btn btn-outline" href="login.html">Masuk</a><a class="btn btn-primary" href="register.html">Daftar</a>`}</div>
 </div>
 <nav class="nav">${nav('index.html','Beranda','index')}${nav('produk.html','Semua Produk','produk')}${nav('produk.html?promo=1','Promo','promo')}${nav('produk.html?new=1','Produk Terbaru','new')}</nav></div></header>`;
 $('#site-footer').innerHTML=`<footer class="ftr"><div class="wrap"><div class="ftr-g">
  <div><a href="index.html" class="logo"><i>B</i>BELANJAKU</a><p>Marketplace terpercaya untuk jual beli elektronik, fashion, makanan, dan kebutuhan sehari-hari dari seluruh Indonesia.</p>
   <div class="soc"><a href="#" aria-label="Facebook">f</a><a href="#" aria-label="Instagram">◎</a><a href="#" aria-label="Twitter">𝕏</a><a href="#" aria-label="YouTube">▶</a></div></div>
  <div><h4>Tentang Kami</h4><ul><li><a href="#">Tentang BELANJAKU</a></li><li><a href="#">Karir</a></li><li><a href="#">Blog</a></li></ul></div>
  <div><h4>Panduan Belanja</h4><ul><li><a href="produk.html">Cara Belanja</a></li><li><a href="keranjang.html">Cara Pembayaran</a></li><li><a href="#">Pengiriman</a></li></ul></div>
  <div><h4>Bantuan</h4><ul><li><a href="#">Pusat Bantuan</a></li><li><a href="#">Kebijakan Privasi</a></li><li><a href="#">Syarat & Ketentuan</a></li></ul></div>
  <div><h4>Kontak</h4><ul><li>📍 Indramayu, Jawa Barat</li><li>📞 (0234) 123-4567</li><li>✉️ halo@belanjaku.id</li></ul></div>
 </div><div class="copy">© 2026 BELANJAKU. Seluruh hak cipta dilindungi.</div></div></footer>`;
 // Menu kategori
 $('#catToggle').onclick=e=>{e.stopPropagation();$('#catMenu').classList.toggle('open')};
 document.addEventListener('click',()=>$('#catMenu').classList.remove('open'));
 // Pencarian: di halaman produk langsung memfilter, di halaman lain pindah ke produk.html
 $('#searchForm').onsubmit=e=>{e.preventDefault();if(page!=='produk')location.href='produk.html?q='+encodeURIComponent($('#q').value.trim())};
 if($('#logout'))$('#logout').onclick=()=>{Store.set('bk_user',null);toast('Berhasil keluar');setTimeout(()=>location.reload(),600)};
 updateBadge();
}

/* ---------- Kartu produk ---------- */
function card(p){return `<article class="card">
 <button class="wish ${Wish.has(p.id)?'on':''}" data-wish="${p.id}" aria-label="Favorit">♥</button>
 <a href="detail.html?id=${p.id}" class="imgw"><img src="${imgOf(p)}" alt="${p.name}" loading="lazy"></a>
 <div class="cb"><h3>${p.name}</h3><div class="price">${rp(p.price)}</div>
  <div class="old"><span class="disc">${p.disc}%</span><s>${rp(p.old)}</s></div>
  <div class="meta"><b>★</b> ${p.rating} · Terjual ${fmtSold(p.sold)}</div><div class="loc">📍 ${p.city}</div>
  <div class="acts"><button class="btn btn-primary" data-add="${p.id}">+ Tambah ke Keranjang</button><a class="btn btn-outline" href="detail.html?id=${p.id}">Lihat Detail</a></div></div></article>`}
const grid=(list,el)=>{el.innerHTML=list.map(card).join('')};

/* Delegasi klik global: tambah keranjang & wishlist */
document.addEventListener('click',e=>{
 const a=e.target.closest('[data-add]'),w=e.target.closest('[data-wish]');
 if(a){const p=getProduct(a.dataset.add);Cart.add(p.id);toast('✓ '+p.name.slice(0,30)+' ditambahkan ke keranjang')}
 if(w){const on=Wish.toggle(Number(w.dataset.wish));w.classList.toggle('on',on);toast(on?'❤ Ditambahkan ke favorit':'Dihapus dari favorit')}
});

/* ---------- Slider ---------- */
function initSlider(){
 const s=$('.slides');if(!s)return;let i=0;const n=s.children.length,d=$('.dots');
 d.innerHTML=[...Array(n)].map((_,k)=>`<button aria-label="Slide ${k+1}"></button>`).join('');
 const go=k=>{i=(k+n)%n;s.style.transform=`translateX(-${i*100}%)`;$$('button',d).forEach((b,x)=>b.classList.toggle('on',x===i))};
 $('.prev').onclick=()=>{go(i-1);reset()};$('.next').onclick=()=>{go(i+1);reset()};
 $$('button',d).forEach((b,x)=>b.onclick=()=>{go(x);reset()});
 let t=setInterval(()=>go(i+1),4500);const reset=()=>{clearInterval(t);t=setInterval(()=>go(i+1),4500)};go(0);
}

/* ---------- Halaman ---------- */
const pages={
 index(){
  $('#cats').innerHTML=CATEGORIES.map(c=>`<a class="cat" href="produk.html?cat=${c.id}"><span>${c.icon}</span>${c.name}</a>`).join('');
  grid([...PRODUCTS].sort((a,b)=>b.sold-a.sold).slice(0,5),$('#best'));
  grid(PRODUCTS.filter(p=>p.rating>=4.8).slice(0,10),$('#reco'));
  grid(PRODUCTS.filter(p=>p.isNew),$('#newp'));
  initSlider();
 },
 produk(){
  let cat=params.get('cat')||'all',sort=params.get('sort')||'';const q=$('#q');q.value=params.get('q')||'';
  const promo=params.get('promo'),isNew=params.get('new');
  $('#chips').innerHTML=`<button class="chip" data-c="all">Semua</button>`+CATEGORIES.map(c=>`<button class="chip" data-c="${c.id}">${c.icon} ${c.name}</button>`).join('');
  $('#sort').value=sort;
  function render(){
   const k=q.value.trim().toLowerCase();
   let l=PRODUCTS.filter(p=>(cat==='all'||p.cat===cat)&&p.name.toLowerCase().includes(k)&&(!promo||p.disc>=30)&&(!isNew||p.isNew));
   if(sort==='asc')l.sort((a,b)=>a.price-b.price);if(sort==='desc')l.sort((a,b)=>b.price-a.price);if(sort==='sold')l.sort((a,b)=>b.sold-a.sold);
   $$('.chip').forEach(c=>c.classList.toggle('on',c.dataset.c===cat));
   $('#count').textContent=`${l.length} produk ditemukan`+(promo?' (Promo ≥30%)':isNew?' (Terbaru)':'');
   $('#list').innerHTML=l.length?l.map(card).join(''):`<div class="empty" style="grid-column:1/-1"><div class="emo">🔍</div><h3>Produk tidak ditemukan</h3><p>Coba kata kunci atau kategori lain.</p></div>`;
  }
  $('#chips').onclick=e=>{const c=e.target.closest('.chip');if(c){cat=c.dataset.c;render()}};
  $('#sort').onchange=e=>{sort=e.target.value;render()};
  q.oninput=render;$('#searchForm').onsubmit=e=>{e.preventDefault();render()};render();
 },
 detail(){
  const p=getProduct(params.get('id'));const box=$('#detail');
  if(!p){box.innerHTML=`<div class="empty"><div class="emo">😕</div><h3>Produk tidak ditemukan</h3><a class="btn btn-primary" href="produk.html">Lihat Semua Produk</a></div>`;return}
  document.title=p.name+' — BELANJAKU';let q=1;
  box.innerHTML=`<div class="detail"><img src="${imgOf(p)}" alt="${p.name}"><div>
   <div class="crumb"><a href="index.html">Beranda</a> › <a href="produk.html?cat=${p.cat}">${getCat(p.cat).name}</a></div>
   <h1>${p.name}</h1><div class="meta"><b>★ ${p.rating}</b> · Terjual ${fmtSold(p.sold)} · 📍 ${p.city}</div>
   <div class="price" style="margin-top:12px">${rp(p.price)}</div><div class="old"><span class="disc">${p.disc}%</span><s>${rp(p.old)}</s></div>
   <p style="margin:16px 0;color:var(--mu);font-size:.9rem">${p.name} berkualitas dari toko terpercaya di ${p.city}. Barang original, dikemas aman, dan bergaransi toko. Stok tersedia, siap dikirim hari ini. Gratis ongkir untuk belanja min. Rp100.000.</p>
   <div class="row"><b>Jumlah</b><div class="qty"><button id="m">−</button><span id="n">1</span><button id="pl">+</button></div></div>
   <div class="row"><button class="btn btn-outline" id="add">🛒 Tambah ke Keranjang</button><button class="btn btn-primary" id="buy">Beli Sekarang</button>
   <button class="btn btn-outline wish-d" data-wish="${p.id}" style="position:static;width:auto;height:auto;border-radius:10px;box-shadow:none;color:#ef4444">${Wish.has(p.id)?'❤ Favorit':'♡ Favorit'}</button></div></div></div>`;
  $('#m').onclick=()=>{q=Math.max(1,q-1);$('#n').textContent=q};$('#pl').onclick=()=>{q++;$('#n').textContent=q};
  $('#add').onclick=()=>{Cart.add(p.id,q);toast('✓ Ditambahkan ke keranjang')};
  $('#buy').onclick=()=>{Cart.add(p.id,q);location.href='checkout.html'};
  $('.wish-d').addEventListener('click',e=>{const b=e.currentTarget;setTimeout(()=>b.textContent=Wish.has(p.id)?'❤ Favorit':'♡ Favorit',0)});
  setTimeout(()=>{},0);
  grid(PRODUCTS.filter(x=>x.cat===p.cat&&x.id!==p.id).concat(PRODUCTS.filter(x=>x.cat!==p.cat)).slice(0,5),$('#related'));
 },
 keranjang(){
  const render=()=>{const l=Cart.detailed(),box=$('#cartBox');
   if(!l.length){box.innerHTML=`<div class="empty"><div class="emo">🛒</div><h3>Keranjangmu masih kosong</h3><p style="margin-bottom:14px">Yuk, mulai belanja produk favoritmu!</p><a class="btn btn-primary" href="produk.html">Mulai Belanja</a></div>`;return}
   const t=Cart.total(),ong=t>=100000?0:15000;
   box.innerHTML=`<div class="two"><div class="box"><h2>Keranjang Belanja (${Cart.count()} barang)</h2>${l.map(p=>`<div class="ci"><img src="${imgOf(p)}" alt="${p.name}"><div><h4>${p.name}</h4><b>${rp(p.price)}</b></div>
    <div><div class="qty"><button data-d="-1" data-id="${p.id}">−</button><span>${p.qty}</span><button data-d="1" data-id="${p.id}">+</button></div><button class="rm" data-rm="${p.id}">🗑 Hapus</button></div></div>`).join('')}</div>
    <div class="box sum"><h2>Ringkasan Belanja</h2><div><span>Subtotal</span><span>${rp(t)}</span></div><div><span>Ongkir</span><span>${ong?rp(ong):'GRATIS'}</span></div><div class="tot"><span>Total</span><span>${rp(t+ong)}</span></div>
    <a class="btn btn-primary btn-block" href="checkout.html" style="margin-top:12px">Checkout</a><button class="btn btn-outline btn-block" id="clr" style="margin-top:8px">Kosongkan Keranjang</button></div></div>`;
   $('#clr').onclick=()=>{Cart.clear();render()};};
  $('#cartBox').onclick=e=>{const b=e.target.closest('button');if(!b)return;
   if(b.dataset.d)Cart.change(Number(b.dataset.id),Number(b.dataset.d));if(b.dataset.rm){Cart.remove(Number(b.dataset.rm));toast('Produk dihapus dari keranjang')}render()};
  render();
 },
 checkout(){
  const l=Cart.detailed(),sub=Cart.total();
  const ongOf=()=>sub>=100000?0:Number($('#kurir').selectedOptions[0].dataset.p);
  const sum=()=>{$('#sumBox').innerHTML=l.map(p=>`<div><span>${p.name.slice(0,26)}… ×${p.qty}</span><span>${rp(p.price*p.qty)}</span></div>`).join('')+`<div><span>Ongkir</span><span>${ongOf()?rp(ongOf()):'GRATIS'}</span></div><div class="tot"><span>Total</span><span>${rp(sub+ongOf())}</span></div>`};
  if(!l.length){$('#coWrap').innerHTML=`<div class="empty"><div class="emo">🛍️</div><h3>Tidak ada barang untuk di-checkout</h3><a class="btn btn-primary" href="produk.html">Belanja Dulu</a></div>`;return}
  const u=user();if(u)$('#nama').value=u.name;sum();$('#kurir').onchange=sum;
  $('#coForm').onsubmit=e=>{e.preventDefault();const no='BLJ'+Date.now().toString().slice(-8),tot=sub+ongOf();Cart.clear();
   $('#coWrap').innerHTML=`<div class="box" style="text-align:center;max-width:520px;margin:20px auto"><div style="font-size:4rem">🎉</div><h2>Pesanan Berhasil!</h2><p style="color:var(--mu)">Terima kasih, <b>${$('#nama').value}</b>.<br>Nomor pesanan: <b>${no}</b><br>Total bayar: <b>${rp(tot)}</b> via ${$('#bayar').value}</p><a class="btn btn-primary" href="index.html" style="margin-top:16px">Kembali ke Beranda</a></div>`;scrollTo(0,0)};
 },
 login(){
  $('#authForm').onsubmit=e=>{e.preventDefault();const em=$('#email').value.trim().toLowerCase(),pw=$('#pw').value;
   const f=Store.get('bk_users',[]).find(x=>x.email===em&&x.pw===pw),m=$('#msg');
   if(!f){m.className='msg';m.textContent='Email atau kata sandi salah.';return}
   Store.set('bk_user',{name:f.name,email:f.email});m.className='msg ok';m.textContent='Berhasil masuk! Mengalihkan…';setTimeout(()=>location.href='index.html',800)};
 },
 register(){
  $('#authForm').onsubmit=e=>{e.preventDefault();const m=$('#msg'),us=Store.get('bk_users',[]),em=$('#email').value.trim().toLowerCase();
   if($('#pw').value.length<6){m.className='msg';m.textContent='Kata sandi minimal 6 karakter.';return}
   if($('#pw').value!==$('#pw2').value){m.className='msg';m.textContent='Konfirmasi kata sandi tidak cocok.';return}
   if(us.some(x=>x.email===em)){m.className='msg';m.textContent='Email sudah terdaftar.';return}
   us.push({name:$('#nama').value.trim(),email:em,pw:$('#pw').value});Store.set('bk_users',us);Store.set('bk_user',{name:$('#nama').value.trim(),email:em});
   m.className='msg ok';m.textContent='Akun berhasil dibuat! Mengalihkan…';setTimeout(()=>location.href='index.html',800)};
 }
};
document.addEventListener('DOMContentLoaded',()=>{renderLayout();if(pages[page])pages[page]()});
