#!/usr/bin/env node
/* ===========================================================
   Badass Logistics — traffic landing on retired pages.

   WHY THIS EXISTS:
   The 2026 revamp retired heavy haul and turned ~148 pages into
   redirect stubs. Google did not stop ranking them. Every impression
   a stub earns is demand arriving at a page whose only job is to send
   the visitor somewhere else — the worst possible landing, because the
   ranking is real and the page is empty.

   This is the recovery list, ranked. A stub earning real impressions
   is a page that should be rebuilt as something we actually offer,
   not left to bounce.

   RUN:  node scripts/stub-traffic.js [days]
   =========================================================== */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const ROOT=path.join(__dirname,'..');
const DAYS=parseInt(process.argv[2]||'90',10);
const KEY=process.env.GSC_KEY||path.join(ROOT,'gsc-key.json');
if(!fs.existsSync(KEY)){console.error('✖ no gsc-key.json');process.exit(2);}
const key=JSON.parse(fs.readFileSync(KEY,'utf8'));
const b64=b=>Buffer.from(b).toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
const isStub=f=>{try{return fs.readFileSync(f,'utf8').includes('<!--REDIRECT-->');}catch{return false;}};
(async()=>{
  const now=Math.floor(Date.now()/1000);
  const si=`${b64(JSON.stringify({alg:'RS256',typ:'JWT'}))}.${b64(JSON.stringify({iss:key.client_email,scope:'https://www.googleapis.com/auth/webmasters.readonly',aud:'https://oauth2.googleapis.com/token',iat:now,exp:now+3600}))}`;
  const sig=crypto.createSign('RSA-SHA256').update(si).sign(key.private_key);
  const tok=(await(await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion:`${si}.${b64(sig)}`})})).json()).access_token;
  const end=new Date(Date.now()-2*864e5),start=new Date(end-DAYS*864e5);
  const d=x=>x.toISOString().slice(0,10);
  const res=await(await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent('sc-domain:badasslogistics.com')}/searchAnalytics/query`,
    {method:'POST',headers:{authorization:`Bearer ${tok}`,'content-type':'application/json'},
     body:JSON.stringify({startDate:d(start),endDate:d(end),dimensions:['page'],rowLimit:25000})})).json();
  if(res.error){console.error(res.error.message);process.exit(2);}
  const rows=res.rows||[];
  const out=[];
  for(const r of rows){
    const u=r.keys[0].replace('https://badasslogistics.com','').replace(/\/$/,'')||'/';
    for(const c of [path.join(ROOT,u.replace(/^\//,'')+'.html'),path.join(ROOT,u.replace(/^\//,''),'index.html')]){
      if(fs.existsSync(c)&&isStub(c)){out.push({u,i:Math.round(r.impressions),c:r.clicks,p:+r.position.toFixed(1)});break;}
    }
  }
  out.sort((a,b)=>b.i-a.i);
  console.log(`\n=== TRAFFIC LANDING ON RETIRED PAGES — last ${DAYS} days ===\n`);
  console.log(`${out.length} redirect stubs still earn impressions. Every one is proven demand`);
  console.log(`arriving at a page that immediately sends the visitor elsewhere.\n`);
  console.log('retired URL'.padEnd(52)+'impr'.padStart(7)+'clk'.padStart(5)+'pos'.padStart(7));
  console.log('-'.repeat(71));
  let ti=0,tc=0;
  for(const r of out.slice(0,30)){ti+=r.i;tc+=r.c;console.log(r.u.slice(0,50).padEnd(52)+String(r.i).padStart(7)+String(r.c).padStart(5)+String(r.p).padStart(7));}
  const alli=out.reduce((a,r)=>a+r.i,0), allc=out.reduce((a,r)=>a+r.c,0);
  console.log('-'.repeat(71));
  console.log(`${out.length} stubs — ${alli} impressions, ${allc} clicks total`);
  console.log(`\nRebuild the top of this list as pages we actually offer. A stub at`);
  console.log(`position 12 with 1,700 impressions is the cheapest ranking on the site.\n`);
})();
