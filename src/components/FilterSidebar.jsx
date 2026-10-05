import {subCategories} from '../data/products.js';
export default function FilterSidebar({f,set,sizes,colors,lockCategory,reset}){
const toggle=(k,v)=>set({[k]:f[k].includes(v)?f[k].filter(x=>x!==v):[...f[k],v]});
const Chip=({on,children,...r})=><button type="button" aria-pressed={on} className={`rounded-full border px-3 py-1 text-xs ${on?'border-brand bg-brand text-white':'border-ink/20'}`} {...r}>{children}</button>;
const subs=f.category?subCategories[f.category]||[]:Object.values(subCategories).flat();
return <aside className="p-5 space-y-6 bg-white rounded-2xl" aria-label="Filters">
 {!lockCategory&&<fieldset><legend className="mb-2 font-medium">Category</legend><div className="flex flex-wrap gap-2">{['','Clothing','Self Grooming'].map(c=><Chip key={c} on={f.category===c} onClick={()=>set({category:c,subCategory:''})}>{c||'All'}</Chip>)}</div></fieldset>}
 <fieldset><legend className="mb-2 font-medium">Sub-category</legend><div className="flex flex-wrap gap-2"><Chip on={!f.subCategory} onClick={()=>set({subCategory:''})}>All</Chip>{subs.map(s=><Chip key={s} on={f.subCategory===s} onClick={()=>set({subCategory:s})}>{s}</Chip>)}</div></fieldset>
 <div><label htmlFor="pr" className="block mb-2 font-medium">Max price: ₹{f.maxPrice.toLocaleString('en-IN')}</label><input id="pr" type="range" min="200" max="5000" step="100" value={f.maxPrice} onChange={e=>set({maxPrice:+e.target.value})} className="w-full accent-brand"/></div>
 {sizes.length>0&&<fieldset><legend className="mb-2 font-medium">Size</legend><div className="flex flex-wrap gap-2">{sizes.map(s=><Chip key={s} on={f.sizes.includes(s)} onClick={()=>toggle('sizes',s)}>{s}</Chip>)}</div></fieldset>}
 {colors.length>0&&<fieldset><legend className="mb-2 font-medium">Color</legend><div className="flex flex-wrap gap-2">{colors.map(s=><Chip key={s} on={f.colors.includes(s)} onClick={()=>toggle('colors',s)}>{s}</Chip>)}</div></fieldset>}
 <fieldset><legend className="mb-2 font-medium">Rating</legend><div className="flex gap-2">{[0,4,4.5].map(r=><Chip key={r} on={f.minRating===r} onClick={()=>set({minRating:r})}>{r?`${r}+`:'Any'}</Chip>)}</div></fieldset>
 <button type="button" className="w-full btn-outline" onClick={reset}>Clear filters</button></aside>}
