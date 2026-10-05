let pending;
export function loadRazorpay(){if(window.Razorpay)return Promise.resolve(true);
 pending??=new Promise(r=>{const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/checkout.js';s.onload=()=>r(true);s.onerror=()=>{pending=null;r(false)};document.body.appendChild(s)});return pending;}
