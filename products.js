/* BELANJAKU - data produk & helper */
const CATEGORIES=[
 {id:'elektronik',name:'Elektronik',icon:'🔌',c:['#0ea5e9','#38bdf8']},
 {id:'pria',name:'Fashion Pria',icon:'👔',c:['#475569','#94a3b8']},
 {id:'wanita',name:'Fashion Wanita',icon:'👗',c:['#ec4899','#f9a8d4']},
 {id:'komputer',name:'Komputer & Laptop',icon:'💻',c:['#6366f1','#a5b4fc']},
 {id:'handphone',name:'Handphone',icon:'📱',c:['#14b8a6','#5eead4']},
 {id:'makanan',name:'Makanan & Minuman',icon:'🍜',c:['#f97316','#fdba74']},
 {id:'rumah',name:'Perlengkapan Rumah',icon:'🏠',c:['#84cc16','#bef264']},
 {id:'aksesoris',name:'Aksesoris',icon:'⌚',c:['#a855f7','#d8b4fe']}
];
// [nama, kategori, harga akhir, diskon%, rating, terjual, lokasi, emoji]
const RAW=[
 ['Smart TV LED 32" Full HD Android','elektronik',1599000,20,4.8,1250,'Jakarta Barat','📺'],
 ['Speaker Bluetooth Portable Bass','elektronik',249000,35,4.7,8420,'Surabaya','🔊'],
 ['Rice Cooker Mini 1.2L Anti Lengket','elektronik',189000,25,4.9,5310,'Bandung','🍚'],
 ['Kemeja Flannel Pria Lengan Panjang','pria',129000,30,4.6,3120,'Bandung','👕'],
 ['Sepatu Sneakers Pria Casual','pria',219000,40,4.8,9870,'Tangerang','👟'],
 ['Jaket Hoodie Pria Premium','pria',169000,25,4.7,6540,'Jakarta Timur','🧥'],
 ['Dress Wanita Floral Elegan','wanita',159000,35,4.8,4410,'Bandung','👗'],
 ['Tas Selempang Wanita Quilted','wanita',189000,30,4.7,2980,'Yogyakarta','👜'],
 ['Hijab Segi Empat Voal Premium','wanita',45000,20,4.9,15200,'Surabaya','🧕'],
 ['Laptop Ultrabook 14" Core i5 16GB','komputer',8499000,15,4.9,860,'Jakarta Pusat','💻'],
 ['Mouse Gaming Wireless RGB','komputer',79000,40,4.8,12300,'Semarang','🖱️'],
 ['Keyboard Gaming RGB 104 Tombol','komputer',459000,28,4.7,3650,'Jakarta Barat','⌨️'],
 ['Smartphone 5G 8/256GB AMOLED','handphone',3799000,18,4.8,2140,'Jakarta Utara','📱'],
 ['Powerbank Mini Travel Size Fast Charging','handphone',199000,33,4.8,9120,'Bekasi','🔋'],
 ['Casing HP Anti Shock Transparan','handphone',35000,50,4.6,21400,'Bandung','📲'],
 ['Kopi Arabika Gayo 1kg Biji Pilihan','makanan',139000,15,4.9,7800,'Aceh Tengah','☕'],
 ['Keripik Singkong Pedas 500gr','makanan',32000,20,4.7,18900,'Malang','🥔'],
 ['Madu Murni Hutan 650ml','makanan',98000,22,4.8,5670,'Sumbawa','🍯'],
 ['Set Panci Anti Lengket 5 Pcs','rumah',299000,32,4.7,3340,'Tangerang','🍳'],
 ['Lampu Meja LED Kristal Aesthetic','rumah',89000,38,4.6,6120,'Jakarta Timur','💡'],
 ['Sprei Microtencel Premium Navy','rumah',175000,30,4.8,4890,'Solo','🛏️'],
 ['Jam Tangan Digital Sporty','aksesoris',149000,45,4.7,8230,'Surabaya','⌚'],
 ['Kacamata Sunglasses Polarized Pria','aksesoris',69000,35,4.6,5410,'Jakarta Barat','🕶️'],
 ['Dompet Kartu Kulit Motif Croco','aksesoris',115000,28,4.8,3770,'Garut','👛']
];
// Bangun objek produk (harga coret dihitung dari diskon)
const PRODUCTS=RAW.map((r,i)=>({id:i+1,name:r[0],cat:r[1],price:r[2],disc:r[3],
 old:Math.round(r[2]/(1-r[3]/100)/1000)*1000,rating:r[4],sold:r[5],city:r[6],emoji:r[7],isNew:i%3===0}));
const getProduct=id=>PRODUCTS.find(p=>p.id===Number(id));
const getCat=id=>CATEGORIES.find(c=>c.id===id);
const rp=n=>'Rp'+Number(n).toLocaleString('id-ID');
const fmtSold=n=>n>=1000?(n/1000).toFixed(1).replace('.0','').replace('.',',')+'rb':n;
// Gambar produk: ilustrasi SVG (data-URI) agar selalu tampil tanpa file eksternal
function svgOf(p){const c=getCat(p.cat).c;
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c[0]}"/><stop offset="1" stop-color="${c[1]}"/></linearGradient></defs><rect width="300" height="300" fill="url(#g)"/><circle cx="250" cy="50" r="80" fill="#fff" opacity=".22"/><circle cx="40" cy="270" r="70" fill="#fff" opacity=".15"/><ellipse cx="150" cy="245" rx="70" ry="10" fill="#000" opacity=".15"/><text x="150" y="205" font-size="130" text-anchor="middle">${p.emoji}</text></svg>`;
 return 'data:image/svg+xml,'+encodeURIComponent(svg)}

/* ---------- FOTO PRODUK ----------
   Foto asli ada di assets/images (id produk -> nama file). Produk tanpa foto lokal
   memakai foto online berdasarkan kata kunci; jika gagal, otomatis ilustrasi SVG. */
const LOCAL_PHOTOS={1: "p1.jpeg", 3: "p3.jpg", 4: "p4.jpeg", 5: "p5.jpeg", 6: "p6.webp", 7: "p7.jpeg", 8: "p8.jpeg", 9: "p9.webp", 11: "p11.jpeg", 12: "p12.jpg", 14: "p14.jpeg", 16: "p16.jpeg", 17: "p17.jpeg", 18: "p18.jpeg", 19: "p19.jpeg", 20: "p20.jpeg", 21: "p21.webp", 23: "p23.jpeg", 24: "p24.jpeg"};
const PHOTO_KEYWORDS={2:'speaker',10:'laptop',13:'smartphone',15:'phone,case',22:'wristwatch'};
function imgOf(p){
 if(LOCAL_PHOTOS[p.id])return 'assets/images/'+LOCAL_PHOTOS[p.id];
 return `https://loremflickr.com/480/480/${PHOTO_KEYWORDS[p.id]}?lock=${p.id}`;
}
// Jika foto gagal dimuat, ganti ke ilustrasi SVG (tidak ada gambar rusak)
document.addEventListener('error',e=>{
 const im=e.target;if(!im||im.tagName!=='IMG'||im.dataset.fb)return;
 const p=PRODUCTS.find(x=>x.name===im.alt);if(p){im.dataset.fb=1;im.src=svgOf(p)}
},true);
