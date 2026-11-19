/* ================= EXPORT HELPERS (Excel + PDF libraries load only when needed) ================= */
const LIB={xlsx:'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js',pdf:'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'};
const _libs={};
function loadScript(src,ready){
  if(ready()) return Promise.resolve();
  return _libs[src]||(_libs[src]=new Promise((res,rej)=>{const s=document.createElement('script'); s.src=src; s.onload=()=>res(); s.onerror=()=>{delete _libs[src]; rej(new Error('load'));}; document.head.appendChild(s);}));
}
const fileStamp=()=>DEMO_TODAY;
const scopeText=(F,sn)=>(F.month==='all'?'All months':monthLabel(F.month))+' · '+(F.site==='all'?'All centres':sn(F.site));
async function exportXlsx(filename,sheets,toast){
  try{await loadScript(LIB.xlsx,()=>!!window.XLSX);}catch(e){toast('Could not load the Excel tool. Check your internet connection.'); return;}
  const wb=XLSX.utils.book_new();
  sheets.forEach(s=>{
    const aoa=[[s.title||s.name],[],s.headers,...s.rows];
    const ws=XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols']=s.headers.map((h,i)=>({wch:Math.min(42,Math.max(String(h).length,...s.rows.slice(0,300).map(r=>String(r[i]==null?'':r[i]).length))+2)}));
    XLSX.utils.book_append_sheet(wb,ws,s.name.replace(/[\\/?*[\]:]/g,'-').slice(0,31));
  });
  const buf=XLSX.write(wb,{bookType:'xlsx',type:'array'});
  const r=await saveFile(filename,new Blob([buf]));
  toast(r==='saved'?'Excel file ready':r==='declined'?'Download cancelled':'This browser blocked the download');
}
const xVal=v=>typeof v==='boolean'?(v?'Yes':'No'):(v==null?'':v);
function XlsxBtn({onClick,label='Excel'}){return html`<button className="btn sm xbtn" onClick=${onClick} title="Download as Excel"><${Icon} n="download" s=${14}/>${label}</button>`;}

