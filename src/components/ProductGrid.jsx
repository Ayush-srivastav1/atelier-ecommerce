import ProductCard from './ProductCard.jsx';
export default function ProductGrid({products,loading,empty='No products found.'}){
if(loading)return <div className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-busy="true">{Array.from({length:4}).map((_,i)=><div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-ink/10"/>)}</div>;
if(!products.length)return <p className="rounded-2xl bg-white p-10 text-center text-ink/60">{empty}</p>;
return <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-4">{products.map(p=><ProductCard key={p.id} product={p}/>)}</div>}
