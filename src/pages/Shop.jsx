import {useSearchParams} from 'react-router-dom';import ProductListing from '../components/ProductListing.jsx';
export default function Shop({search}){const [p]=useSearchParams();const q=search?p.get('q')||'':'';
return <ProductListing key={search?`search:${q}`:'shop'} q={q} title={search?`Results for “${q}”`:'Shop all'}/>}