/* ================= VEHICLE 360 ================= */
function VLink({v}){
  const {openVehicle}=useApp();
  if(!v) return html`<span>—</span>`;
  return html`<button className="vlink" onClick=${e=>{e.stopPropagation();openVehicle(v);}} title=${'Open '+v+' in Vehicle 360'}>${v}</button>`;
}
function VehicleDrawer({code,onClose}){
  const app=useApp(); const {data,derived,th,sn,go,months,openVehicle}=app; const F=useF();
  const [scope,setScope]=useState(F.month==='all'?'all':F.month);
  useEffect(()=>{const k=e=>{if(e.key==='Escape') onClose();}; window.addEventListener('keydown',k); return ()=>window.removeEventListener('keydown',k);},[]);
  const v=data.vehicles.find(x=>x.vehicle===code);
  if(!v) return null;
  const inS=d=>scope==='all'||monthOf(d)===scope;
  const trips=derived.trips.filter(t=>t.vehicle===code&&inS(t.date)).sort((a,b)=>a.date<b.date?1:-1);
  const fuel=derived.fuel.filter(f=>f.vehicle===code&&inS(f.date)).sort((a,b)=>a.date<b.date?-1:1);
  const costs=data.cost.filter(c=>c.vehicle===code&&inS(c.date)).sort((a,b)=>a.date<b.date?1:-1);
  const pm=derived.pm.find(p=>p.vehicle===code);
  const lane=LANES.find(l=>l.site===v.site);
  const rev=sum(trips,x=>x.revenue), net=sum(trips,x=>x.net), mg=rev?net/rev*100:0;
  const peers=derived.trips.filter(t=>t.site===v.site&&inS(t.date)); const peerMg=sum(peers,x=>x.revenue)?sum(peers,x=>x.net)/sum(peers,x=>x.revenue)*100:0;
  const fw=fuel.length?fuel.filter(x=>x.status==='within').length/fuel.length*100:0; const over=fuel.filter(x=>x.status==='above');
  const avgOver=fuel.length?sum(fuel,x=>x.litres/x.target)/fuel.length*100-100:0;
  const byCat=COST_CATS.map(c=>({c,amt:sum(costs.filter(x=>x.category===c.k),x=>x.amount)})).filter(x=>x.amt>0).sort((a,b)=>b.amt-a.amt);
  const mates=data.vehicles.filter(x=>x.site===v.site).map(x=>x.vehicle); const idx=mates.indexOf(code);
  const fData=fuel.map(x=>({l:fmtDay(x.date),litres:x.litres,target:x.target,st:x.status}));
  const ins=[
    trips.length?`Earned ${money(rev)} from ${trips.length} trips at a ${pct(mg)} margin — ${mg>=peerMg?'above':'below'} the ${sn(v.site)} average of ${pct(peerMg)}.`:'No trips in this period.',
    over.length>=3?`Went above the fuel range ${over.length} times (${pct(avgOver)} over on average). Book an injector and tyre-pressure check.`:fuel.length?`Fuel is under control: ${pct(fw,0)} of fills within target.`:null,
    pm?(pm.status==='overdue'?`Service is overdue by ${num(-pm.left)} km — book it before the next trip.`:pm.status==='soon'?`Service due in ${num(pm.left)} km; combine it with any open repair.`:`Next service in ${num(pm.left)} km (about ${fmtDay(pm.dueDate)}).`):null];
  const dot=p=>{const {cx,cy,payload}=p; if(cx==null) return null; return html`<circle key=${cx} cx=${cx} cy=${cy} r=${4} fill=${FUEL_ST[payload.st].c} stroke="#fff" strokeWidth=${1.5}/>`;};
  return html`<div className="drawer-bg" onClick=${e=>{if(e.target===e.currentTarget) onClose();}}>
    <aside className="drawer" role="dialog" aria-modal="true" aria-label=${'Vehicle 360: '+code}>
      <div className="dhead">
        <div className="row" style=${{gap:12,alignItems:'flex-start'}}>
          <span className="dicon"><${Icon} n="truck" s=${22}/></span>
          <div style=${{flex:1,minWidth:0}}><div className="crumb" style=${{marginBottom:2}}>Vehicle 360</div><h2>${code}</h2><div className="muted sm">${v.make} · ${sn(v.site)}, ${CEN[v.site].st} · ${laneShort(lane.k)}</div></div>
          <div className="row" style=${{gap:2}}><button className="ibtn" aria-label="Previous vehicle" disabled=${idx<=0} onClick=${()=>openVehicle(mates[idx-1])}><${Icon} n="cup" s=${18}/></button><button className="ibtn" aria-label="Next vehicle" disabled=${idx>=mates.length-1} onClick=${()=>openVehicle(mates[idx+1])}><${Icon} n="cdown" s=${18}/></button><button className="ibtn" aria-label="Close" onClick=${onClose}><${Icon} n="x" s=${20}/></button></div>
        </div>
        <div className="seg alt" style=${{marginTop:12}}>${[...months,'all'].map(m=>html`<button key=${m} className=${scope===m?'on':''} onClick=${()=>setScope(m)}>${m==='all'?'All':monthShort(m)}</button>`)}</div>
      </div>
      <div className="dbody">
        <div className="dkpis">
          <div><span>Trips</span><b>${trips.length}</b></div>
          <div><span>Revenue</span><b>${money(rev)}</b></div>
          <div><span>Net profit</span><b style=${{color:net<0?th.bad:undefined}}>${money(net)}</b><small>${pct(mg)} margin</small></div>
          <div><span>Fuel within</span><b style=${{color:fw>=80?th.good:fw>=60?th.warn:th.bad}}>${pct(fw,0)}</b><small>${fuel.length} fills</small></div>
        </div>
        <${Insight} items=${ins}/>
        <h4 className="dsec">Diesel per trip <span className="muted xs">· target ${lane.target} L on ${laneShort(lane.k)}</span></h4>
        ${fData.length?html`<${ResponsiveContainer} width="100%" height=${170}><${LineChart} data=${fData} margin=${{top:8,right:8,left:-22,bottom:0}}>
          <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)} minTickGap=${18}/><${YAxis} ...${axis(th)} domain=${[Math.floor(Math.min(lane.target,...fData.map(x=>x.litres))*.96),Math.ceil(Math.max(lane.target,...fData.map(x=>x.litres))*1.03)]}/>
          <${Tooltip} content=${tipOf((x,k,p)=>num(x)+' L · '+FUEL_ST[p.st].l)}/><${ReferenceLine} y=${lane.target} stroke=${th.muted} strokeDasharray="4 4"/>
          <${Line} dataKey="litres" name="Litres" stroke=${th.accent} strokeWidth=${2} dot=${dot} activeDot=${{r:6}} isAnimationActive=${false}/><//><//>`:html`<${Empty} t="No diesel fills in this period."/>`}
        <h4 className="dsec">Service</h4>
        ${pm?html`<div className="dbox"><div className="row"><${Pill} t=${PM_ST[pm.status].l} c=${PM_ST[pm.status].c}/><span className="muted sm">${pct(pm.used,0)} of the ${num(pm.intervalKm)} km interval used</span></div><div style=${{margin:'8px 0'}}><${Prog} v=${pm.used} c=${PM_ST[pm.status].c}/></div>
          <div className="dgrid"><div><span>Odometer</span><b>${num(pm.odometer)} km</b></div><div><span>Last service</span><b>${fmtDay(pm.lastServiceDate)}</b></div><div><span>Next due at</span><b>${num(pm.dueKm)} km</b></div><div><span>Km left</span><b style=${{color:pm.left<0?th.bad:undefined}}>${num(pm.left)}</b></div></div></div>`:html`<${Empty}/>`}
        <h4 className="dsec">Costs on this vehicle</h4>
        ${byCat.length?html`<div className="alist">${byCat.map(x=>html`<div key=${x.c.k} className="aitem" style=${{display:'grid',gridTemplateColumns:'28px 1fr 90px',gap:10}}><span className="ai" style=${{background:'var(--soft)',color:'var(--accent)',width:28,height:28}}><${Icon} n=${x.c.i} s=${14}/></span><span>${x.c.l}<br/><span className="muted xs">${costs.filter(c=>c.category===x.c.k).map(c=>c.head).filter((h,i,a)=>a.indexOf(h)===i).slice(0,3).join(', ')}</span></span><b className="num" style=${{textAlign:'right'}}>${money(x.amt)}</b></div>`)}</div>`:html`<${Empty} t="No costs booked to this vehicle in this period."/>`}
        <h4 className="dsec">Recent trips</h4>
        ${trips.length?html`<div className="tw"><table className="t"><thead><tr><th>Date</th><th>Client</th><th className="r">Freight</th><th className="r">Profit</th></tr></thead><tbody>${trips.slice(0,8).map(t=>html`<tr key=${t.id}><td>${fmtDay(t.date)}</td><td>${t.client}</td><td className="r">${money(t.freight)}</td><td className="r" style=${{color:t.net<0?th.bad:undefined,fontWeight:600}}>${money(t.net)}</td></tr>`)}</tbody></table></div>`:html`<${Empty}/>`}
        <div className="row wrap" style=${{marginTop:16,gap:8}}>
          <button className="btn" onClick=${()=>{onClose();go('maintenance');}}><${Icon} n="wrench" s=${15}/>Service register</button>
          <button className="btn" onClick=${()=>exportXlsx(code+' Vehicle 360 '+fileStamp()+'.xlsx',[
            {name:'Trips',title:code+' · trips · '+(scope==='all'?'all months':monthLabel(scope)),headers:['Date','Client','Freight','Other income','Trip cost','Repair share','Net profit'],rows:trips.map(t=>[t.date,t.client,t.freight,N(t.otherIncome),t.cost,Math.round(t.repair),Math.round(t.net)])},
            {name:'Diesel',title:code+' · diesel fills',headers:['Date','Lane','Litres','Target','Status'],rows:fuel.map(f=>[f.date,laneShort(f.route),f.litres,f.target,FUEL_ST[f.status].l])},
            {name:'Costs',title:code+' · costs',headers:['Date','Category','Head','Amount','Reference','Status'],rows:costs.map(c=>[c.date,CAT[c.category].l,c.head,c.amount,c.ref,c.status])}],app.toast)}><${Icon} n="download" s=${15}/>Excel</button>
        </div>
      </div>
    </aside></div>`;
}

/* ================= GUIDED TOUR ================= */
const TOUR=[
  {page:'dashboard',sel:'.hero',t:'Fleet health in one number',b:'Five signals — moving, fuel, cost, service and market — roll into one score. Click any bar on the right to see what drives it.'},
  {page:'dashboard',sel:'.kpis',t:'Headline cards',b:'Each card shows the number, its trend and a colour status. Click a card to open its module. As Owner you can drag them into your own order.'},
  {page:'dashboard',sel:'.netgrid',t:'Our network',b:'Seven centres and 250 vehicles across East India. Hover a centre for details, click it and the whole app focuses on that centre.'},
  {page:'dashboard',sel:'.fbar-in',t:'Filters that follow you',b:'Pick a month and a centre once. Every page and chart stays in sync.'},
  {page:'fuel',sel:'.heat',t:'Spot exceptions in seconds',b:'Each square is one lane on one day. Red means a fill went more than 8% over target. Click a square to see the vehicles.'},
  {page:'fuel',sel:'.vlink',t:'Vehicle 360',b:'Click any vehicle code, anywhere in the app, to see its trips, diesel, repairs, service and profit in one panel.'},
  {page:'fuel',sel:'.phead .seg',t:'Analytics or Data Entry',b:'Every module has a spreadsheet-style sheet. Blue cells are typed; grey cells calculate themselves.'},
  {page:'fuel',sel:'.rbtn',t:'Reports and Excel',b:'Download a one-page monthly management report as PDF, or any table as Excel.'},
  {page:'fuel',sel:'.role',t:'Roles and approvals',b:'Switch to Guest and make a change — it waits in Pending Changes until the Owner approves it.'},
  {page:'fuel',sel:'.askfab',t:'Ask FleetSight',b:'Ask questions in plain English. It checks the live numbers, searches 17 company documents and shows exactly how it reached the answer. That’s the tour — enjoy exploring!'}];
const TOUR_KEY='fleetsight-tour-done';
function Tour({onClose}){
  const {go}=useApp(); const [i,setI]=useState(0); const [rect,setRect]=useState(null); const card=useRef();
  const st=TOUR[i];
  const measure=useCallback(()=>{const el=document.querySelector(st.sel); if(!el){setRect(null);return;} const r=el.getBoundingClientRect(); if(!r.width||!r.height){setRect(null);return;} setRect({x:r.left,y:r.top,w:r.width,h:r.height});},[i]);
  useEffect(()=>{let t1,t2; setRect(null);
    if(pageFromHash()!==st.page) go(st.page);
    t1=setTimeout(()=>{const el=document.querySelector(st.sel); if(el){const r=el.getBoundingClientRect(); if(r.height<window.innerHeight*.7) el.scrollIntoView({block:'center',behavior:'smooth'}); else window.scrollTo({top:window.scrollY+r.top-130,behavior:'smooth'});} t2=setTimeout(measure,420);},380);
    return ()=>{clearTimeout(t1);clearTimeout(t2);};},[i]);
  useEffect(()=>{const h=()=>measure(); window.addEventListener('resize',h); window.addEventListener('scroll',h,{passive:true}); return ()=>{window.removeEventListener('resize',h); window.removeEventListener('scroll',h);};},[measure]);
  const end=()=>{try{localStorage.setItem(TOUR_KEY,'1');}catch(e){} onClose();};
  useEffect(()=>{const k=e=>{if(e.key==='Escape') end(); if(e.key==='ArrowRight') setI(x=>Math.min(TOUR.length-1,x+1)); if(e.key==='ArrowLeft') setI(x=>Math.max(0,x-1));}; window.addEventListener('keydown',k); return ()=>window.removeEventListener('keydown',k);},[]);
  const pad=8, W=Math.min(340,window.innerWidth-24), mobile=window.innerWidth<640;
  let pos={left:(window.innerWidth-W)/2,top:window.innerHeight/2-90};
  if(rect&&!mobile){const below=rect.y+rect.h+pad+14, above=rect.y-pad-14-190;
    const left=clamp(rect.x+rect.w/2-W/2,12,window.innerWidth-W-12);
    if(below+190<window.innerHeight) pos={left,top:below}; else if(above>70) pos={left,top:above}; else pos={left:clamp(rect.x+rect.w-W-16,12,window.innerWidth-W-12),top:clamp(rect.y+16,80,window.innerHeight-220)};}
  return html`<div className="tour" role="dialog" aria-modal="true" aria-label="Guided tour">
    ${rect?html`<div className="tspot" style=${{left:rect.x-pad,top:rect.y-pad,width:rect.w+pad*2,height:rect.h+pad*2}}></div>`:html`<div className="tshade"></div>`}
    <div className=${'tcard'+(mobile?' tmob':'')} ref=${card} style=${mobile?null:{left:pos.left,top:pos.top,width:W}}>
      <div className="row"><span className="tstep">${i+1} of ${TOUR.length}</span><span className="sp"></span><button className="ibtn" aria-label="Close tour" onClick=${end}><${Icon} n="x" s=${16}/></button></div>
      <h3>${st.t}</h3><p>${st.b}</p>
      <div className="row"><div className="tdots">${TOUR.map((_,k)=>html`<i key=${k} className=${k===i?'on':k<i?'done':''}></i>`)}</div><span className="sp"></span>
        ${i>0?html`<button className="btn sm" onClick=${()=>setI(i-1)}>Back</button>`:html`<button className="btn sm" onClick=${end}>Skip</button>`}
        <button className="btn pri sm" onClick=${()=>i<TOUR.length-1?setI(i+1):end()}>${i<TOUR.length-1?'Next':'Finish'}</button></div>
    </div></div>`;
}

/* ================= MONTHLY MANAGEMENT REPORT ================= */
function buildReport(app,month,site){
  const {data,derived,settings,sn}=app;
  const inC=s=>site==='all'||s===site;
  const prevM=(()=>{const d=new Date(Date.UTC(+month.slice(0,4),+month.slice(5,7)-2,1)); return toISO(d).slice(0,7);})();
  const calc=m=>{
    const dr=derived.daily.filter(x=>monthOf(x.date)===m&&inC(x.site)); const fu=derived.fuel.filter(x=>monthOf(x.date)===m&&inC(x.site)); const tr=derived.trips.filter(x=>monthOf(x.date)===m&&inC(x.site));
    const co=data.cost.filter(x=>monthOf(x.date)===m&&inC(x.site)); const ct=sum(COST_CATS,c=>sum(SITES.filter(inC),s=>costTgt(settings,c.k,m,s)));
    const mk=data.market.filter(x=>monthOf(x.date)===m); const rev=sum(tr,x=>x.revenue), net=sum(tr,x=>x.net);
    return {has:dr.length+tr.length>0,mv:sum(dr,x=>x.transit)/Math.max(1,sum(dr,x=>x.deployed))*100,fw:fu.filter(x=>x.status==='within').length/Math.max(1,fu.length)*100,rev,net,mg:rev?net/rev*100:0,trips:tr.length,cost:sum(co,x=>x.amount),ct,cvt:ct?sum(co,x=>x.amount)/ct*100:0,fill:sum(mk,x=>x.placements)/Math.max(1,sum(mk,x=>x.bookings))*100};
  };
  const cur=calc(month), prev=calc(prevM);
  const pmAll=derived.pm.filter(x=>inC(x.site));
  const kpis=[
    {l:'Revenue',v:money(cur.rev),d:prev.has?pct((cur.rev/Math.max(1,prev.rev)-1)*100)+' vs last month':'',good:cur.rev>=prev.rev},
    {l:'Net trip profit',v:money(cur.net),d:'Margin '+pct(cur.mg),good:cur.net>=0},
    {l:'Fleet moving',v:pct(cur.mv),d:prev.has?(cur.mv-prev.mv>=0?'+':'')+(cur.mv-prev.mv).toFixed(1)+' pts vs last month':'',good:cur.mv>=prev.mv},
    {l:'Fuel within target',v:pct(cur.fw),d:prev.has?(cur.fw-prev.fw>=0?'+':'')+(cur.fw-prev.fw).toFixed(1)+' pts vs last month':'',good:cur.fw>=prev.fw},
    {l:'Fleet cost vs target',v:pct(cur.cvt,0),d:money(cur.cost)+' of '+money(cur.ct),good:cur.cvt<=100},
    {l:'Market fill rate',v:pct(cur.fill),d:'Placements ÷ bookings',good:cur.fill>=88},
    {l:'Trips run',v:num(cur.trips),d:prev.has?pct((cur.trips/Math.max(1,prev.trips)-1)*100)+' vs last month':'',good:cur.trips>=prev.trips},
    {l:'Services overdue',v:num(pmAll.filter(x=>x.status==='overdue').length),d:pmAll.filter(x=>x.status==='soon').length+' more due soon',good:!pmAll.some(x=>x.status==='overdue')}];
  const centres=CENTRES.filter(c=>inC(c.k)).map(c=>{
    const dr=derived.daily.filter(x=>monthOf(x.date)===month&&x.site===c.k); const fu=derived.fuel.filter(x=>monthOf(x.date)===month&&x.site===c.k); const tr=derived.trips.filter(x=>monthOf(x.date)===month&&x.site===c.k);
    const co=sum(data.cost.filter(x=>monthOf(x.date)===month&&x.site===c.k),x=>x.amount), ct=sum(COST_CATS,k=>costTgt(settings,k.k,month,c.k)); const rev=sum(tr,x=>x.revenue);
    return {n:sn(c.k),veh:data.vehicles.filter(v=>v.site===c.k).length,mv:sum(dr,x=>x.transit)/Math.max(1,sum(dr,x=>x.deployed))*100,fw:fu.filter(x=>x.status==='within').length/Math.max(1,fu.length)*100,rev,mg:rev?sum(tr,x=>x.net)/rev*100:0,cvt:ct?co/ct*100:0};});
  const cats=COST_CATS.map(c=>{const a=sum(data.cost.filter(x=>x.category===c.k&&monthOf(x.date)===month&&inC(x.site)),x=>x.amount), t=sum(SITES.filter(inC),s=>costTgt(settings,c.k,month,s)); return {l:c.l,a,t,p:t?a/t*100:0};});
  const att=[];
  const dr=derived.daily.filter(x=>monthOf(x.date)===month&&inC(x.site));
  const bad=dr.filter(x=>!x.ok); if(bad.length) att.push(`${bad.length} daily running row(s) did not add up to trucks deployed — data quality check needed.`);
  findRepeats(dr).forEach(r=>att.push(`${sn(r.site)} reported identical figures for ${r.days} days (${fmtDay(r.from)}–${fmtDay(r.to)}).`));
  const fa=Object.entries(groupBy(derived.fuel.filter(x=>monthOf(x.date)===month&&inC(x.site)&&x.status==='above'),x=>x.vehicle)).sort((a,b)=>b[1].length-a[1].length)[0];
  if(fa&&fa[1].length>=3) att.push(`${fa[0]} went above its fuel range ${fa[1].length} times — injector and driver check advised.`);
  cats.filter(c=>c.p>103).forEach(c=>att.push(`${c.l} is ${pct(c.p-100,0)} over target (${money(c.a)} against ${money(c.t)}).`));
  const po=pmAll.filter(x=>x.status==='overdue').length; if(po) att.push(`${po} vehicle(s) are overdue for service.`);
  const lowC=[...centres].sort((a,b)=>a.mv-b.mv)[0]; if(lowC&&centres.length>1) att.push(`${lowC.n} had the lowest moving rate at ${pct(lowC.mv)}.`);
  return {month,site,scope:monthLabel(month)+' · '+(site==='all'?'All centres':sn(site)),kpis,centres,cats,att:att.slice(0,7)};
}
async function reportPdf(R,toast){
  try{await loadScript(LIB.pdf,()=>!!(window.jspdf&&window.jspdf.jsPDF));}catch(e){toast('Could not load the PDF tool. Check your internet connection.'); return;}
  const P=s=>String(s).replace(/₹/g,'Rs ').replace(/[−–—]/g,'-').replace(/→/g,'>').replace(/[’‘]/g,"'").replace(/[“”]/g,'"').replace(/·/g,'|').replace(/÷/g,'/');
  const doc=new window.jspdf.jsPDF({unit:'mm',format:'a4'}); const W=210, M=14;
  const teal=[6,78,90], mint=[20,184,166], text=[11,60,73], muted=[91,124,133], line=[225,235,235];
  doc.setFillColor(...teal); doc.rect(0,0,W,30,'F'); doc.setFillColor(...mint); doc.rect(0,30,W,1.2,'F');
  doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(17); doc.text('FleetSight',M,13);
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.text('Monitor. Analyse. Improve.',M,19);
  doc.setFont('helvetica','bold'); doc.setFontSize(12); doc.text('Monthly Management Report',W-M,13,{align:'right'});
  doc.setFont('helvetica','normal'); doc.setFontSize(9); doc.text(P(R.scope),W-M,19,{align:'right'}); doc.text('Data up to '+P(fmtDay(DEMO_TODAY))+' 2026',W-M,24.5,{align:'right'});
  let y=40; const bw=(W-2*M-9)/4, bh=21;
  R.kpis.forEach((k,i)=>{const x=M+(i%4)*(bw+3), yy=y+Math.floor(i/4)*(bh+3);
    doc.setFillColor(247,250,250); doc.setDrawColor(...line); doc.roundedRect(x,yy,bw,bh,2,2,'FD');
    doc.setFillColor(...(k.good?[16,185,129]:[239,68,68])); doc.rect(x,yy,bw,0.9,'F');
    doc.setTextColor(...muted); doc.setFontSize(7.5); doc.setFont('helvetica','normal'); doc.text(P(k.l),x+3,yy+5.5);
    doc.setTextColor(...text); doc.setFontSize(13); doc.setFont('helvetica','bold'); doc.text(P(k.v),x+3,yy+12.5);
    doc.setFontSize(6.8); doc.setFont('helvetica','normal'); doc.setTextColor(...muted); doc.text(P(k.d).slice(0,40),x+3,yy+17.5);});
  y+=2*(bh+3)+6;
  const head=(t)=>{doc.setTextColor(...text); doc.setFont('helvetica','bold'); doc.setFontSize(10.5); doc.text(t,M,y); y+=2.5; doc.setDrawColor(...mint); doc.setLineWidth(.5); doc.line(M,y,M+18,y); doc.setLineWidth(.2); y+=5;};
  const table=(cols,rows)=>{doc.setFillColor(...teal); doc.rect(M,y-4,W-2*M,6.5,'F'); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(7.6);
    let x=M; cols.forEach(c=>{doc.text(c.l,c.r?x+c.w-2:x+2,y,{align:c.r?'right':'left'}); x+=c.w;}); y+=6;
    doc.setFont('helvetica','normal'); rows.forEach((r,ri)=>{if(ri%2){doc.setFillColor(244,248,248); doc.rect(M,y-4,W-2*M,6,'F');} let x=M; cols.forEach((c,ci)=>{const v=r[ci]; doc.setTextColor(...(v&&v.c?v.c:text)); doc.text(P(v&&v.t!=null?v.t:v),c.r?x+c.w-2:x+2,y,{align:c.r?'right':'left'}); x+=c.w;}); y+=6;}); y+=3;};
  const G=[16,150,105], A=[180,83,9], B=[220,38,38];
  head('Centres');
  table([{l:'Centre',w:38},{l:'Vehicles',w:20,r:1},{l:'Moving',w:24,r:1},{l:'Fuel within',w:26,r:1},{l:'Revenue',w:28,r:1},{l:'Net margin',w:22,r:1},{l:'Cost vs target',w:24,r:1}],
    R.centres.map(c=>[c.n,c.veh,{t:pct(c.mv),c:c.mv>=82?G:c.mv>=75?A:B},{t:pct(c.fw),c:c.fw>=80?G:c.fw>=65?A:B},money(c.rev),pct(c.mg),{t:pct(c.cvt,0),c:c.cvt<=100?G:c.cvt<=105?A:B}]));
  head('Fleet cost vs target');
  const cw=[46,30,30,22,54]; doc.setFillColor(...teal); doc.rect(M,y-4,W-2*M,6.5,'F'); doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(7.6);
  [['Category',0],['Actual',1],['Target',1],['Used',1],['',0]].reduce((x,[l,r],i)=>{doc.text(l,r?x+cw[i]-2:x+2,y,{align:r?'right':'left'}); return x+cw[i];},M); y+=6; doc.setFont('helvetica','normal');
  R.cats.forEach((c,ri)=>{if(ri%2){doc.setFillColor(244,248,248); doc.rect(M,y-4,W-2*M,6,'F');} let x=M; doc.setTextColor(...text); doc.text(c.l,x+2,y); x+=cw[0]; doc.text(P(money(c.a)),x+cw[1]-2,y,{align:'right'}); x+=cw[1]; doc.text(P(money(c.t)),x+cw[2]-2,y,{align:'right'}); x+=cw[2];
    doc.setTextColor(...(c.p<=100?G:c.p<=105?A:B)); doc.text(pct(c.p,0),x+cw[3]-2,y,{align:'right'}); x+=cw[3];
    doc.setFillColor(...line); doc.roundedRect(x+3,y-2.6,cw[4]-8,2.6,1,1,'F'); doc.setFillColor(...(c.p<=100?mint:c.p<=105?[245,158,11]:[239,68,68])); doc.roundedRect(x+3,y-2.6,(cw[4]-8)*Math.min(1,c.p/120),2.6,1,1,'F'); y+=6;}); y+=4;
  head('Needs attention');
  doc.setFontSize(8.6); doc.setFont('helvetica','normal');
  (R.att.length?R.att:['Nothing needs attention this month.']).forEach(a=>{doc.setFillColor(...mint); doc.circle(M+1.5,y-1.2,0.9,'F'); doc.setTextColor(...text); const lines=doc.splitTextToSize(P(a),W-2*M-6); doc.text(lines,M+5,y); y+=lines.length*4.4+1.2;});
  doc.setDrawColor(...line); doc.line(M,284,W-M,284); doc.setFontSize(7.5); doc.setTextColor(...muted); doc.text('FleetSight | Built by Rishabh Agarwal',M,289); doc.text('Page 1 of 1',W-M,289,{align:'right'});
  const r=await saveFile('FleetSight report '+R.month+(R.site==='all'?'':' '+R.site)+'.pdf',doc.output('blob'));
  toast(r==='saved'?'PDF report ready':r==='declined'?'Download cancelled':'This browser blocked the download');
}
function ReportModal({onClose}){
  const app=useApp(); const {filters,months,latestMonth,toast,sn}=app;
  const [m,setM]=useState(filters.month==='all'?latestMonth:filters.month); const [busy,setBusy]=useState('');
  const R=useMemo(()=>buildReport(app,m,filters.site),[app.data,app.settings,m,filters.site]);
  const dl=async k=>{setBusy(k); if(k==='pdf') await reportPdf(R,toast); else await exportXlsx('FleetSight report '+m+'.xlsx',[
      {name:'Summary',title:'FleetSight monthly report · '+R.scope,headers:['Measure','Value','Note'],rows:R.kpis.map(k=>[k.l,k.v,k.d])},
      {name:'Centres',title:'Centres · '+R.scope,headers:['Centre','Vehicles','Moving %','Fuel within %','Revenue','Net margin %','Cost vs target %'],rows:R.centres.map(c=>[c.n,c.veh,+c.mv.toFixed(1),+c.fw.toFixed(1),Math.round(c.rev),+c.mg.toFixed(1),+c.cvt.toFixed(1)])},
      {name:'Fleet cost',title:'Fleet cost vs target · '+R.scope,headers:['Category','Actual','Target','Used %'],rows:R.cats.map(c=>[c.l,c.a,c.t,+c.p.toFixed(1)])},
      {name:'Attention',title:'Needs attention · '+R.scope,headers:['Item'],rows:R.att.map(a=>[a])}],toast); setBusy('');};
  return html`<${Modal} onClose=${onClose} wide=${true}>
    <div className="row wrap" style=${{marginBottom:12}}><div style=${{flex:1}}><h3>Monthly management report</h3><p className="muted sm" style=${{margin:0}}>One page for the CMD and CFO. Uses the centre filter${filters.site==='all'?'':' ('+sn(filters.site)+')'}.</p></div><${MonthPick} value=${m} onChange=${setM} months=${months}/></div>
    <div className="rep">
      <div className="rep-h"><div><b>FleetSight</b><span>Monthly Management Report</span></div><div className="r">${R.scope}<br/><span>Data up to ${fmtDay(DEMO_TODAY)} 2026</span></div></div>
      <div className="rep-k">${R.kpis.map(k=>html`<div key=${k.l} style=${{'--kc':k.good?'#10B981':'#EF4444'}}><span>${k.l}</span><b>${k.v}</b><small>${k.d}</small></div>`)}</div>
      <h4>Centres</h4>
      <div className="tw"><table className="t"><thead><tr><th>Centre</th><th className="r">Vehicles</th><th className="r">Moving</th><th className="r">Fuel within</th><th className="r">Revenue</th><th className="r">Net margin</th><th className="r">Cost vs target</th></tr></thead>
        <tbody>${R.centres.map(c=>html`<tr key=${c.n}><td><b>${c.n}</b></td><td className="r">${c.veh}</td><td className="r" style=${{color:c.mv>=82?'#059669':c.mv>=75?'#B45309':'#DC2626'}}>${pct(c.mv)}</td><td className="r">${pct(c.fw)}</td><td className="r">${money(c.rev)}</td><td className="r">${pct(c.mg)}</td><td className="r" style=${{color:c.cvt<=100?'#059669':c.cvt<=105?'#B45309':'#DC2626',fontWeight:600}}>${pct(c.cvt,0)}</td></tr>`)}</tbody></table></div>
      <h4>Needs attention</h4>
      <ul className="rep-a">${(R.att.length?R.att:['Nothing needs attention this month.']).map((a,i)=>html`<li key=${i}>${a}</li>`)}</ul>
    </div>
    <div className="row wrap" style=${{marginTop:14}}><button className="btn pri" disabled=${!!busy} onClick=${()=>dl('pdf')}><${Icon} n="file" s=${15}/>${busy==='pdf'?'Preparing…':'Download PDF'}</button><button className="btn" disabled=${!!busy} onClick=${()=>dl('xlsx')}><${Icon} n="download" s=${15}/>${busy==='xlsx'?'Preparing…':'Excel version'}</button><span className="sp"></span><button className="btn" onClick=${onClose}>Close</button></div>
  <//>`;
}
