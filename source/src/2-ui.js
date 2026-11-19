/* ---------- icons (lucide-style line icons, inlined) ---------- */
const ICONS={
 dash:'<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
 truck:'<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
 route:'<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
 fuel:'<line x1="3" x2="15" y1="22" y2="22"/><line x1="4" x2="14" y1="9" y2="9"/><path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18"/><path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5"/>',
 wrench:'<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
 rupee:'<path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/>',
 chart:'<line x1="12" x2="12" y1="20" y2="10"/><line x1="18" x2="18" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="16"/>',
 wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
 pie:'<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
 disc:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/>',
 parking:'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
 drop:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
 file:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
 alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
 food:'<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
 table:'<path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/>',
 approve:'<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
 sliders:'<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>',
 moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
 menu:'<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
 x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
 download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
 upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
 reset:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',
 bulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
 up:'<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
 down:'<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
 plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',
 pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
 trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
 search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
 cup:'<path d="m18 15-6-6-6 6"/>', cdown:'<path d="m6 9 6 6 6-6"/>',
 eye:'<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
 lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
 copy:'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
 calplus:'<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M12 14v4"/><path d="M10 16h4"/>',
 ok:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
 bad:'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
 clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
 grip:'<circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>',
 sight:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
 arrow:'<path d="m9 18 6-6-6-6"/>',
 spark:'<path d="M12 3v3"/><path d="M12 18v3"/><path d="m4.6 4.6 2.1 2.1"/><path d="m17.3 17.3 2.1 2.1"/><path d="M3 12h3"/><path d="M18 12h3"/><path d="m4.6 19.4 2.1-2.1"/><path d="m17.3 6.7 2.1-2.1"/>',
 help:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
 report:'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 18v-3"/><path d="M12 18v-6"/><path d="M16 18v-4"/>',
 ai:'<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
 filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>'
};
const Icon=({n,s=18,c=''})=>html`<svg className=${'ico '+c} width=${s} height=${s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" dangerouslySetInnerHTML=${{__html:ICONS[n]||''}}></svg>`;

/* ---------- theme ---------- */
const ACCENTS={teal:{a:'#14B8A6',h:'#26C6B0',h1:'#064E5A',h2:'#0A7C86',l:'Teal'},ocean:{a:'#3B82F6',h:'#60A5FA',h1:'#0B2A5B',h2:'#1D4ED8',l:'Ocean'},violet:{a:'#8B5CF6',h:'#A78BFA',h1:'#2E1065',h2:'#6D28D9',l:'Violet'},amber:{a:'#D97706',h:'#F59E0B',h1:'#4A2506',h2:'#A3520B',l:'Amber'}};
function makeTh(accent,dark){const A=ACCENTS[accent]||ACCENTS.teal; return {accent:A.a,second:dark?'#67E8F9':'#0E7490',deep:A.h1,grid:dark?'#1B3A42':'#E3EDED',muted:dark?'#8DB0B6':'#5B7C85',text:dark?'#E2F3F2':'#0B3C49',faint:dark?'#2A4A52':'#CBD9DA',good:'#10B981',warn:'#F59E0B',bad:'#EF4444',info:'#3B82F6',cursor:dark?'rgba(255,255,255,.05)':'rgba(11,60,73,.05)'};}

/* ---------- app context ---------- */
const Ctx=createContext(null);
const useApp=()=>useContext(Ctx);
function useF(){const {filters}=useApp(); return {month:filters.month,site:filters.site,m:d=>filters.month==='all'||monthOf(d)===filters.month,s:x=>filters.site==='all'||x===filters.site};}

