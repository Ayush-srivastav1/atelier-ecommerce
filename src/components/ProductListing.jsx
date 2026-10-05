import {useMemo,useState} from 'react';import {SlidersHorizontal} from 'lucide-react';
import useProducts from '../hooks/useProducts.js';import ProductGrid from './ProductGrid.jsx';import FilterSidebar from './FilterSidebar.jsx';import {filterProducts,sortProducts,unique} from '../utils/productUtils.js';
const base=c=>({category:c,subCategory:'',maxPrice:5000,sizes:[],colors:[],minRating:0});
export default function ProductListing({title,category='',q=''}){const {products,loading,error}=useProducts();
const [f,setF]=useState(base(category));const [sort,setSort]=useState('popularity');const [shown,setShown]=useState(8);const [open,setOpen]=useState(false);
const set=patch=>{setF(c=>({...c,...patch}));setShown(8)};
const scope=useMemo(()=>filterProducts(products,{q,category:category||f.category}),[products,q,category,f.category]);
const list=useMemo(()=>sortProducts(filterProducts(products,{...f,q,category:category||f.category}),sort),[products,f,q,category,sort]);
if(error)return <p className="container-x py-20 text-center">Could not load products. Please try again.</p>;
return <div className="container-x py-10"><div className="mb-6 flex flex-wrap items-end justify-between gap-3"><div><h1 className="h-display text-3xl sm:text-4xl">{title}</h1><p className="text-sm text-ink/60">{list.length} products</p></div>
 <div className="flex gap-2"><button type="button" className="btn-outline lg:hidden" aria-expanded={open} onClick={()=>setOpen(!open)}><SlidersHorizontal size={16}/>Filters</button>
 <label className="sr-only" htmlFor="sort">Sort by</label><select id="sort" value={sort} onChange={e=>setSort(e.target.value)} className="input w-auto"><option value="popularity">Popularity</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="newest">Newest</option><option value="rating">Top rated</option></select></div></div>
 <div className="grid gap-6 lg:grid-cols-[260px_1fr]"><div className={`${open?'block':'hidden'} lg:block`}><FilterSidebar f={f} set={set} sizes={unique(scope,p=>p.sizes||[])} colors={unique(scope,p=>p.colors||[])} lockCategory={!!category} reset={()=>setF(base(category))}/></div>
 <div><ProductGrid products={list.slice(0,shown)} loading={loading} empty="No products match your filters. Try clearing some."/>{shown<list.length&&<div className="mt-8 text-center"><button className="btn-outline" onClick={()=>setShown(shown+8)}>Load more</button></div>}</div></div></div>}
