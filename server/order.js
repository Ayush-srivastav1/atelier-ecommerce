import { products } from '../src/data/products.js';
import { totalsFor } from '../shared/pricing.js';
import { httpError } from './razorpay.js';
const str = (v) => (typeof v === 'string' ? v.trim() : '');
export function validateCustomer(c = {}) {
  if (str(c.name).length < 2) return 'Please enter your full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(str(c.email))) return 'Please enter a valid email.';
  if (!/^[6-9]\d{9}$/.test(str(c.phone))) return 'Please enter a valid 10-digit Indian mobile number.';
  if (str(c.address).length < 5 || str(c.city).length < 2 || str(c.state).length < 2) return 'Please complete your shipping address.';
  if (!/^[1-9]\d{5}$/.test(str(c.pincode))) return 'Please enter a valid 6-digit pincode.';
  return null;
}
// Prices come from products.js on the server; prices sent by the browser are ignored.
export function priceCart(items) {
  if (!Array.isArray(items) || !items.length || items.length > 50) throw httpError(400, 'Your cart is empty.');
  let subtotal = 0; const lines = [];
  for (const it of items) {
    const p = products.find((x) => x.id === it?.id);
    if (!p) throw httpError(400, 'A product in your cart is no longer available.');
    const qty = Number(it.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > Math.min(p.stock ?? 20, 20)) throw httpError(400, `Invalid quantity for ${p.name}.`);
    if (p.sizes?.length && !p.sizes.includes(it.size)) throw httpError(400, `Please choose a valid size for ${p.name}.`);
    if (it.color && p.colors?.length && !p.colors.includes(it.color)) throw httpError(400, `Invalid color for ${p.name}.`);
    subtotal += p.price * qty; lines.push(`${p.name} x${qty}`);
  }
  return { ...totalsFor(subtotal), lines };
}
