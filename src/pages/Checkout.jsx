import {useRef,useState} from 'react';import {Link,Navigate,useLocation,useNavigate} from 'react-router-dom';import {CheckCircle2,XCircle,Loader2,Lock} from 'lucide-react';
import {useCart} from '../context/CartContext.jsx';import SafeImage from '../components/SafeImage.jsx';import {formatPrice as $} from '../utils/productUtils.js';import {loadRazorpay} from '../utils/razorpay.js';

const STATES=['Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh','Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal','Andaman and Nicobar Islands','Chandigarh','Dadra and Nagar Haveli and Daman and Diu','Delhi','Jammu and Kashmir','Ladakh','Lakshadweep','Puducherry'];
const EMPTY={name:'',email:'',phone:'',address:'',city:'',state:'',pincode:''};
const validate=f=>{const e={},v=k=>f[k].trim();
 if(v('name').length<2)e.name='Enter your full name';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v('email')))e.email='Enter a valid email address';
 if(!/^[6-9]\d{9}$/.test(v('phone')))e.phone='Enter a valid 10-digit mobile number';
 if(v('address').length<5)e.address='Enter your address';
 if(v('city').length<2)e.city='Enter your city';
 if(!f.state)e.state='Select your state';
 if(!/^[1-9]\d{5}$/.test(v('pincode')))e.pincode='Enter a valid 6-digit pincode';
 return e};
