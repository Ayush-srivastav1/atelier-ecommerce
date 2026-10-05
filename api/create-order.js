import crypto from 'node:crypto';
import { rz, keys } from '../server/razorpay.js';
import { priceCart, validateCustomer } from '../server/order.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { id } = keys();
    const { items, customer } = req.body || {};
    const bad = validateCustomer(customer);
    if (bad) return res.status(400).json({ error: bad });
    const priced = priceCart(items);
    const receipt = 'ATELIER-' + crypto.randomBytes(3).toString('hex').toUpperCase();
    const order = await rz('POST', '/orders', {
      amount: Math.round(priced.total * 100), currency: 'INR', receipt, payment_capture: 1,
      notes: { name: customer.name.trim(), email: customer.email.trim(), phone: customer.phone.trim(), subtotal: String(priced.subtotal), delivery: String(priced.delivery), items: priced.lines.join('; ').slice(0, 250) },
    });
    return res.status(200).json({ keyId: id, orderId: order.id, amount: order.amount, currency: order.currency, receipt, subtotal: priced.subtotal, delivery: priced.delivery, total: priced.total });
  } catch (e) {
    if (!e.status) console.error(e);
    return res.status(e.status || 500).json({ error: e.status ? e.message : 'Could not start payment. Please try again.' });
  }
}
