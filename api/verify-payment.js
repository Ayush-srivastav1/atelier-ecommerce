import crypto from 'node:crypto';
import { rz, keys, httpError } from '../server/razorpay.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { secret } = keys();
    const { razorpay_order_id: oid, razorpay_payment_id: pid, razorpay_signature: sig } = req.body || {};
    if ([oid, pid, sig].some((v) => typeof v !== 'string' || !v)) throw httpError(400, 'Invalid payment response.');
    const expected = crypto.createHmac('sha256', secret).update(`${oid}|${pid}`).digest('hex');
    const a = Buffer.from(expected), b = Buffer.from(sig);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw httpError(400, 'Payment verification failed.');
    const payment = await rz('GET', `/payments/${encodeURIComponent(pid)}`);
    if (payment.order_id !== oid || !['captured', 'authorized'].includes(payment.status)) throw httpError(400, 'Payment was not completed.');
    const order = await rz('GET', `/orders/${encodeURIComponent(oid)}`);
    const n = order.notes || {};
    return res.status(200).json({ verified: true, orderRef: order.receipt, orderId: oid, paymentId: pid, amount: order.amount / 100, subtotal: Number(n.subtotal), delivery: Number(n.delivery), name: n.name, email: n.email });
  } catch (e) {
    if (!e.status) console.error(e);
    return res.status(e.status || 500).json({ error: e.status ? e.message : 'Verification failed. Please contact support.' });
  }
}
