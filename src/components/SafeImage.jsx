import {useState} from 'react';
const fallback=l=>'data:image/svg+xml;utf8,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><rect width="400" height="500" fill="#dfe6e1"/><text x="200" y="270" font-size="120" text-anchor="middle" fill="#15332a" opacity=".35" font-family="serif">${(l||'A')[0]}</text></svg>`);
export default function SafeImage({src,alt,className=''}){const [bad,setBad]=useState(!src);
return <img src={bad?fallback(alt):src} alt={alt} loading="lazy" onError={()=>setBad(true)} className={`object-cover ${className}`}/>}
