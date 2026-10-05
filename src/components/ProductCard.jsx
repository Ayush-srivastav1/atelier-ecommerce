import {useState} from 'react';import {Link,useNavigate} from 'react-router-dom';import {Eye,ShoppingBag,X} from 'lucide-react';
import SafeImage from './SafeImage.jsx';import Rating from './Rating.jsx';import Price from './Price.jsx';import WishlistButton from './WishlistButton.jsx';import {useCart} from '../context/CartContext.jsx';
export default function ProductCard({product:p}){const nav=useNavigate();const {add}=useCart();const [quick,setQuick]=useState(false);
const go=()=>nav(`/product/${p.id}`);const needsOptions=p.sizes?.length>0;
const quickAdd=e=>{e.stopPropagation();needsOptions?go():add(p)};
return <><article onClick={go} className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white transition hover:shadow-xl">
 <div className="relative aspect-[4/5] overflow-hidden"><SafeImage src={p.images?.[0]} alt={p.name} className="h-full w-full transition duration-500 group-hover:scale-105"/>
  {p.discount>0&&<span className="absolute left-3 top-3 rounded-full bg-brand px-2 py-1 text-xs font-medium text-white">-{p.discount}%</span>}
  <WishlistButton id={p.id} className="absolute right-3 top-3"/>
  <button type="button" onClick={e=>{e.stopPropagation();setQuick(true)}} className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium shadow focus-visible:outline focus-visible:outline-2"><Eye size={14}/>Quick view</button></div>
 <div className="flex flex-1 flex-col gap-1.5 p-4"><p className="text-xs text-ink/50">{p.category} · {p.subCategory}</p>
  <h3 className="font-medium"><Link to={`/product/${p.id}`} onClick={e=>e.stopPropagation()} className="hover:text-brand">{p.name}</Link></h3>
  <p className="line-clamp-2 text-sm text-ink/60">{p.description}</p><Rating value={p.rating} count={p.reviews}/><Price {...p}/>
  <button type="button" onClick={quickAdd} className="btn-primary mt-auto"><ShoppingBag size={16}/>{needsOptions?'Select size':'Add to cart'}</button></div></article>
 {quick&&<div role="dialog" aria-modal="true" aria-label={p.name} className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4" onClick={()=>setQuick(false)}>
  <div onClick={e=>e.stopPropagation()} className="grid w-full max-w-2xl gap-4 rounded-2xl bg-white p-5 sm:grid-cols-2"><SafeImage src={p.images?.[0]} alt={p.name} className="aspect-[4/5] w-full rounded-xl"/>
   <div className="flex flex-col gap-3"><div className="flex justify-between"><h3 className="h-display text-xl">{p.name}</h3><button aria-label="Close" onClick={()=>setQuick(false)}><X/></button></div><Rating value={p.rating} count={p.reviews}/><Price {...p} large/><p className="text-sm text-ink/70">{p.description}</p><button className="btn-primary mt-auto" onClick={go}>View full details</button></div></div></div>}</>}
