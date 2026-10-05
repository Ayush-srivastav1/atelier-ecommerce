import {defineConfig,loadEnv} from 'vite';import react from '@vitejs/plugin-react';
// Dev only: serves /api/* from ./api so `npm run dev` works without the Vercel CLI. Not used in production builds.
const devApi=mode=>({name:'dev-api',configureServer(server){Object.assign(process.env,loadEnv(mode,process.cwd(),''));
 server.middlewares.use('/api',async(req,res,next)=>{try{const name=req.url.split('?')[0].replace(/^\/|\/$/g,'');if(!/^[a-z-]+$/.test(name))return next();
  const chunks=[];for await(const c of req)chunks.push(c);const raw=Buffer.concat(chunks).toString();try{req.body=raw?JSON.parse(raw):{}}catch{req.body={}}
  res.status=c=>{res.statusCode=c;return res};res.json=o=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(o))};
  const mod=await server.ssrLoadModule(`/api/${name}.js`);await mod.default(req,res)}catch(e){console.error(e);res.statusCode=500;res.end(JSON.stringify({error:'Server error'}))}})}});
export default defineConfig(({mode})=>({plugins:[react(),devApi(mode)]}));