/* ---------- small components ---------- */
function useCountUp(target,dur=750){
  const [v,setV]=useState(0); const prev=useRef(0);
  useEffect(()=>{let raf; const from=prev.current, t0=performance.now(); const to=+target||0;
    const step=t=>{const p=Math.min(1,(t-t0)/dur), e=1-Math.pow(1-p,3); setV(from+(to-from)*e); if(p<1) raf=requestAnimationFrame(step); else prev.current=to;};
    raf=requestAnimationFrame(step); return ()=>{cancelAnimationFrame(raf); prev.current=to;};},[target]);
  return v;
}
const TONE={good:'#10B981',warn:'#F59E0B',bad:'#EF4444',info:'#3B82F6'};
function Spark({data,c}){
  const id=useMemo(()=>'sg'+Math.random().toString(36).slice(2,8),[]);
  if(!data||data.length<2) return null;
  if(data.length>10){const k=4; data=data.map((_,i)=>{const a=data.slice(Math.max(0,i-k),i+1); return a.reduce((x,y)=>x+y,0)/a.length;}).slice(k);}
  const w=120,h=36, mn=Math.min(...data), mx=Math.max(...data), rg=(mx-mn)||1;
  const pts=data.map((v,i)=>[i/(data.length-1)*w, h-3-(v-mn)/rg*(h-8)]);
  const d='M'+pts.map(p=>p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' L');
  return html`<svg className="spark" viewBox=${'0 0 '+w+' '+h} preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id=${id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor=${c} stopOpacity=".26"/><stop offset="1" stopColor=${c} stopOpacity="0"/></linearGradient></defs><path d=${d+' L'+w+' '+h+' L0 '+h+' Z'} fill=${'url(#'+id+')'}/><path d=${d} fill="none" stroke=${c} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke"/></svg>`;
}
function Kpi({label,value,fmt=num,delta,deltaFmt,goodWhen='up',sub,onClick,active,tone,icon,drag,spark}){
  const v=useCountUp(value);
  let d=null;
  if(delta!=null&&isFinite(delta)){const flat=Math.abs(delta)<1e-9, up=delta>0, good=goodWhen==='up'?up:!up;
    d=html`<span className=${'delta '+(flat?'flat':good?'good':'bad')}>${flat?'':html`<${Icon} n=${up?'up':'down'} s=${11}/>`}${(deltaFmt||fmt)(Math.abs(delta))}</span>`;}
  const props=onClick?{role:'button',tabIndex:0,onClick,onKeyDown:e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();onClick();}}}:{};
  const kc=TONE[tone]||tone||null;
  return html`<div className=${'kpi'+(onClick?' click':'')+(active?' active':'')} style=${kc?{'--kc':kc}:null} ...${props} ...${drag||{}}>
    <div className="l">${icon?html`<span className="ki"><${Icon} n=${icon} s=${14}/></span>`:null}<span>${label}</span></div>
    <div className="v" title=${fmt(value)}>${fmt(v)}</div>
    <div className="s">${d}${sub?html`<span>${sub}</span>`:null}</div>
    ${spark?html`<${Spark} data=${spark} c=${kc||'var(--accent)'}/>`:null}</div>`;
}
function Card({title,sub,right,children,insight,className='',style}){
  const items=(insight||[]).filter(Boolean);
  return html`<section className=${'card '+className} style=${style}>
    ${(title||right)?html`<div className="card-h"><div>${title?html`<h3>${title}</h3>`:null}${sub?html`<p>${sub}</p>`:null}</div>${right?html`<div className="card-r">${right}</div>`:null}</div>`:null}
    ${children}
    ${items.length?html`<${Insight} items=${items}/>`:null}</section>`;
}
function Summary({items}){
  const it=items.filter(Boolean); if(!it.length) return null;
  return html`<div className="summary"><h4><${Icon} n="bulb" s=${15}/>In short</h4><ul>${it.map((x,i)=>html`<li key=${i}><span className="sdot" style=${{background:TONE[x.t]||'var(--accent)'}}></span><span>${x.s}</span></li>`)}</ul></div>`;
}
function More({label='Show records',count,children,open:o0=false}){
  const [o,setO]=useState(o0);
  return html`<div>${o?children:null}<button className="more" onClick=${()=>setO(!o)} aria-expanded=${o}><${Icon} n=${o?'cup':'cdown'} s=${15}/>${o?'Hide':label}${count!=null&&!o?' ('+num(count)+')':''}</button></div>`;
}
function Insight({items}){return html`<div className="note"><span className="ni"><${Icon} n="bulb" s=${14}/></span><span><b>What this means: </b>${items.filter(Boolean).join(' ')}</span></div>`;}
function Pill({t,c}){return html`<span className="pill" style=${{color:c,background:c+'1f'}}>${t}</span>`;}
function Prog({v,max=100,c}){const w=clamp(max?v/max*100:0,0,100); const col=c||(w>=100?'#EF4444':'var(--accent)'); return html`<div className="prog"><i style=${{width:w+'%',background:col}}></i></div>`;}
function Tick({ok}){return ok?html`<span style=${{color:'#10B981'}} title="Adds up"><${Icon} n="ok" s=${17}/></span>`:html`<span style=${{color:'#EF4444'}} title="Does not add up"><${Icon} n="bad" s=${17}/></span>`;}
function Empty({t}){return html`<div className="empty">${t||'No records for these filters. Pick another month or centre.'}</div>`;}
function Tip({active,payload,label,fmt=num,labelFmt}){
  if(!active||!payload||!payload.length) return null;
  const rows=payload.filter(p=>p.value!=null&&p.dataKey!=='_base'&&!String(p.dataKey).startsWith('_'));
  return html`<div className="tip"><div className="tip-l">${labelFmt?labelFmt(label,payload):label}</div>${rows.map((p,i)=>html`<div key=${i} className="tip-r"><span className="dot" style=${{background:p.color||p.fill||(p.payload&&p.payload._c)}}></span><span>${p.name}</span><b>${fmt(p.value,p.dataKey,p.payload)}</b></div>`)}</div>`;
}
const tipOf=(fmt,labelFmt)=>p=>html`<${Tip} ...${p} fmt=${fmt} labelFmt=${labelFmt}/>`;
function axis(th){return {tick:{fill:th.muted,fontSize:11},axisLine:false,tickLine:false};}
const grid=th=>({stroke:th.grid,strokeDasharray:'3 4',vertical:false});
function Legendish({items}){return html`<div className="legend">${items.map(it=>html`<span key=${it.l} className="legend-k"><span className="sw" style=${{background:it.c}}></span>${it.l}</span>`)}</div>`;}
const shortMoney=v=>{const a=Math.abs(v); return a>=1e7?(+(v/1e7).toFixed(1))+'Cr':a>=1e5?(a>=1e6?Math.round(v/1e5):+(v/1e5).toFixed(1))+'L':a>=1e3?(v/1e3).toFixed(0)+'k':String(Math.round(v));};

