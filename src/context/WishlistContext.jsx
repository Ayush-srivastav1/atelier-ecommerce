import {createContext,useContext,useEffect,useState} from 'react';
const Ctx=createContext();export const useWishlist=()=>useContext(Ctx);
const load=()=>{try{return JSON.parse(localStorage.getItem('wishlist'))||[]}catch{return[]}};
export function WishlistProvider({children}){const [ids,setIds]=useState(load);
useEffect(()=>{try{localStorage.setItem('wishlist',JSON.stringify(ids))}catch{}},[ids]);
const toggle=id=>setIds(c=>c.includes(id)?c.filter(x=>x!==id):[...c,id]);
return <Ctx.Provider value={{ids,toggle,has:id=>ids.includes(id)}}>{children}</Ctx.Provider>}
