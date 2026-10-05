import {Star} from 'lucide-react';
export default function Rating({value,count}){return <div className="flex items-center gap-1 text-xs" aria-label={`Rated ${value} out of 5`}><Star size={14} className="fill-sand text-sand"/><span className="font-medium">{value}</span>{count!=null&&<span className="text-ink/50">({count})</span>}</div>}
