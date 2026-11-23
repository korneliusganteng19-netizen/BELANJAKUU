/* BELANJAKU - keranjang, wishlist, notifikasi (LocalStorage) */
const Store={
 get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v===null?d:v}catch(e){return d}},
 set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
};
const Cart={
 items(){return Store.get('bk_cart',[])},
 save(list){Store.set('bk_cart',list);updateBadge()},
 add(id,q=1){const l=this.items(),f=l.find(x=>x.id===id);f?f.qty+=q:l.push({id,qty:q});this.save(l)},
 change(id,d){const l=this.items(),f=l.find(x=>x.id===id);if(f){f.qty+=d;this.save(l.filter(x=>x.qty>0))}},
 remove(id){this.save(this.items().filter(x=>x.id!==id))},
 clear(){this.save([])},
 count(){return this.items().reduce((a,b)=>a+b.qty,0)},
 detailed(){return this.items().map(x=>({...getProduct(x.id),qty:x.qty})).filter(x=>x.name)},
 total(){return this.detailed().reduce((a,b)=>a+b.price*b.qty,0)}
};
const Wish={
 list(){return Store.get('bk_wish',[])},
 has(id){return this.list().includes(id)},
 toggle(id){const l=this.list(),n=l.includes(id)?l.filter(x=>x!==id):[...l,id];Store.set('bk_wish',n);return n.includes(id)}
};
function updateBadge(){document.querySelectorAll('.cart-badge').forEach(e=>e.textContent=Cart.count())}
function toast(msg){const t=document.getElementById('toast');if(!t)return;t.textContent=msg;t.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('show'),2200)}