/* ---------- sortable, searchable table ---------- */
function DataTable({cols,rows,search=true,pageSize=12,onRow,selKey,initialSort,empty,right,xname}){
  const app=useApp(); const F=useF();
  const [q,setQ]=useState(''); const [sort,setSort]=useState(initialSort||null); const [n,setN]=useState(pageSize);
  const list=useMemo(()=>{let r=rows;
    if(q){const s=q.toLowerCase(); r=r.filter(x=>cols.some(c=>{if(c.nos) return false; const v=c.v?c.v(x):x[c.k]; return v!=null&&String(v).toLowerCase().includes(s);}));}
    if(sort){const c=cols.find(c=>c.k===sort.k); if(c){const g=c.v||(x=>x[c.k]); r=[...r].sort((a,b)=>{const A=g(a),B=g(b); return (A>B?1:A<B?-1:0)*sort.dir;});}}
    return r;},[rows,q,sort,cols]);
  const head=c=>{if(c.nos) return; setSort(s=>s&&s.k===c.k?(s.dir===1?{k:c.k,dir:-1}:null):{k:c.k,dir:1});};
  const canX=!!(xname||search)&&list.length>0;
  const doX=()=>{const xc=cols.filter(c=>!c.nos&&c.l); const name=xname||app.pageLabel; exportXlsx(name+' '+fileStamp()+'.xlsx',[{name,title:name+' · '+scopeText(F,app.sn),headers:xc.map(c=>c.l),rows:list.map(x=>xc.map(c=>{const v=c.ex?c.ex(x):c.k==='site'?app.sn(x.site):c.k==='route'?laneShort(x.route):c.v?c.v(x):x[c.k]; return xVal(v);}))}],app.toast);};
  return html`<div>
    ${(search||right||canX)?html`<div className="row wrap" style=${{marginBottom:8}}>${search?html`<div className="search"><${Icon} n="search" s=${14}/><input className="inp" placeholder="Search table" value=${q} onInput=${e=>{setQ(e.target.value);setN(pageSize);}}/></div>`:null}<span className="sp"></span>${right}${canX?html`<${XlsxBtn} onClick=${doX}/>`:null}</div>`:null}
    <div className="tw"><table className="t"><thead><tr>${cols.map(c=>html`<th key=${c.k} className=${(c.nos?'':'s ')+(c.r?'r':'')} onClick=${()=>head(c)} aria-sort=${sort&&sort.k===c.k?(sort.dir===1?'ascending':'descending'):'none'}>${c.l}${sort&&sort.k===c.k?html`<${Icon} n=${sort.dir===1?'cup':'cdown'} s=${12}/>`:null}</th>`)}</tr></thead>
    <tbody>${list.slice(0,n).map((x,i)=>html`<tr key=${x.id||i} className=${(onRow?'clk ':'')+(selKey&&selKey(x)?'sel':'')} onClick=${onRow?()=>onRow(x):null}>${cols.map(c=>html`<td key=${c.k} className=${(c.r?'r ':'')+(c.cls||'')}>${c.rn?c.rn(x):(c.v?c.v(x):x[c.k])}</td>`)}</tr>`)}</tbody></table>
    ${list.length?null:html`<${Empty} t=${empty}/>`}</div>
    <div className="tfoot"><span>Showing ${Math.min(n,list.length)} of ${list.length}</span>${list.length>n?html`<button className="btn sm" onClick=${()=>setN(n+pageSize*2)}>Show more</button>`:null}</div></div>`;
}

