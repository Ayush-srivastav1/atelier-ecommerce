// Swap these bodies for fetch('/api/products') etc. when a backend exists. UI only uses these functions.
import {products} from '../data/products.js';
const withDiscount=p=>({...p,discount:Math.round((1-p.price/p.originalPrice)*100)});
export const getProducts=async()=>products.map(withDiscount);
export const getProductById=async id=>{const p=products.find(x=>x.id===id);return p?withDiscount(p):null;};
export const createProduct=async()=>{throw new Error('POST /api/products not implemented');};
export const updateProduct=async()=>{throw new Error('PUT /api/products/:id not implemented');};
export const deleteProduct=async()=>{throw new Error('DELETE /api/products/:id not implemented');};
