/* ================= PENDING CHANGES ================= */
function Pending(){
  const app=useApp(); const {data,role,approve,reject,setRole,sn,setData,toast}=app;
  const list=[...data.pending].sort((a,b)=>a.at<b.at?1:-1); const open=list.filter(x=>x.status==='pending'), done=list.filter(x=>x.status!=='pending');
  const label=k=>FIELD_LABELS[k]||k;
  const show=(k,v)=>k==='site'?sn(v):k==='category'?(CAT[v]?CAT[v].l:v):typeof v==='boolean'?(v?'Yes':'No'):(v===''||v==null?'—':String(v));
  const Item=({p})=>{const keys=Object.keys(p.record).filter(k=>k!=='id'); const changed=p.action==='edit'&&p.before?keys.filter(k=>String(p.before[k])!==String(p.record[k])):keys;
    const AC={add:{l:'New record',c:'#3B82F6'},edit:{l:'Edit',c:'#F59E0B'},delete:{l:'Delete',c:'#EF4444'}}[p.action];
    return html`<div className="card fadein" style=${{marginBottom:12}}>
      <div className="row wrap"><${Pill} t=${AC.l} c=${AC.c}/><b>${p.module}</b><span className="muted sm">by ${p.by} · ${new Date(p.at).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</span><span className="sp"></span>
        ${p.status==='pending'?(role==='Owner'?html`<span className="row"><button className="btn pri sm" onClick=${()=>approve(p.id)}><${Icon} n="check" s=${14}/>Approve</button><button className="btn sm dan" onClick=${()=>reject(p.id)}><${Icon} n="x" s=${14}/>Reject</button></span>`:html`<span className="muted xs"><${Icon} n="lock" s=${12}/> Owner approves</span>`):html`<${Pill} t=${p.status==='approved'?'Approved':'Rejected'} c=${p.status==='approved'?'#10B981':'#EF4444'}/>`}</div>
      <div className="diff">${changed.slice(0,10).map(k=>html`<${React.Fragment} key=${k}><span className="muted">${label(k)}</span><span className=${p.action==='add'?'n':'o'}>${p.action==='edit'?show(k,p.before[k]):show(k,p.record[k])}</span><span className="n">${p.action==='edit'?show(k,p.record[k]):''}</span><//>`)}</div></div>`;};
  return html`<div>
    <${ModHead} title="Pending Changes" icon="approve" desc="Suggestions from Guests wait here. The Owner approves or rejects them with one click, and the data updates live." noEntry=${true}/>
    <div className="card" style=${{marginBottom:16}}><div className="row wrap" style=${{gap:12}}><${Icon} n="bulb" s=${18}/><div style=${{flex:1,minWidth:220}}><b>Try the approval flow</b><div className="muted sm">1. Switch to Guest and add or edit a record in any module’s Data Entry. 2. Switch back to Owner and approve it here. You are currently <b>${role}</b>.</div></div>
      ${role!=='Guest'?html`<button className="btn" onClick=${()=>{setRole('Guest');toast('You are now a Guest — your changes become suggestions');}}>Switch to Guest</button>`:html`<button className="btn pri" onClick=${()=>{setRole('Owner');toast('You are now the Owner');}}>Switch to Owner</button>`}</div></div>
    <h3 style=${{fontSize:15,margin:'0 0 10px'}}>Waiting for approval (${open.length})</h3>
    ${open.length?open.map(p=>html`<${Item} key=${p.id} p=${p}/>`):html`<div className="card"><${Empty} t="No suggestions waiting. Switch to Guest and add a record to create one."/></div>`}
    ${done.length?html`<div><div className="row" style=${{margin:'20px 0 10px'}}><h3 style=${{fontSize:15}}>History (${done.length})</h3><span className="sp"></span>${role==='Owner'?html`<button className="btn sm" onClick=${()=>setData(d=>({...d,pending:d.pending.filter(x=>x.status==='pending')}))}>Clear history</button>`:null}</div>${done.slice(0,15).map(p=>html`<${Item} key=${p.id} p=${p}/>`)}</div>`:null}
  </div>`;
}

/* ================= CUSTOMIZE ================= */
const WIDGET_LABEL={moving:'Fleet moving',fuel:'Fuel within target',profit:'Net trip profit',cost:'Fleet cost vs target',market:'Market fill rate',pm:'Services overdue'};
function Customize(){
  const app=useApp(); const {settings,setSettings,role,setRole,openModal,toast,dark}=app;
  if(role!=='Owner') return html`<div><${ModHead} title="Customize" icon="sliders" desc="Layout, names and colours." noEntry=${true}/><div className="card lockbox"><${Icon} n="lock" s=${28}/><h3 style=${{margin:'10px 0 4px'}}>Only the Owner can customize</h3><p className="muted">Switch the role to Owner in the header to change modules, centre names and colours.</p><button className="btn pri" onClick=${()=>setRole('Owner')}>Switch to Owner</button></div></div>`;
  const S=(f)=>setSettings(s=>({...s,...f(s)}));
  const togHide=k=>S(s=>({hidden:s.hidden.includes(k)?s.hidden.filter(x=>x!==k):[...s.hidden,k]}));
  const move=(i,d)=>S(s=>{const w=[...s.widgets]; const j=i+d; if(j<0||j>=w.length) return {}; [w[i],w[j]]=[w[j],w[i]]; return {widgets:w};});
  return html`<div>
    <${ModHead} title="Customize" icon="sliders" desc="Changes save in this browser and apply everywhere straight away." noEntry=${true}/>
    <div className="grid g2">
      <${Card} title="Modules" sub="Hide modules you don’t need. Hidden modules leave the sidebar and dashboard.">
        ${NAV.filter(g=>g.items&&g.g!=='Manage'||g.k&&g.k!=='dashboard').map(g=>html`<div key=${g.g||g.k} style=${{marginBottom:8}}><div className="navg" style=${{padding:'8px 0 2px'}}>${g.g||g.l}</div>${(g.items||[g]).map(it=>html`<div key=${it.k} className="setrow"><${Icon} n=${it.i} s=${16}/><span style=${{flex:1}}>${it.l}</span><button className=${'toggle'+(settings.hidden.includes(it.k)?'':' on')} role="switch" aria-checked=${!settings.hidden.includes(it.k)} aria-label=${'Show '+it.l} onClick=${()=>togHide(it.k)}></button></div>`)}</div>`)}
      <//>
      <div>
        <${Card} title="Centre names" sub="Rename any centre. Names update in every chart, map and filter.">
          <div className="entry-form" style=${{gridTemplateColumns:'1fr 1fr'}}>${SITES.map(s=>html`<div className="fld" key=${s}><label htmlFor=${'sn'+s}>${CEN[s].st}</label><input id=${'sn'+s} className="inp typed" value=${settings.siteNames[s]} maxLength=${24} onInput=${e=>{const v=e.target.value; S(st=>({siteNames:{...st.siteNames,[s]:v}}));}}/></div>`)}</div>
        <//>
        <div style=${{height:16}}></div>
        <${Card} title="Theme" sub="Accent colour and light or dark mode">
          <div className="row" style=${{gap:10,marginBottom:12}}>${Object.entries(ACCENTS).map(([k,a])=>html`<button key=${k} className=${'swatch'+(settings.accent===k?' on':'')} style=${{background:'linear-gradient(135deg,'+a.h1+','+a.a+')'}} title=${a.l} aria-label=${a.l+' theme'} onClick=${()=>S(()=>({accent:k}))}></button>`)}</div>
          <div className="row"><span style=${{flex:1}}>Dark mode</span><button className=${'toggle'+(dark?' on':'')} role="switch" aria-checked=${dark} aria-label="Dark mode" onClick=${()=>S(()=>({dark:!dark}))}></button></div>
        <//>
        <div style=${{height:16}}></div>
        <${Card} title="Dashboard widgets" sub="Switch cards on or off and set their order. You can also drag them on the Dashboard.">
          ${settings.widgets.map((w,i)=>html`<div key=${w} className="setrow"><button className=${'toggle'+(settings.hiddenWidgets.includes(w)?'':' on')} role="switch" aria-checked=${!settings.hiddenWidgets.includes(w)} aria-label=${'Show '+WIDGET_LABEL[w]} onClick=${()=>S(s=>({hiddenWidgets:s.hiddenWidgets.includes(w)?s.hiddenWidgets.filter(x=>x!==w):[...s.hiddenWidgets,w]}))}></button><span style=${{flex:1,opacity:settings.hiddenWidgets.includes(w)?.5:1}}>${WIDGET_LABEL[w]}</span><button className="ibtn" aria-label="Move up" disabled=${i===0} onClick=${()=>move(i,-1)}><${Icon} n="cup" s=${16}/></button><button className="ibtn" aria-label="Move down" disabled=${i===settings.widgets.length-1} onClick=${()=>move(i,1)}><${Icon} n="cdown" s=${16}/></button></div>`)}
        <//>
      </div>
    </div>

    <div style=${{height:16}}></div>
    <${Card} title="Data" sub="Backup saves everything as a JSON file. Restore shows what’s inside before replacing anything.">
      <div className="row wrap"><button className="btn" onClick=${()=>openModal('backup')}><${Icon} n="download" s=${15}/>Back up data</button><button className="btn" onClick=${()=>openModal('restore')}><${Icon} n="upload" s=${15}/>Restore from backup</button><button className="btn dan" onClick=${()=>openModal('reset')}><${Icon} n="reset" s=${15}/>Reset to original data</button></div>
    <//>
  </div>`;
}

/* ================= MODALS ================= */
function Modal({onClose,children,wide}){
  useEffect(()=>{const k=e=>{if(e.key==='Escape') onClose();}; window.addEventListener('keydown',k); return ()=>window.removeEventListener('keydown',k);},[]);
  return html`<div className="modal-bg" onClick=${e=>{if(e.target===e.currentTarget) onClose();}}><div className=${'modal fadein'+(wide?' wide':'')} role="dialog" aria-modal="true">${children}</div></div>`;
}
const counts=d=>Object.keys(COLL_LABELS).filter(k=>Array.isArray(d[k])).map(k=>({k,l:COLL_LABELS[k],n:d[k].length}));
function BackupModal({onClose}){
  const {data,settings,toast}=useApp(); const json=useMemo(()=>JSON.stringify({app:'FleetSight',version:1,exportedAt:new Date().toISOString(),settings,data},null,1),[data,settings]);
  const [busy,setBusy]=useState(false); const fname='fleetsight-backup-'+new Date().toISOString().slice(0,10)+'.json';
  const save=async()=>{setBusy(true); const r=await saveFile(fname,json); setBusy(false); if(r==='saved'){toast('Backup saved');onClose();} else if(r==='declined') toast('Backup cancelled'); else toast('This browser blocked the download — use Copy instead');};
  const copy=async()=>{try{await navigator.clipboard.writeText(json); toast('Backup copied — paste it into a .json file');}catch(e){toast('Copy is blocked here — use Save as file');}};
  return html`<${Modal} onClose=${onClose}><h3>Back up data</h3><p className="muted sm">Saves every record and setting as one JSON file (${num(Math.round(json.length/1024))} KB).</p>
    <div className="tw" style=${{margin:'10px 0'}}><table className="t"><tbody>${counts(data).map(c=>html`<tr key=${c.k}><td>${c.l}</td><td className="r">${num(c.n)}</td></tr>`)}</tbody></table></div>
    <div className="row"><button className="btn pri" disabled=${busy} onClick=${save}><${Icon} n="download" s=${15}/>${busy?'Saving…':'Save as file'}</button><button className="btn" onClick=${copy}><${Icon} n="copy" s=${15}/>Copy JSON</button><span className="sp"></span><button className="btn" onClick=${onClose}>Close</button></div><//>`;
}
function RestoreModal({onClose}){
  const {data,setData,setSettings,toast}=useApp(); const [obj,setObj]=useState(null); const [err,setErr]=useState(''); const [txt,setTxt]=useState('');
  const parse=s=>{try{const o=JSON.parse(s); if(!o||!o.data||!Array.isArray(o.data.daily)||!o.settings) throw new Error('missing'); setObj(o); setErr('');}catch(e){setObj(null); setErr('This isn’t a FleetSight backup. Choose a .json file made with “Back up data”.');}};
  const file=e=>{const f=e.target.files&&e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>parse(String(r.result)); r.onerror=()=>setErr('The file could not be read. Try again or paste the JSON below.'); r.readAsText(f);};
  const cur=Object.fromEntries(counts(data).map(c=>[c.k,c.n]));
  const go=()=>{setData({...generateData(),...obj.data}); setSettings({...defaultSettings(),...obj.settings}); toast('Backup restored'); onClose();};
  return html`<${Modal} onClose=${onClose}><h3>Restore from backup</h3><p className="muted sm">Pick a backup file. You’ll see what’s in it before anything changes.</p>
    <input type="file" accept=".json,application/json" className="inp" onChange=${file} style=${{margin:'8px 0'}}/>
    <details style=${{margin:'4px 0 10px'}}><summary className="sm muted" style=${{cursor:'pointer'}}>Or paste backup JSON</summary><textarea className="inp" rows=${4} value=${txt} onInput=${e=>setTxt(e.target.value)} style=${{marginTop:6}}></textarea><button className="btn sm" style=${{marginTop:6}} onClick=${()=>parse(txt)}>Check pasted JSON</button></details>
    ${err?html`<div className="warnbox bad"><${Icon} n="alert" s=${16}/>${err}</div>`:null}
    ${obj?html`<div className="tw" style=${{margin:'10px 0'}}><table className="t"><thead><tr><th>Records</th><th className="r">Now</th><th className="r">In backup</th></tr></thead><tbody>${counts(obj.data).map(c=>html`<tr key=${c.k}><td>${c.l}</td><td className="r">${num(cur[c.k]||0)}</td><td className="r"><b>${num(c.n)}</b></td></tr>`)}</tbody></table></div>
      <p className="sm muted">Saved ${obj.exportedAt?new Date(obj.exportedAt).toLocaleString('en-IN'):'at an unknown time'}. Restoring replaces all current data.</p>`:null}
    <div className="row"><button className="btn pri" disabled=${!obj} onClick=${go}><${Icon} n="upload" s=${15}/>Restore this backup</button><span className="sp"></span><button className="btn" onClick=${onClose}>Cancel</button></div><//>`;
}
function ResetModal({onClose}){
  const {setData,setSettings,toast}=useApp();
  return html`<${Modal} onClose=${onClose}><h3>Reset to original data?</h3><p className="muted">This removes every change you made and reloads the original data and settings. Back up first if you want to keep your changes.</p>
    <div className="row" style=${{marginTop:12}}><button className="btn pri" style=${{background:'#EF4444',borderColor:'#EF4444'}} onClick=${()=>{clearStore(); setData(generateData()); setSettings(defaultSettings()); toast('Original data restored'); onClose();}}><${Icon} n="reset" s=${15}/>Reset to original data</button><span className="sp"></span><button className="btn" onClick=${onClose}>Cancel</button></div><//>`;
}

/* ================= SHELL ================= */
const NAV=[
  {k:'dashboard',l:'Dashboard',i:'dash'},
  {g:'Daily Monitoring',i:'truck',items:[{k:'daily-running',l:'Daily Truck Running',i:'truck'},{k:'fuel',l:'Diesel / Fuel',i:'fuel'},{k:'repair',l:'Repair & Maintenance',i:'wrench'}]},
  {k:'market',l:'Market Ops',i:'pin'},
  {k:'financials',l:'Financials',i:'rupee'},
  {g:'Fleet Cost',i:'pie',items:[{k:'cost-overview',l:'Management Overview',i:'pie'},{k:'maintenance',l:'Preventive Maintenance',i:'calplus'},...COST_CATS.filter(c=>c.k!=='rm').map(c=>({k:c.page,l:c.l,i:c.i})),{k:'cost-entry',l:'All Categories (Entry)',i:'table'}]},
  {g:'Manage',i:'sliders',items:[{k:'pending',l:'Pending Changes',i:'approve'},{k:'setup',l:'Customize',i:'sliders'}]}];
const GROUP_OF=Object.fromEntries(NAV.flatMap(g=>g.items?g.items.map(it=>[it.k,g.g]):[[g.k,g.k==='dashboard'?'Overview':g.l]]));
const PAGES={dashboard:Dashboard,'daily-running':DailyRunning,fuel:Fuel,maintenance:Maintenance,market:Market,financials:Financials,'cost-overview':CostOverview,'cost-entry':CostEntry,pending:Pending,setup:Customize};
COST_CATS.forEach(c=>{PAGES[c.page]=()=>html`<${CostCategory} cat=${c.k}/>`;});
const Mark=()=>html`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5.5 6.2a6.5 6.5 0 0 1 7 0" stroke="#7FF0DC" strokeWidth="1.7" strokeLinecap="round"/><path d="M7.4 8.3a3.4 3.4 0 0 1 3.2 0" stroke="#7FF0DC" strokeWidth="1.7" strokeLinecap="round"/><path d="M1.8 10.6h11v6.6h-11z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12.8 12.6h4.3l3.6 3.1v1.5h-7.9z" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="5.8" cy="18.6" r="1.9" fill="#0A7C86" stroke="#fff" strokeWidth="1.7"/><circle cx="16.8" cy="18.6" r="1.9" fill="#0A7C86" stroke="#fff" strokeWidth="1.7"/></svg>`;
function CentrePick(){
  const {filters,setFilters,sn,data}=useApp(); const [o,setO]=useState(false); const ref=useRef();
  useEffect(()=>{if(!o) return; const h=e=>{if(ref.current&&!ref.current.contains(e.target)) setO(false);}; const k=e=>{if(e.key==='Escape') setO(false);}; document.addEventListener('mousedown',h); document.addEventListener('keydown',k); return ()=>{document.removeEventListener('mousedown',h); document.removeEventListener('keydown',k);};},[o]);
  const pick=k=>{setFilters(f=>({...f,site:k})); setO(false);};
  const cnt=k=>data.vehicles.filter(v=>v.site===k).length;
  return html`<div className="cpick" ref=${ref}><button className="cbtn" aria-haspopup="listbox" aria-expanded=${o} onClick=${()=>setO(!o)}><${Icon} n="pin" s=${15}/>${filters.site==='all'?'All centres':sn(filters.site)}<${Icon} n="cdown" s=${14}/></button>
    ${o?html`<div className="cmenu" role="listbox"><button className=${'copt'+(filters.site==='all'?' on':'')} onClick=${()=>pick('all')}><${Icon} n="dash" s=${15}/>All centres<small>${data.vehicles.length} vehicles</small></button>${CENTRES.map(c=>html`<button key=${c.k} role="option" aria-selected=${filters.site===c.k} className=${'copt'+(filters.site===c.k?' on':'')} onClick=${()=>pick(c.k)}><${Icon} n="pin" s=${15}/><span>${sn(c.k)} <span className="muted xs">${c.st}</span></span><small>${cnt(c.k)}</small></button>`)}</div>`:null}</div>`;
}
function SideNav({cur,go,visible,pendingN}){
  const [open,setOpen]=useState(()=>({[GROUP_OF[cur]]:true}));
  useEffect(()=>{const g=GROUP_OF[cur]; if(g) setOpen(o=>o[g]?o:{...o,[g]:true});},[cur]);
  const item=(it,top)=>html`<button key=${it.k} className=${'navi'+(top?' navtop':'')+(cur===it.k?' on':'')} onClick=${()=>go(it.k)} aria-current=${cur===it.k?'page':undefined}><${Icon} n=${it.i} s=${top?18:16}/><span>${it.l}</span>${it.k==='pending'&&pendingN?html`<span className="badge">${pendingN}</span>`:null}</button>`;
  return html`<div>${NAV.map(g=>{
    if(!g.items) return visible(g.k)||g.k==='dashboard'?item(g,true):null;
    const its=g.items.filter(it=>visible(it.k)||g.g==='Manage'); if(!its.length) return null;
    const isOpen=!!open[g.g], has=its.some(it=>it.k===cur), badge=g.g==='Manage'&&pendingN&&!isOpen;
    return html`<div key=${g.g} className="navgrp"><button className=${'navh'+(isOpen?' open':'')+(has?' cur':'')} aria-expanded=${isOpen} onClick=${()=>setOpen(o=>({...o,[g.g]:!o[g.g]}))}><${Icon} n=${g.i} s=${18}/><span>${g.g}</span>${badge?html`<span className="badge" style=${{marginLeft:'auto'}}>${pendingN}</span>`:null}<span className="chev" style=${badge?{marginLeft:6}:null}><${Icon} n="cdown" s=${16}/></span></button>
      <div className=${'navsub'+(isOpen?' open':'')}><div>${its.map(it=>item(it))}</div></div></div>`;})}</div>`;
}
const pageFromHash=()=>{const h=(location.hash||'').replace('#',''); return PAGES[h]?h:'dashboard';};
const sysDark=()=>{try{return window.matchMedia('(prefers-color-scheme: dark)').matches;}catch(e){return false;}};

function App(){
  const init=useMemo(()=>loadStore()||{data:generateData(),settings:defaultSettings()},[]);
  const [data,setData]=useState(init.data);
  const [settings,setSettings]=useState(()=>({...defaultSettings(),...init.settings}));
  useEffect(()=>{document.title='FleetSight — Monitor. Analyse. Improve.';},[]);
  const [role,setRole]=useState('Owner');
  const [filters,setFilters]=useState({month:'2026-10',site:'all'});
  const [page,setPage]=useState(pageFromHash);
  const [nav,setNav]=useState(false);
  const [toastMsg,setToastMsg]=useState(null);
  const [modal,setModal]=useState(null);
  const [persist,setPersist]=useState(true);
  const [veh,setVeh]=useState(null); const [tour,setTour]=useState(false); const [askOpen,setAskOpen]=useState(false); const [askMsgs,setAskMsgs]=useState([]);
  useEffect(()=>{let done=false; try{done=!!localStorage.getItem(TOUR_KEY);}catch(e){} if(!done){const t=setTimeout(()=>setTour(true),1400); return ()=>clearTimeout(t);}},[]);
  const dark=settings.dark==null?sysDark():settings.dark;
  useEffect(()=>{document.documentElement.setAttribute('data-theme',dark?'dark':'light');},[dark]);
  useEffect(()=>{const t=setTimeout(()=>setPersist(saveStore({data,settings})),300); return ()=>clearTimeout(t);},[data,settings]);
  useEffect(()=>{const on=()=>setPage(pageFromHash()); window.addEventListener('hashchange',on); return ()=>window.removeEventListener('hashchange',on);},[]);
  const tRef=useRef(); const toast=m=>{setToastMsg(m); clearTimeout(tRef.current); tRef.current=setTimeout(()=>setToastMsg(null),2600);};
  const go=p=>{setNav(false); if(location.hash!=='#'+p){try{location.hash=p;}catch(e){} } setPage(p); window.scrollTo(0,0);};
  const months=useMemo(()=>[...new Set([...data.daily,...data.trips,...data.cost].map(x=>monthOf(x.date)).filter(Boolean))].sort(),[data]);
  const latestMonth=months[months.length-1]||'2026-10';
  useEffect(()=>{if(filters.month!=='all'&&!months.includes(filters.month)) setFilters(f=>({...f,month:latestMonth}));},[months]);
  const derived=useMemo(()=>derive(data),[data]);
  const th=useMemo(()=>makeTh(settings.accent,dark),[settings.accent,dark]);
  const sn=k=>settings.siteNames[k]||(CEN[k]?CEN[k].n:k);
  const apply=(d,ch)=>{const arr=d[ch.coll]||[]; let next; if(ch.action==='add') next=[...arr,{...ch.record}]; else if(ch.action==='edit') next=arr.map(x=>x.id===ch.record.id?{...ch.record}:x); else next=arr.filter(x=>x.id!==ch.record.id); return {...d,[ch.coll]:next};};
  const commit=(ch,quiet)=>{
    if(role==='Guest'){setData(d=>({...d,pending:[...d.pending,{...ch,id:uid(),status:'pending',by:'Guest',at:new Date().toISOString()}]})); if(!quiet) toast('Suggestion sent — the Owner can approve it in Pending Changes');}
    else {setData(d=>apply(d,ch)); if(!quiet) toast(ch.action==='add'?'Record added — charts updated':ch.action==='edit'?'Changes saved — charts updated':'Record deleted');}
  };
  const approve=id=>{setData(d=>{const p=d.pending.find(x=>x.id===id); if(!p) return d; const nd=apply(d,p); return {...nd,pending:nd.pending.map(x=>x.id===id?{...x,status:'approved'}:x)};}); toast('Approved — data updated');};
  const reject=id=>{setData(d=>({...d,pending:d.pending.map(x=>x.id===id?{...x,status:'rejected'}:x)})); toast('Suggestion rejected');};
  const pendingN=data.pending.filter(x=>x.status==='pending').length;
  const visible=k=>!settings.hidden.includes(k);
  const cur=visible(page)?page:'dashboard';
  const Page=PAGES[cur]||Dashboard;
  const accentVars=(()=>{const A=ACCENTS[settings.accent]||ACCENTS.teal; return {'--accent':A.a,'--accent-h':A.h,'--hd1':A.h1,'--hd2':A.h2};})();
  useEffect(()=>{Object.entries(accentVars).forEach(([k,v])=>document.documentElement.style.setProperty(k,v));},[settings.accent]);
  const crumb=GROUP_OF[cur]||'Overview';
  const pageLabel=(NAV.flatMap(g=>g.items||[g]).find(x=>x.k===cur)||{l:'FleetSight'}).l;
  const ctx={crumb,pageLabel,openVehicle:setVeh,data,setData,settings,setSettings,role,setRole,filters,setFilters,derived,th,sn,go,commit,approve,reject,toast,months,latestMonth,dark,openModal:setModal};
  const noFilter=['pending','setup','cost-entry'].includes(cur);
  useEffect(()=>{window.scrollTo(0,0);},[cur]);
  return html`<${Ctx.Provider} value=${ctx}>
    <header className="top">
      <button className="hbtn hamb" aria-label="Open menu" onClick=${()=>setNav(true)}><${Icon} n="menu"/></button>
      <button className="brand" style=${{background:'none',border:0,color:'inherit',padding:0,textAlign:'left'}} onClick=${()=>go('dashboard')} aria-label="FleetSight home"><span className="mark"><${Mark}/></span><span className="brand-t"><b>Fleet<em>Sight</em></b><span>Monitor. Analyse. Improve. With Rishabh.</span></span></button>
      <span className="sp"></span>
      <div className="role"><label>Viewing as</label><div className="roleseg" role="radiogroup" aria-label="Role">${['Owner','Editor','Guest'].map(r=>html`<button key=${r} role="radio" aria-checked=${role===r} className=${role===r?'on':''} onClick=${()=>{setRole(r); toast(r==='Guest'?'Guest: your changes become suggestions':r==='Editor'?'Editor: you can add and edit data':'Owner: full access, including approvals');}}>${r}</button>`)}</div></div>
      <button className="hbtn" aria-label="Take the guided tour" title="Guided tour" onClick=${()=>setTour(true)}><${Icon} n="help"/></button>
      <button className="hbtn" aria-label=${dark?'Switch to light mode':'Switch to dark mode'} title=${dark?'Light mode':'Dark mode'} onClick=${()=>setSettings(s=>({...s,dark:!dark}))}><${Icon} n=${dark?'sun':'moon'}/></button>
    </header>
    <div className="shell">
      <div className=${'scrim'+(nav?' open':'')} onClick=${()=>setNav(false)}></div>
      <nav className=${'side'+(nav?' open':'')} aria-label="Modules">
        <${SideNav} cur=${cur} go=${go} visible=${visible} pendingN=${pendingN}/>
        <div className="sidefoot">
          <${ProfileChip} onClick=${()=>{setNav(false);setModal('profile');}}/>
          <div className="row" style=${{gap:6}}><button className="btn sm" style=${{flex:1}} onClick=${()=>setModal('backup')}><${Icon} n="download" s=${14}/>Backup</button><button className="btn sm" style=${{flex:1}} onClick=${()=>setModal('restore')}><${Icon} n="upload" s=${14}/>Restore</button></div>
          <button className="btn sm dan" onClick=${()=>setModal('reset')}><${Icon} n="reset" s=${14}/>Reset to original data</button>
          <span className="muted xs" style=${{textAlign:'center'}}>${persist?'Changes are saved in this browser':'Changes last until you close this tab'}</span>
        </div>
      </nav>
      <main className="main">
        ${noFilter?null:html`<div className="fbar"><div className="fbar-in">
          <div className="seg" role="tablist" aria-label="Month">${[...months,'all'].map(m=>html`<button key=${m} role="tab" aria-selected=${filters.month===m} className=${filters.month===m?'on':''} onClick=${()=>setFilters(f=>({...f,month:m}))}>${m==='all'?'All months':monthLabel(m)}</button>`)}</div>
          <${CentrePick}/>
          <span className="demodate"><${Icon} n="clock" s=${14}/>Data up to ${fmtDay(DEMO_TODAY)} 2026</span><button className="btn rbtn" onClick=${()=>setModal('report')}><${Icon} n="report" s=${15}/>Monthly report</button></div></div>`}
        <div className="inner page" key=${cur}><${Page}/></div>
        <footer className="footer">FleetSight · Built by <button className="footlink" onClick=${()=>setModal('profile')}>Rishabh Agarwal</button></footer>
      </main>
    </div>
    ${modal==='backup'?html`<${BackupModal} onClose=${()=>setModal(null)}/>`:modal==='restore'?html`<${RestoreModal} onClose=${()=>setModal(null)}/>`:modal==='reset'?html`<${ResetModal} onClose=${()=>setModal(null)}/>`:modal==='report'?html`<${ReportModal} onClose=${()=>setModal(null)}/>`:modal==='profile'?html`<${Modal} onClose=${()=>setModal(null)} wide=${true}><div className="row" style=${{justifyContent:'flex-end',marginBottom:6}}><button className="ibtn" aria-label="Close" onClick=${()=>setModal(null)}><${Icon} n="x" s=${18}/></button></div><${ProfileCard} inModal=${true}/><//>`:null}
    ${veh?html`<${VehicleDrawer} key=${veh} code=${veh} onClose=${()=>setVeh(null)}/>`:null}
    ${askOpen?html`<${AskPanel} onClose=${()=>setAskOpen(false)} msgs=${askMsgs} setMsgs=${setAskMsgs}/>`:html`<${AskFab} onClick=${()=>setAskOpen(true)}/>`}
    ${tour?html`<${Tour} onClose=${()=>setTour(false)}/>`:null}
    ${toastMsg?html`<div className="toast" role="status"><${Icon} n="check" s=${16}/>${toastMsg}</div>`:null}
  <//>`;
}
ReactDOM.createRoot(document.getElementById('root')).render(html`<${App}/>`);
