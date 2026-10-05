import {useState} from 'react';import {Link,NavLink,useNavigate} from 'react-router-dom';import {Heart,Menu,Search,ShoppingBag,User,X} from 'lucide-react';
import {useCart} from '../context/CartContext.jsx';import {useWishlist} from '../context/WishlistContext.jsx';
const links=[['/shop','Shop'],['/clothing','Clothing'],['/self-grooming','Self Grooming'],['/about','About'],['/contact','Contact']];
export default function Navbar(){const [open,setOpen]=useState(false);const [q,setQ]=useState('');const nav=useNavigate();const {count}=useCart();const {ids}=useWishlist();
const submit=e=>{e.preventDefault();if(q.trim()){nav(`/search?q=${encodeURIComponent(q.trim())}`);setOpen(false)}};
const Badge=({n})=>n>0&&<span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-sand px-1 text-[10px] font-bold text-ink">{n}</span>;
const cls=({isActive})=>`text-sm ${isActive?'font-bold text-brand':'hover:text-brand'}`;
return <header className="sticky top-0 z-40 border-b border-ink/10 bg-mist/90 backdrop-blur"><div className="container-x flex h-16 items-center gap-4">
 <button className="md:hidden" aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
 <Link to="/" className="h-display text-2xl text-brand">Atelier</Link>
 <nav className="ml-6 hidden gap-6 md:flex" aria-label="Main">{links.map(([to,l])=><NavLink key={to} to={to} className={cls}>{l}</NavLink>)}</nav>
 <form onSubmit={submit} role="search" className="ml-auto hidden max-w-xs flex-1 sm:block"><label className="sr-only" htmlFor="s">Search products</label><div className="relative"><Search size={16} className="absolute left-3 top-2.5 text-ink/40"/><input id="s" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search t-shirt, serum…" className="input pl-9"/></div></form>
 <div className="ml-auto flex items-center gap-4 sm:ml-0"><Link to="/wishlist" aria-label="Wishlist" className="relative"><Heart size={20}/><Badge n={ids.length}/></Link><Link to="/cart" aria-label={`Cart, ${count} items`} className="relative"><ShoppingBag size={20}/><Badge n={count}/></Link><Link to="/login" aria-label="Account"><User size={20}/></Link></div></div>
 {open&&<div className="border-t border-ink/10 bg-mist p-4 md:hidden"><form onSubmit={submit} role="search" className="mb-3"><input aria-label="Search products" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products" className="input"/></form><nav className="flex flex-col gap-3" aria-label="Mobile">{links.map(([to,l])=><NavLink key={to} to={to} onClick={()=>setOpen(false)} className={cls}>{l}</NavLink>)}</nav></div>}</header>}