/* ---------- page header ---------- */
function ModHead({title,desc,icon,view,setView,extra,noEntry}){
  const {crumb}=useApp();
  return html`<div className="phead"><div><div className="crumb"><${Icon} n=${icon} s=${14}/>${crumb}</div><h1>${title}</h1><p>${desc}</p></div>
  <div className="row wrap">${extra}${noEntry?null:html`<div className="seg" role="tablist"><button role="tab" aria-selected=${view==='a'} className=${view==='a'?'on':''} onClick=${()=>setView('a')}><${Icon} n="chart" s=${15}/>Analytics</button><button role="tab" aria-selected=${view==='e'} className=${view==='e'?'on':''} onClick=${()=>setView('e')}><${Icon} n="table" s=${15}/>Data Entry</button></div>`}</div></div>`;
}

/* ---------- spreadsheet-style data entry ---------- */
const PM_ST={overdue:{l:'Overdue',c:'#EF4444'},soon:{l:'Due soon',c:'#F59E0B'},ok:{l:'OK',c:'#10B981'}};
const FIELD_LABELS={date:'Date',site:'Centre',deployed:'Deployed',route:'Lane',vehicle:'Vehicle',litres:'Litres',make:'Vehicle type',odometer:'Odometer',lastServiceKm:'Last service km',lastServiceDate:'Last service date',intervalKm:'Service interval km',area:'Region',bookings:'Booked',placements:'Placed',detentionHrs:'Wait hours',client:'Client',freight:'Freight',otherIncome:'Other income',allowance:'Allowance',additive:'Additive',fuel:'Fuel',routeExp:'Route expense',toll:'Toll',tripDays:'Trip days',category:'Category',head:'Cost head',amount:'Amount',qty:'Quantity',ref:'Reference',remarks:'Remarks',status:'Status',...Object.fromEntries(STATUS.map(s=>[s.k,s.l]))};
const okNum=v=>/^\d*\.?\d*$/.test(v);