const post=async(url,body)=>{const r=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Something went wrong. Please try again.');return d};

// Defined at module level so its identity is stable across renders (defining it inside Checkout remounts every input on each keystroke).
function Field({ctl,k,label,type='text',children,...r}){const {form,set,show,touch}=ctl;const err=show(k);
 return <div><label htmlFor={k} className="mb-1 block text-sm font-medium">{label}</label>{children||<input id={k} type={type} value={form[k]} onChange={set(k)} onBlur={()=>touch(k)} aria-invalid={!!err} aria-describedby={`${k}-e`} className={`input ${err?'border-red-500':''}`} {...r}/>}<p id={`${k}-e`} role={err?'alert':undefined} className="mt-1 min-h-4 text-xs text-red-600">{err||''}</p></div>}

export function Summary({items,subtotal,delivery,total}){const Row=({l,v,b})=><div className={`flex justify-between ${b?'border-t pt-3 text-lg font-bold':''}`}><span>{l}</span><span>{v}</span></div>;
 return <><ul className="divide-y">{items.map(i=><li key={i.key||i.id+i.size+i.color} className="flex gap-3 py-3"><SafeImage src={i.image} alt={i.name} className="h-16 w-14 rounded-lg"/><div className="flex-1 text-sm"><p className="font-medium">{i.name}</p><p className="text-xs text-ink/50">{[i.size&&`Size ${i.size}`,i.color,`Qty ${i.qty}`].filter(Boolean).join(' · ')}</p><p className="text-xs text-ink/50">{$(i.price)} each</p></div><span className="text-sm font-bold">{$(i.price*i.qty)}</span></li>)}</ul>
 <div className="mt-3 space-y-2"><Row l="Subtotal" v={$(subtotal)}/><Row l="Delivery" v={delivery?$(delivery):'FREE'}/><Row b l="Total" v={$(total)}/></div></>}

export default function Checkout(){const c=useCart();const nav=useNavigate();
 const [form,setForm]=useState(EMPTY);const [touched,setTouched]=useState({});const [busy,setBusy]=useState(false);const [error,setError]=useState('');const lock=useRef(false);const failure=useRef('');
 const errors=validate(form);const show=k=>touched[k]&&errors[k];
 const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
 const ctl={form,set,show,touch:k=>setTouched(t=>({...t,[k]:true}))};
 if(!c.items.length)return <div className="container-x py-24 text-center"><h1 className="h-display text-3xl">Your cart is empty</h1><p className="mt-2 text-ink/60">Add something you like before checking out.</p><Link to="/shop" className="btn-primary mt-6">Continue Shopping</Link></div>;

 const finish=(order,snap)=>{const data={order,...snap};try{sessionStorage.setItem('lastOrder',JSON.stringify(data))}catch{}nav('/order-success',{replace:true,state:data});c.clear()};
 const pay=async()=>{if(lock.current)return;setTouched(Object.fromEntries(Object.keys(EMPTY).map(k=>[k,true])));if(Object.keys(errors).length){setError('Please fix the highlighted fields.');return}
  lock.current=true;setBusy(true);setError('');failure.current='';
  const release=()=>{lock.current=false;setBusy(false)};
  try{if(!(await loadRazorpay()))throw new Error('Could not load the payment window. Check your connection and try again.');
   const customer=Object.fromEntries(Object.entries(form).map(([k,v])=>[k,v.trim()]));
   const o=await post('/api/create-order',{items:c.items.map(({id,qty,size,color})=>({id,qty,size,color})),customer});
   const snap={items:c.items,customer};
   const rzp=new window.Razorpay({key:o.keyId,order_id:o.orderId,amount:o.amount,currency:o.currency,name:'Atelier',description:`Order ${o.receipt}`,prefill:{name:customer.name,email:customer.email,contact:customer.phone},theme:{color:'#15332a'},
    handler:async r=>{try{const v=await post('/api/verify-payment',r);finish(v,snap)}catch(e){nav('/payment-failed',{state:{message:`${e.message} If money was deducted, contact us with payment ID ${r.razorpay_payment_id}.`}});release()}},
    modal:{ondismiss:()=>{release();if(failure.current)nav('/payment-failed',{state:{message:failure.current}});else setError('Payment was cancelled. Your cart is safe — you can try again.')}}});
   rzp.on('payment.failed',r=>{failure.current=r?.error?.description||'Your payment could not be completed.'});
   rzp.open();
  }catch(e){setError(e.message||'Could not start payment.');release()}};

 return <div className="container-x py-10"><h1 className="h-display mb-6 text-3xl">Checkout</h1>
 <div className="grid gap-8 lg:grid-cols-[1fr_380px]"><form noValidate onSubmit={e=>{e.preventDefault();pay()}} className="space-y-6">
  <section className="rounded-2xl bg-white p-6"><h2 className="mb-4 font-medium">Customer information</h2><div className="grid gap-x-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field ctl={ctl} k="name" label="Full name" autoComplete="name"/></div><Field ctl={ctl} k="email" label="Email" type="email" autoComplete="email"/><Field ctl={ctl} k="phone" label="Phone number" type="tel" inputMode="numeric" maxLength={10} autoComplete="tel-national" placeholder="10-digit mobile"/></div></section>
  <section className="rounded-2xl bg-white p-6"><h2 className="mb-4 font-medium">Shipping address</h2><div className="grid gap-x-4 sm:grid-cols-2"><div className="sm:col-span-2"><Field ctl={ctl} k="address" label="Address" autoComplete="street-address"/></div><Field ctl={ctl} k="city" label="City" autoComplete="address-level2"/>
   <Field ctl={ctl} k="state" label="State"><select id="state" value={form.state} onChange={set('state')} onBlur={()=>setTouched(t=>({...t,state:true}))} aria-invalid={!!show('state')} className={`input ${show('state')?'border-red-500':''}`}><option value="">Select state</option>{STATES.map(s=><option key={s}>{s}</option>)}</select></Field>
   <Field ctl={ctl} k="pincode" label="Pincode" inputMode="numeric" maxLength={6} autoComplete="postal-code"/></div></section>
  {error&&<p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
  <button type="submit" disabled={busy} className="btn-primary w-full py-3.5 text-base lg:hidden">{busy?<><Loader2 className="animate-spin" size={18}/>Processing...</>:<><Lock size={16}/>Pay Now · {$(c.total)}</>}</button></form>
 <aside className="h-fit space-y-3 rounded-2xl bg-white p-6 lg:sticky lg:top-24"><h2 className="font-medium">Order summary</h2><Summary items={c.items} subtotal={c.subtotal} delivery={c.delivery} total={c.total}/>
  {c.delivery>0&&<p className="text-xs text-ink/60">Add {$(999-c.subtotal)} more for free delivery.</p>}
  <button type="button" onClick={pay} disabled={busy} className="btn-primary hidden w-full py-3.5 text-base lg:inline-flex">{busy?<><Loader2 className="animate-spin" size={18}/>Processing...</>:<><Lock size={16}/>Pay Now</>}</button>
  <p className="text-center text-xs text-ink/50">Secure payment via Razorpay · UPI, Cards, Net Banking</p><Link to="/cart" className="block text-center text-sm underline">Back to cart</Link></aside></div></div>}

export function OrderSuccess(){const {state}=useLocation();let d=state;if(!d){try{d=JSON.parse(sessionStorage.getItem('lastOrder'))}catch{}}
 if(!d?.order)return <Navigate to="/shop" replace/>;const {order:o,items,customer}=d;
 return <div className="container-x max-w-2xl py-16"><div className="rounded-3xl bg-white p-8 text-center"><CheckCircle2 size={56} className="mx-auto text-brand"/><h1 className="h-display mt-4 text-3xl">Payment Successful</h1><p className="mt-1 font-medium text-brand">Order Confirmed</p><p className="mt-3 text-ink/70">Thank you for your order, {(o.name||customer?.name||'').split(' ')[0]}!</p>
 <dl className="mt-6 space-y-2 text-left text-sm"><div className="flex justify-between"><dt className="text-ink/60">Order ID</dt><dd className="font-medium">{o.orderRef}</dd></div><div className="flex justify-between"><dt className="text-ink/60">Payment ID</dt><dd className="break-all font-medium">{o.paymentId}</dd></div><div className="flex justify-between"><dt className="text-ink/60">Delivery</dt><dd>{o.delivery?$(o.delivery):'FREE'}</dd></div><div className="flex justify-between border-t pt-2 text-base font-bold"><dt>Amount Paid</dt><dd>{$(o.amount)}</dd></div></dl>
 {items&&<div className="mt-6 text-left"><h2 className="mb-1 font-medium">Order summary</h2><Summary items={items} subtotal={o.subtotal} delivery={o.delivery} total={o.amount}/></div>}
 {customer&&<p className="mt-4 text-left text-sm text-ink/70">Shipping to {customer.name}, {customer.address}, {customer.city}, {customer.state} {customer.pincode}. Estimated delivery in 3–5 days.</p>}
 <Link to="/shop" className="btn-primary mt-8">Continue Shopping</Link></div></div>}

export function PaymentFailed(){const {state}=useLocation();
 return <div className="container-x max-w-xl py-20 text-center"><XCircle size={56} className="mx-auto text-red-600"/><h1 className="h-display mt-4 text-3xl">Payment Failed</h1><p className="mt-2 text-ink/70">{state?.message||'Your payment could not be completed.'}</p><p className="mt-1 text-ink/70">Your cart has been preserved.</p><div className="mt-8 flex justify-center gap-3"><Link to="/checkout" className="btn-primary">Try Again</Link><Link to="/cart" className="btn-outline">Back to Cart</Link></div></div>}
