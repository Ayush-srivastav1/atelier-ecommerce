export const formatPrice=n=>'₹'+Number(n).toLocaleString('en-IN');
export const unique=(items,pick)=>[...new Set(items.flatMap(pick))].filter(Boolean);
export function filterProducts(list,{q='',category='',subCategory='',maxPrice=Infinity,sizes=[],colors=[],minRating=0}={}){
 const terms=q.toLowerCase().split(/\s+/).filter(Boolean);
 return list.filter(p=>{
  const hay=[p.name,p.category,p.subCategory,p.description,...(p.tags||[])].join(' ').toLowerCase().replace(/-/g,' ');
  return terms.every(t=>hay.includes(t.replace(/-/g,' ')))&&(!category||p.category===category)&&(!subCategory||p.subCategory===subCategory)&&p.price<=maxPrice&&(!sizes.length||sizes.some(s=>p.sizes?.includes(s)))&&(!colors.length||colors.some(c=>p.colors?.includes(c)))&&p.rating>=minRating;});}
export const sortProducts=(list,by)=>{const a=[...list];const f={price_asc:(x,y)=>x.price-y.price,price_desc:(x,y)=>y.price-x.price,newest:(x,y)=>new Date(y.createdAt)-new Date(x.createdAt),rating:(x,y)=>y.rating-x.rating,popularity:(x,y)=>y.reviews-x.reviews}[by];return f?a.sort(f):a;};
export const related=(list,p,n=4)=>list.filter(x=>x.id!==p.id&&(x.subCategory===p.subCategory||x.category===p.category)).slice(0,n);
