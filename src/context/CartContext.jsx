import {deliveryFor} from '../../shared/pricing.js';import {createContext,useContext,useEffect,useMemo,useState} from 'react';
const Ctx=createContext();export const useCart=()=>useContext(Ctx);
const load=()=>{try{return JSON.parse(localStorage.getItem('cart'))||[]}catch{return[]}};
export function CartProvider({children}){const [items,setItems]=useState(load);
useEffect(()=>{try{localStorage.setItem('cart',JSON.stringify(items))}catch{}},[items]);
const key=(id,size,color)=>[id,size,color].join('|');
const add=(p,{size=null,color=null,qty=1}={})=>setItems(cur=>{const k=key(p.id,size,color);const hit=cur.find(i=>i.key===k);
 return hit?cur.map(i=>i.key===k?{...i,qty:Math.min(i.qty+qty,p.stock||99)}:i):[...cur,{key:k,id:p.id,name:p.name,price:p.price,originalPrice:p.originalPrice,image:p.images?.[0],size,color,qty,stock:p.stock}];});
const remove=k=>setItems(c=>c.filter(i=>i.key!==k));
const setQty=(k,q)=>setItems(c=>c.map(i=>i.key===k?{...i,qty:Math.max(1,Math.min(q,i.stock||99))}:i));
const totals=useMemo(()=>{const count=items.reduce((s,i)=>s+i.qty,0),mrp=items.reduce((s,i)=>s+i.originalPrice*i.qty,0),subtotal=items.reduce((s,i)=>s+i.price*i.qty,0),discount=mrp-subtotal,delivery=deliveryFor(subtotal);return{count,mrp,subtotal,discount,delivery,total:subtotal+delivery}},[items]);
return <Ctx.Provider value={{items,add,remove,setQty,clear:()=>setItems([]),...totals}}>{children}</Ctx.Provider>}
