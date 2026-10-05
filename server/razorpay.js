// Server-only helpers. Never import this file from src/.
export const httpError = (status, message) => Object.assign(new Error(message), { status });
export const keys = () => {
  const id = process.env.RAZORPAY_KEY_ID, secret = process.env.RAZORPAY_KEY_SECRET;
  if (!id || !secret) throw httpError(500, 'Payments are not configured on the server.');
  return { id, secret };
};
export async function rz(method, path, body) {
  const { id, secret } = keys();
  const r = await fetch('https://api.razorpay.com/v1' + path, {
    method,
    headers: { Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'), 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw httpError(502, data?.error?.description || 'Razorpay request failed');
  return data;
}
