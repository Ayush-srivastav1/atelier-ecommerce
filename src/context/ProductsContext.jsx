import {createContext,useCallback,useContext,useEffect,useRef,useState} from 'react';import {getProducts} from '../services/productService.js';
const Ctx=createContext(null);
// Products load ONCE at app start and are shared by every page, so navigating never re-fetches or flashes an empty state.
export function ProductsProvider({children}){const [products,setProducts]=useState([]);const [loading,setLoading]=useState(true);const [error,setError]=useState(null);const alive=useRef(true);
const refetch=useCallback(()=>{setLoading(true);return getProducts().then(d=>alive.current&&(setProducts(Array.isArray(d)?d:[]),setError(null))).catch(e=>alive.current&&setError(e)).finally(()=>alive.current&&setLoading(false))},[]);
useEffect(()=>{alive.current=true;refetch();return()=>{alive.current=false}},[refetch]);
return <Ctx.Provider value={{products,loading,error,refetch}}>{children}</Ctx.Provider>}
export const useProductsContext=()=>{const c=useContext(Ctx);if(!c)throw new Error('Wrap the app in <ProductsProvider>');return c};
