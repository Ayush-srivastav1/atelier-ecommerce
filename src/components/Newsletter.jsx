import {useState} from 'react';
export default function Newsletter(){const [done,setDone]=useState(false);
return <section className="container-x mt-20"><div className="rounded-3xl bg-brand p-8 text-center text-white sm:p-14"><h2 className="h-display text-3xl">Get 10% off your first order</h2><p className="mt-2 text-white/70">New drops and grooming tips, twice a month.</p>
{done?<p className="mt-6 font-medium">Thanks — check your inbox.</p>:<form onSubmit={e=>{e.preventDefault();setDone(true)}} className="mx-auto mt-6 flex max-w-md gap-2"><label className="sr-only" htmlFor="nl">Email</label><input id="nl" type="email" required placeholder="you@example.com" className="input text-ink"/><button className="btn bg-sand text-ink hover:bg-white">Subscribe</button></form>}</div></section>}