function Grid({cols,rows,rkey,onSave,canEdit=true,onAdd,onDelete,toolbar,empty,pageSize=40,foot,search,note,xname}){
  const app=useApp(); const {role}=app;
  const [draft,setDraft]=useState({}); const [added,setAdded]=useState([]); const [n,setN]=useState(pageSize); const [arm,setArm]=useState(null); const [q,setQ]=useState('');
  const box=useRef();
  useEffect(()=>{setDraft({});setAdded([]);setN(pageSize);setQ('');},[rkey]);
  const val=(r,k)=>{const d=draft[r._k]; return d&&k in d?d[k]:r[k];};
  const merged=r=>{const d=draft[r._k]||{}; const o={...r}; for(const k in d){const c=cols.find(x=>x.k===k); o[k]=c&&c.t==='num'?(d[k]===''?'':+d[k]):d[k];} return o;};
  const isDirty=(r,k)=>{const d=draft[r._k]; return !!d&&k in d&&String(d[k])!==String(r[k]==null?'':r[k]);};
  const set=(r,c,v)=>{if(c.t==='num'&&!okNum(v)) return; setDraft(d=>({...d,[r._k]:{...(d[r._k]||{}),[c.k]:v}}));};
  let list=[...added,...rows];
  if(q){const s=q.toLowerCase(); list=list.filter(r=>cols.some(c=>String(c.fmt?c.fmt(r[c.k],r):r[c.k]??'').toLowerCase().includes(s)));}
  const changedRows=rows.filter(r=>cols.some(c=>isDirty(r,c.k)));
  const dirty=changedRows.length+added.length;
  const editable=(c,r)=>canEdit&&!c.calc&&!c.label&&c.edit!==false&&!(c.lock&&!r._new);
  const save=()=>{
    const changes=changedRows.map(r=>{const p={}; cols.forEach(c=>{if(isDirty(r,c.k)) p[c.k]=c.t==='num'?N(draft[r._k][c.k]):draft[r._k][c.k];}); return {row:r,patch:p};});
    const adds=added.map(r=>{const m=merged(r); cols.forEach(c=>{if(c.t==='num') m[c.k]=N(m[c.k]);}); return m;});
    onSave({changes,added:adds}); setDraft({}); setAdded([]);
  };
  const add=()=>{const r={...onAdd(),_k:'new'+uid(),_new:true}; setAdded(a=>[r,...a]); setTimeout(()=>{const el=box.current&&box.current.querySelector('[data-r="0"] input, [data-r="0"] select'); if(el) el.focus();},40);};
  const del=r=>{if(r._new){setAdded(a=>a.filter(x=>x._k!==r._k)); return;} if(arm!==r._k){setArm(r._k); setTimeout(()=>setArm(a=>a===r._k?null:a),3000); return;} setArm(null); onDelete(r);};
  const nav=(e,ri,ci)=>{let t=null; if(e.key==='Enter'||e.key==='ArrowDown') t=ri+1; else if(e.key==='ArrowUp') t=ri-1; if(t==null) return; const el=box.current.querySelector(`[data-r="${t}"] [data-c="${ci}"]`); if(el){e.preventDefault(); el.focus(); if(el.select) el.select();}};
  // two-level header
  const hasG=cols.some(c=>c.g); const top=[]; cols.forEach(c=>{const last=top[top.length-1]; if(c.g&&last&&last.g===c.g) last.span++; else top.push({g:c.g,span:1,c});});
  const shown=list.slice(0,n);
  const cell=(r,c,ri,ci)=>{
    const m=c.calc?merged(r):null;
    if(c.calc){const v=c.calc(m); return html`<td key=${c.k} className=${'gc calc'+(c.r!==false&&typeof v==='number'?' r':'')}>${c.fmt?c.fmt(v,m):(typeof v==='number'?num1(v):v)}</td>`;}
    if(c.label) return html`<th key=${c.k} scope="row" className="gl">${c.fmt?c.fmt(r[c.k],r):r[c.k]}</th>`;
    if(!editable(c,r)) return html`<td key=${c.k} className=${'gc ro'+(c.t==='num'?' r':'')}>${c.fmt?c.fmt(r[c.k],r):(r[c.k]??'—')}</td>`;
    const v=val(r,c.k); const d=isDirty(r,c.k)||r._new; const common={'data-c':ci,onKeyDown:e=>nav(e,ri,ci),'aria-label':(c.g?c.g+' ':'')+c.l};
    const opts=c.t==='select'?(typeof c.o==='function'?c.o(merged(r)):c.o):null;
    return html`<td key=${c.k} className=${'gc ed'+(d?' dirty':'')+(c.t==='num'?' r':'')}>${
      c.t==='select'?html`<select ...${common} value=${v??''} onChange=${e=>set(r,c,e.target.value)}>${(opts||[]).map(o=>html`<option key=${o} value=${o}>${c.ol?c.ol(o):o}</option>`)}</select>`:
      c.t==='bool'?html`<select ...${common} value=${v?'1':''} onChange=${e=>set(r,c,!!e.target.value)}><option value="1">Yes</option><option value="">No</option></select>`:
      html`<input ...${common} type=${c.t==='date'?'date':'text'} inputMode=${c.t==='num'?'decimal':undefined} value=${v??''} onChange=${e=>set(r,c,e.target.value)} onFocus=${e=>c.t!=='date'&&e.target.select()} placeholder=${c.t==='num'?'0':''} style=${c.w?{width:c.w}:null}/>`}</td>`;
  };
  const totals=foot?foot(list.map(merged)):null;
  const doX=()=>{const name=xname||app.pageLabel; exportXlsx(name+' '+fileStamp()+'.xlsx',[{name,title:name,headers:cols.map(c=>(c.g?c.g+' · ':'')+c.l),rows:list.map(r=>{const m=merged(r); return cols.map(c=>{let v=c.calc?c.calc(m):m[c.k]; if(c.label&&c.fmt) v=c.fmt(v,m); else if(c.ol&&!c.calc) v=c.ol(v); else if(typeof v==='number') v=Math.round(v*100)/100; return xVal(v);});})}],app.toast);};
  return html`<div>
    <div className="gbar">
      <div className="row wrap" style=${{gap:8,flex:1}}>${toolbar}${search?html`<div className="search"><${Icon} n="search" s=${14}/><input className="inp" placeholder="Search rows" value=${q} onInput=${e=>{setQ(e.target.value);setN(pageSize);}}/></div>`:null}${onAdd&&canEdit?html`<button className="btn" onClick=${add}><${Icon} n="plus" s=${15}/>Add row</button>`:null}${list.length?html`<${XlsxBtn} onClick=${doX}/>`:null}</div>
      ${canEdit?html`<div className="row" style=${{gap:8}}>${dirty?html`<span className="row" style=${{gap:8}}><span className="dirtyn"><span className="ddot"></span>${dirty} unsaved row${dirty>1?'s':''}</span><button className="btn" onClick=${()=>{setDraft({});setAdded([]);}}>Discard</button></span>`:html`<span className="muted sm">Click any blue cell to type. Enter moves down.</span>`}<button className="btn pri" disabled=${!dirty} onClick=${save}><${Icon} n="check" s=${15}/>${role==='Guest'?'Send for approval':'Save changes'}</button></div>`:html`<span className="muted sm"><${Icon} n="lock" s=${13}/> ${note||'View only for your role'}</span>`}
    </div>
    <div className="gw" ref=${box}><table className="gt">
      <thead>${hasG?html`<tr>${top.map((t,i)=>t.g?html`<th key=${i} colSpan=${t.span} className="gh1">${t.g}</th>`:html`<th key=${i} rowSpan=${2} className=${'gh1 gh0'+(t.c.label?' gl':'')}>${t.c.l}</th>`)}${onDelete&&canEdit?html`<th rowSpan=${2} className="gh1 gh0"></th>`:null}</tr>`:null}
        <tr>${cols.filter(c=>!hasG||c.g).map(c=>html`<th key=${c.k} className=${'gh2'+(c.label?' gl':'')+(c.calc?' ghc':'')}>${c.l}</th>`)}${!hasG&&onDelete&&canEdit?html`<th className="gh2"></th>`:null}</tr></thead>
      <tbody>${shown.map((r,ri)=>html`<tr key=${r._k} data-r=${ri} className=${r._new?'newrow':''}>${cols.map((c,ci)=>cell(r,c,ri,ci))}${onDelete&&canEdit?html`<td className="gc act"><button className="ibtn" title=${arm===r._k?'Click again to delete':'Delete row'} aria-label="Delete row" style=${arm===r._k?{color:'#EF4444',background:'#EF44441a'}:null} onClick=${()=>del(r)}><${Icon} n=${r._new?'x':'trash'} s=${14}/></button></td>`:null}</tr>`)}</tbody>
      ${totals?html`<tfoot><tr>${cols.map(c=>html`<td key=${c.k} className=${'gf'+(c.label?' gl':'')+(typeof totals[c.k]==='number'?' r':'')}>${c.label?'Total':totals[c.k]==null?'':typeof totals[c.k]==='number'?num1(totals[c.k]):totals[c.k]}</td>`)}${onDelete&&canEdit?html`<td className="gf"></td>`:null}</tr></tfoot>`:null}
    </table>${list.length?null:html`<${Empty} t=${empty}/>`}</div>
    ${list.length>n?html`<button className="more" onClick=${()=>setN(n+pageSize)}><${Icon} n="cdown" s=${15}/>Show ${Math.min(pageSize,list.length-n)} more of ${num(list.length-n)}</button>`:null}
    <div className="keyrow" style=${{marginTop:10}}><span className="legend-k"><span className="sw" style=${{background:'var(--typed)',border:'1px solid var(--typed-t)'}}></span>Typed value</span><span className="legend-k"><span className="sw" style=${{background:'var(--calc)',border:'1px solid var(--calc-t)'}}></span>Calculated</span><span className="legend-k"><span className="sw" style=${{background:'#FEF3C7',border:'1px solid #F59E0B'}}></span>Changed, not saved yet</span></div>
  </div>`;
}
function useSaver(module){
  const {commit,toast,role}=useApp();
  return (list)=>{list.forEach(ch=>commit({module,...ch},true)); if(list.length) toast(role==='Guest'?`${list.length} change${list.length>1?'s':''} sent to the Owner for approval`:`${list.length} change${list.length>1?'s':''} saved — charts updated`);};
}
function RecordGrid({coll,module,cols,filter,sort,onAdd,rkey,toolbar,pageSize=25,search,fix,xname}){
  const {data}=useApp(); const saveAll=useSaver(module);
  const rows=useMemo(()=>{let r=data[coll].filter(filter); if(sort) r=r.sort(sort); return r.map(x=>({...x,_k:x.id}));},[data[coll],rkey]);
  const strip=({_k,_new,...rec})=>rec;
  const onSave=({changes,added})=>saveAll([
    ...changes.map(({row,patch})=>{const b=strip(row); let rec={...b,...patch}; if(fix) rec=fix(rec); return {coll,action:'edit',record:rec,before:b};}),
    ...added.map(a=>{let rec={...strip(a),id:uid()}; if(fix) rec=fix(rec); return {coll,action:'add',record:rec};})]);
  const onDelete=row=>saveAll([{coll,action:'delete',record:strip(row),before:strip(row)}]);
  return html`<${Grid} cols=${cols} rows=${rows} rkey=${rkey} onSave=${onSave} onAdd=${onAdd} onDelete=${onDelete} toolbar=${toolbar} pageSize=${pageSize} search=${search} xname=${xname}/>`;
}
function MonthPick({value,onChange,months}){
  return html`<label className="mpick"><${Icon} n="calplus" s=${14}/><select value=${value} onChange=${e=>onChange(e.target.value)} aria-label="Month">${months.map(m=>html`<option key=${m} value=${m}>${monthLabel(m)}</option>`)}</select></label>`;
}
function DatePick({value,onChange}){
  return html`<label className="mpick"><${Icon} n="calplus" s=${14}/><input type="date" value=${value} onChange=${e=>e.target.value&&onChange(e.target.value)} aria-label="Date"/></label>`;
}
function Tabs({tabs,value,onChange}){
  return html`<div className="seg alt" style=${{marginBottom:14}} role="tablist">${tabs.map(([k,l])=>html`<button key=${k} role="tab" aria-selected=${value===k} className=${value===k?'on':''} onClick=${()=>onChange(k)}>${l}</button>`)}</div>`;
}
