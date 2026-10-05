// Single source of truth for the delivery rule. Used by the cart UI AND by the payment API.
export const FREE_DELIVERY_MIN = 999;
export const DELIVERY_CHARGE = 150;
export const deliveryFor = (subtotal) => (subtotal <= 0 || subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_CHARGE);
export const totalsFor = (subtotal) => { const delivery = deliveryFor(subtotal); return { subtotal, delivery, total: subtotal + delivery }; };
