/* ================= helpers ================= */
function costTargetFor(settings,cats,F,months){
  const ms=F.month==='all'?months:[F.month];
  return sum(cats,c=>sum(ms,m=>sum(SITES.filter(F.s),s=>costTgt(settings,c,m,s))));
}
function series(rows,key,fn){const g=groupBy(rows,x=>x[key]); return Object.keys(g).sort().map(k=>fn(g[k]));}
function weekly(rows,key,fn){const g=groupBy(rows,x=>Math.floor(diffDays(x[key],START)/7)); return Object.keys(g).map(Number).sort((a,b)=>a-b).map(k=>fn(g[k]));}
const cumul=a=>{let r=0; return a.map(v=>r+=v);};
const pickBar=(e,f)=>{const p=e&&e.activePayload&&e.activePayload[0]; if(p) f(p.payload);};

/* ================= DASHBOARD ================= */
function Ring({v}){
  const a=useCountUp(v,1200); const r=56, c=2*Math.PI*r;
  return html`<svg width="150" height="150" viewBox="0 0 140 140" role="img" aria-label=${'Fleet health score '+Math.round(v)+' out of 100'}>
    <defs><linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#5EEAD4"/><stop offset="1" stopColor="#FFFFFF"/></linearGradient></defs>
    <circle cx="70" cy="70" r=${r} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="11"/>
    <circle cx="70" cy="70" r=${r} fill="none" stroke="url(#ringg)" strokeWidth="11" strokeLinecap="round" strokeDasharray=${c} strokeDashoffset=${c*(1-clamp(a,0,100)/100)} transform="rotate(-90 70 70)"/>
    <text x="70" y="72" textAnchor="middle" fill="#fff" style=${{font:'700 36px Sora,sans-serif',letterSpacing:'-1px'}}>${Math.round(a)}</text>
    <text x="70" y="93" textAnchor="middle" fill="rgba(255,255,255,.72)" style=${{font:'500 11px Inter,sans-serif'}}>out of 100</text></svg>`;
}
function Dashboard(){
  const app=useApp(); const {data,derived,settings,setSettings,go,th,role,sn,months,toast}=app; const F=useF();
  const M=useMemo(()=>{
    const dr=derived.daily.filter(x=>F.m(x.date)&&F.s(x.site)); const mv=sum(dr,x=>x.transit)/Math.max(1,sum(dr,x=>x.deployed))*100;
    const fu=derived.fuel.filter(x=>F.m(x.date)&&F.s(x.site)); const fw=fu.filter(x=>x.status==='within').length/Math.max(1,fu.length)*100;
    const tr=derived.trips.filter(x=>F.m(x.date)&&F.s(x.site)); const net=sum(tr,x=>x.net), rev=sum(tr,x=>x.revenue);
    const co=data.cost.filter(x=>F.m(x.date)&&F.s(x.site)); const ca=sum(co,x=>x.amount), ct=costTargetFor(settings,COST_CATS.map(c=>c.k),F,months), cr=ct?ca/ct*100:0;
    const mk=data.market.filter(x=>F.m(x.date)); const fill=sum(mk,x=>x.placements)/Math.max(1,sum(mk,x=>x.bookings))*100;
    const pmv=derived.pm.filter(x=>F.s(x.site)); const pmo=pmv.filter(x=>x.status==='overdue').length;
    const W={
      moving:{l:'Fleet moving',v:mv,f:x=>pct(x),s:'In transit ÷ deployed',p:'daily-running',i:'truck',tone:mv>=70?'good':mv>=60?'warn':'bad',sp:series(dr,'date',a=>sum(a,x=>x.transit)/Math.max(1,sum(a,x=>x.deployed))*100)},
      fuel:{l:'Fuel within target',v:fw,f:x=>pct(x),s:num(fu.length)+' fills checked',p:'fuel',i:'fuel',tone:fw>=80?'good':fw>=65?'warn':'bad',sp:series(fu,'date',a=>a.filter(x=>x.status==='within').length/a.length*100)},
      profit:{l:'Net trip profit',v:net,f:money,s:'Margin '+pct(rev?net/rev*100:0),p:'financials',i:'rupee',tone:net>=0?'good':'bad',sp:series(tr,'date',a=>sum(a,x=>x.net))},
      cost:{l:'Fleet cost vs target',v:cr,f:x=>pct(x,0),s:money(ca)+' of '+money(ct),p:'cost-overview',i:'pie',tone:cr<=100?'good':cr<=108?'warn':'bad',sp:series(co,'date',a=>sum(a,x=>x.amount))},
      market:{l:'Market fill rate',v:fill,f:x=>pct(x),s:'Placements ÷ bookings',p:'market',i:'pin',tone:fill>=90?'good':fill>=80?'warn':'bad',sp:series(mk,'date',a=>sum(a,x=>x.placements)/Math.max(1,sum(a,x=>x.bookings))*100)},
      pm:{l:'Services overdue',v:pmo,f:num,s:pmv.length+' vehicles tracked',p:'maintenance',i:'wrench',tone:pmo?'bad':'good'}
    };
    const parts=[
      {l:'Fleet moving',v:clamp(mv/85*100,0,100),p:'daily-running'},
      {l:'Fuel discipline',v:fw,p:'fuel'},
      {l:'Cost control',v:clamp(100-Math.max(0,cr-100)*4,0,100),p:'cost-overview'},
      {l:'Service health',v:pmv.length?(1-pmo/pmv.length)*100:100,p:'maintenance'},
      {l:'Market fill',v:fill,p:'market'}].filter(x=>!settings.hidden.includes(x.p));
    return {W,parts,score:parts.length?sum(parts,x=>x.v)/parts.length:0,dr};
  },[derived,data,settings,F.month,F.site]);
  const {W,parts,score}=M;
  const order=settings.widgets.filter(k=>W[k]&&!settings.hiddenWidgets.includes(k)&&!settings.hidden.includes(W[k].p));
  const dragKey=useRef(null);
  const dragProps=k=>role!=='Owner'?null:{draggable:'true',onDragStart:()=>{dragKey.current=k;},onDragOver:e=>e.preventDefault(),onDrop:e=>{e.preventDefault(); const from=dragKey.current; if(!from||from===k) return; const w=settings.widgets.filter(x=>x!==from); w.splice(w.indexOf(k),0,from); setSettings(s=>({...s,widgets:w})); toast('Dashboard layout saved');}};
  const days=useMemo(()=>{const g=groupBy(M.dr,x=>x.date); return Object.keys(g).sort().map(d=>({l:fmtDay(d),mv:sum(g[d],x=>x.transit)/Math.max(1,sum(g[d],x=>x.deployed))*100}));},[M]);
  const catBars=COST_CATS.filter(c=>c.k!=='salary').map(c=>({k:c.k,l:c.l.replace('Repair & Maintenance','Repair & M.').replace(' Renewal','').replace(' Purchase',''),actual:sum(data.cost.filter(x=>x.category===c.k&&F.m(x.date)&&F.s(x.site)),x=>x.amount),target:costTargetFor(settings,[c.k],F,months)}));
  const alerts=useMemo(()=>{
    const A=[];
    const bad=M.dr.filter(x=>!x.ok); if(bad.length) A.push({t:bad.length+' daily row'+(bad.length>1?'s don’t':' doesn’t')+' add up',d:'Status counts differ from trucks deployed',p:'daily-running',c:'#EF4444',i:'bad'});
    findRepeats(M.dr).forEach(r=>A.push({t:sn(r.site)+' figures unchanged for '+r.days+' days',d:fmtDay(r.from)+' – '+fmtDay(r.to)+' · likely copied forward',p:'daily-running',c:'#F59E0B',i:'clock'}));
    const fa=groupBy(derived.fuel.filter(x=>F.m(x.date)&&F.s(x.site)&&x.status==='above'),x=>x.vehicle); const top=Object.entries(fa).sort((a,b)=>b[1].length-a[1].length)[0];
    if(top&&top[1].length>=5) A.push({t:top[0]+' over fuel range '+top[1].length+' times',d:'Most frequent over-consumer — open its Vehicle 360',p:'fuel',veh:top[0],c:'#EF4444',i:'fuel'});
    catBars.filter(c=>c.target&&c.actual>c.target*1.05).forEach(c=>A.push({t:CAT[c.k].l+' over target',d:money(c.actual)+' spent against '+money(c.target),p:CAT[c.k].page,c:'#F59E0B',i:CAT[c.k].i}));
    const po=derived.pm.filter(x=>F.s(x.site)&&x.status==='overdue').length; if(po) A.push({t:po+' vehicle'+(po>1?'s':'')+' overdue for service',d:'Book before the next trip cycle',p:'maintenance',c:'#F59E0B',i:'wrench'});
    return A.filter(a=>!settings.hidden.includes(a.p));
  },[M,derived,settings]);
  const label=score>=85?'Strong':score>=70?'Steady':'Needs attention';
  const weakest=[...parts].sort((a,b)=>a.v-b.v)[0];
  const avgMv=days.length?sum(days,x=>x.mv)/days.length:0; const worst=[...days].sort((a,b)=>a.mv-b.mv)[0];
  const over=catBars.filter(c=>c.target&&c.actual>c.target).sort((a,b)=>b.actual/b.target-a.actual/a.target);
  const scope=(F.month==='all'?'all months':monthLabel(F.month))+(F.site==='all'?', all centres':', '+sn(F.site));
  return html`<div>
    <section className="hero">
      <div className="ring"><${Ring} v=${score}/><div className="lbl">${label}</div></div>
      <div><div className="tag">Fleet health · ${scope}</div><h2>${score>=85?'Your fleet is running well.':score>=70?'Your fleet is steady, with a few gaps.':'A few areas need your attention.'}</h2>
        <p>One score from five signals. ${weakest?`The weakest right now is ${weakest.l.toLowerCase()} at ${pct(weakest.v,0)}.`:''} Click any signal to see what’s behind it.</p>
        <div className="btns"><button className="hbtn2" onClick=${()=>go('fuel')}><${Icon} n="fuel" s=${16}/>Explore Fuel</button><button className="hbtn2 ghost" onClick=${()=>go('cost-overview')}><${Icon} n="pie" s=${16}/>Explore Costs</button><button className="hbtn2 ghost" onClick=${()=>go('pending')}><${Icon} n="approve" s=${16}/>Try Approval Flow</button></div></div>
      <div className="hparts">${parts.map(p=>html`<button key=${p.l} className="hpart" onClick=${()=>go(p.p)}><span>${p.l}</span><span className="hbar"><i style=${{width:clamp(p.v,0,100)+'%'}}></i></span><b>${Math.round(p.v)}</b></button>`)}</div>
    </section>
    <div className="kpis">${order.map(k=>{const w=W[k]; return html`<${Kpi} key=${k} label=${w.l} icon=${w.i} value=${w.v} fmt=${w.f} sub=${w.s} tone=${w.tone} spark=${w.sp} onClick=${()=>go(w.p)} drag=${dragProps(k)}/>`;})}</div>
    <${NetworkCard}/>
    <div className="grid g21">
      <${Card} title="Fleet moving % by day" sub="Share of deployed trucks in load or unload transit" insight=${days.length?[`Trucks were moving ${pct(avgMv)} of the time on average.`,worst?`The weakest day was ${worst.l} at ${pct(worst.mv)}.`:null]:null}>
        ${days.length?html`<${ResponsiveContainer} width="100%" height=${250}><${AreaChart} data=${days} margin=${{top:8,right:8,left:-14,bottom:0}} onClick=${()=>go('daily-running')} style=${{cursor:'pointer'}}>
          <defs><linearGradient id="gmv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor=${th.accent} stopOpacity=${.32}/><stop offset="100%" stopColor=${th.accent} stopOpacity=${0}/></linearGradient></defs>
          <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)} minTickGap=${28}/><${YAxis} ...${axis(th)} domain=${[40,100]} unit="%"/>
          <${Tooltip} content=${tipOf(v=>pct(v))} cursor=${{stroke:th.faint,strokeDasharray:'3 3'}}/><${ReferenceLine} y=${avgMv} stroke=${th.muted} strokeDasharray="4 4"/>
          <${Area} type="monotone" dataKey="mv" name="Moving %" stroke=${th.accent} strokeWidth=${2.2} fill="url(#gmv)" activeDot=${{r:5,strokeWidth:2,stroke:'#fff'}}/><//><//>`:html`<${Empty}/>`}
      <//>
      <${Card} title="Needs attention" sub=${alerts.length?alerts.length+' item'+(alerts.length>1?'s':'')+' found in the data':'All clear'}>
        <div className="alist">${alerts.length?alerts.slice(0,5).map((a,i)=>html`<button key=${i} className="aitem" onClick=${()=>a.veh?app.openVehicle(a.veh):go(a.p)}><span className="ai" style=${{background:a.c+'1c',color:a.c}}><${Icon} n=${a.i} s=${16}/></span><span><b>${a.t}</b><br/><span className="muted">${a.d}</span></span><span className="go"><${Icon} n="arrow" s=${16}/></span></button>`):html`<${Empty} t="Nothing needs attention for these filters."/>`}</div>
      <//>
    </div>
    ${settings.hidden.includes('cost-overview')?null:html`<${Card} title="Fleet cost by category" sub="Actual against target. Click a bar to open the category." insight=${[over.length?`${over.map(c=>c.l).join(', ')} ${over.length>1?'are':'is'} above target — ${over[0].l} by ${pct((over[0].actual/over[0].target-1)*100,0)}.`:'Every category is within target.']}>
      <${ResponsiveContainer} width="100%" height=${250}><${BarChart} data=${catBars} margin=${{top:8,right:8,left:0,bottom:0}} barGap=${4} onClick=${e=>pickBar(e,p=>go(CAT[p.k].page))} style=${{cursor:'pointer'}}>
        <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)} interval=${0}/><${YAxis} ...${axis(th)} tickFormatter=${shortMoney}/>
        <${Tooltip} content=${tipOf(moneyFull)} cursor=${{fill:th.cursor}}/>
        <${Bar} dataKey="target" name="Target" fill=${th.faint} radius=${[6,6,0,0]} maxBarSize=${30}/>
        <${Bar} dataKey="actual" name="Actual" radius=${[6,6,0,0]} maxBarSize=${30}>${catBars.map(c=>html`<${Cell} key=${c.k} fill=${c.actual>c.target?th.bad:th.accent}/>`)}<//><//><//>
      <${Legendish} items=${[{l:'Actual',c:th.accent},{l:'Over target',c:th.bad},{l:'Target',c:th.faint}]}/>
    <//>`}
    <div style=${{height:16}}></div>
    <${ProfileCard}/>
  </div>`;
}

/* ================= DAILY TRUCK RUNNING ================= */
function DailyRunning(){
  const app=useApp(); const {derived,data,th,sn,setFilters,commit,role}=app; const F=useF();
  const [view,setView]=useState('a'); const [focus,setFocus]=useState(null);
  const all=derived.daily.filter(x=>F.m(x.date));
  const rows=all.filter(x=>F.s(x.site));
  const dates=[...new Set(rows.map(x=>x.date))].sort(); const last=dates[dates.length-1], prev=dates[dates.length-2];
  const agg=d=>{const r=rows.filter(x=>x.date===d); return {dep:sum(r,x=>x.deployed),tr:sum(r,x=>x.transit),rep:sum(r,x=>x.repair),nd:sum(r,x=>x.noDriver)};};
  const A=last?agg(last):{dep:0,tr:0,rep:0,nd:0}, P=prev?agg(prev):null;
  const mv=A.dep?A.tr/A.dep*100:0, mvP=P&&P.dep?P.tr/P.dep*100:null;
  const groups={transit:['loadT','unloadT'],repair:['repair'],noDriver:['noDriver']};
  const dim=k=>focus&&!groups[focus].includes(k)?.15:1;
  const tog=k=>setFocus(f=>f===k?null:k);
  const siteBars=SITES.map(s=>{const r=all.find(x=>x.date===last&&x.site===s)||{}; const o={site:s,name:sn(s)}; STATUS.forEach(t=>o[t.k]=r[t.k]||0); return o;});
  const dayData=dates.map(d=>{const r=rows.filter(x=>x.date===d); const o={d,l:fmtDay(d)}; STATUS.forEach(t=>o[t.k]=sum(r,x=>x[t.k])); const dep=sum(r,x=>x.deployed); o.mv=dep?sum(r,x=>x.transit)/dep*100:0; o.dep=dep; return o;});
  const sp=k=>dayData.slice(-21).map(x=>x[k]);
  const bad=rows.filter(x=>!x.ok); const reps=findRepeats(rows);
  const lastRows=rows.filter(x=>x.date===last);
  const worst=[...lastRows].sort((a,b)=>a.moving-b.moving)[0];
  const reason=worst?STATUS.slice(2).map(t=>({l:t.l,v:worst[t.k]})).sort((a,b)=>b.v-a.v)[0]:null;
  const newDay=()=>{const mx=data.daily.reduce((m,x)=>x.date>m?x.date:m,''); const nd=addDays(mx,1); const src=data.daily.filter(x=>x.date===mx); src.forEach(x=>commit({coll:'daily',action:'add',module:'Daily Truck Running',record:{...x,id:uid(),date:nd}},true)); app.toast(role==='Guest'?'New day sent for approval ('+src.length+' centres)':'Started '+fmtDay(nd)+' — copied '+src.length+' centres from '+fmtDay(mx)); return nd;};
  const cols=[{k:'site',l:'Centre',rn:x=>html`<b>${sn(x.site)}</b>`},{k:'deployed',l:'Deployed',r:1},...STATUS.map(t=>({k:t.k,l:t.l,r:1})),{k:'total',l:'Row total',r:1,cls:'calc'},{k:'ok',l:'Check',rn:x=>html`<${Tick} ok=${x.ok}/>`,cls:'calc'},{k:'moving',l:'Moving %',cls:'calc',rn:x=>html`<div className="row"><span style=${{width:46}}>${pct(x.moving,0)}</span><div style=${{width:70}}><${Prog} v=${x.moving} c=${x.moving>=70?th.good:x.moving>=60?th.warn:th.bad}/></div></div>`}];
  const findings=[...bad.slice(0,4).map(x=>({c:'#EF4444',i:'bad',t:sn(x.site)+' on '+fmtDay(x.date)+' doesn’t add up',d:'Statuses total '+x.total+' but '+x.deployed+' trucks were deployed'})),
    ...reps.map(r=>({c:'#F59E0B',i:'clock',t:sn(r.site)+': same figures for '+r.days+' days',d:fmtDay(r.from)+' – '+fmtDay(r.to)+' · '+r.transit+' in transit every day. Ask the centre to confirm.'}))];
  return html`<div>
    <${ModHead} title="Daily Truck Running" icon="truck" desc="Where every deployed truck is today, by centre and status." view=${view} setView=${setView}/>
    ${view==='e'?html`<${DailyEntry} newDay=${newDay}/>`:!last?html`<${Card}><${Empty}/><//>`:html`<div>
      <${Summary} items=${[{t:mv>=70?'good':mv>=60?'warn':'bad',s:`On ${fmtDay(last)}, ${pct(mv,0)} of ${A.dep} deployed trucks were moving${mvP!=null?` (${mv>=mvP?'up':'down'} ${Math.abs(mv-mvP).toFixed(1)} pts on the day before)`:''}.`},worst?{t:'warn',s:`${sn(worst.site)} is the slowest centre; the main reason is “${reason.l.toLowerCase()}”.`}:null,findings.length?{t:'bad',s:`${findings.length} data check${findings.length>1?'s':''} need a look — see Findings below.`}:{t:'good',s:'Every row adds up and no centre repeated its figures.'}]}/>
      <div className="kpis">
        <${Kpi} label="Deployed" icon="truck" value=${A.dep} delta=${P?A.dep-P.dep:null} sub="vs day before" spark=${sp('dep')}/>
        <${Kpi} label="Moving" icon="route" value=${mv} fmt=${v=>pct(v)} delta=${mvP!=null?mv-mvP:null} deltaFmt=${v=>v.toFixed(1)+' pts'} tone=${mv>=70?'good':mv>=60?'warn':'bad'} sub=${A.tr+' in transit'} spark=${sp('mv')} onClick=${()=>tog('transit')} active=${focus==='transit'}/>
        <${Kpi} label="Repairing" icon="wrench" value=${A.rep} delta=${P?A.rep-P.rep:null} goodWhen="down" tone="bad" spark=${sp('repair')} onClick=${()=>tog('repair')} active=${focus==='repair'}/>
        <${Kpi} label="Without driver" icon="users" value=${A.nd} delta=${P?A.nd-P.nd:null} goodWhen="down" tone="warn" spark=${sp('noDriver')} onClick=${()=>tog('noDriver')} active=${focus==='noDriver'}/>
      </div>
      <div className="grid g2">
        <${Card} title=${'Status by centre · '+fmtDay(last)} sub="Click a centre to filter the whole app to it" insight=${[worst?`${sn(worst.site)} has the lowest moving rate (${pct(worst.moving,0)}), mostly because of “${reason.l.toLowerCase()}” (${reason.v}).`:null]}>
          <${ResponsiveContainer} width="100%" height=${250}><${BarChart} data=${siteBars} margin=${{top:6,right:6,left:-20,bottom:0}} onClick=${e=>pickBar(e,p=>setFilters(f=>({...f,site:f.site===p.site?'all':p.site})))} style=${{cursor:'pointer'}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="name" ...${axis(th)} interval=${0} tick=${{fill:th.muted,fontSize:10}}/><${YAxis} ...${axis(th)} allowDecimals=${false}/>
            <${Tooltip} content=${tipOf(num)} cursor=${{fill:th.cursor}}/>
            ${STATUS.map((t,i)=>html`<${Bar} key=${t.k} dataKey=${t.k} name=${t.l} stackId="s" fill=${t.c} maxBarSize=${54} radius=${i===STATUS.length-1?[6,6,0,0]:0}>${siteBars.map(b=>html`<${Cell} key=${b.site} fill=${t.c} fillOpacity=${F.site!=='all'&&F.site!==b.site?.22:dim(t.k)}/>`)}<//>`)}<//><//>
          <${Legendish} items=${STATUS}/>
        <//>
        <${Card} title="Day by day" sub="Status counts with the moving % line" insight=${[dayData.length>1?`Moving % ranged from ${pct(Math.min(...dayData.map(x=>x.mv)),0)} to ${pct(Math.max(...dayData.map(x=>x.mv)),0)} over ${dayData.length} days.`:null]}>
          <${ResponsiveContainer} width="100%" height=${250}><${ComposedChart} data=${dayData} margin=${{top:6,right:0,left:-20,bottom:0}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)} minTickGap=${24}/><${YAxis} yAxisId="l" ...${axis(th)}/><${YAxis} yAxisId="r" orientation="right" ...${axis(th)} domain=${[0,100]} unit="%" width=${40}/>
            <${Tooltip} content=${tipOf((v,k)=>k==='mv'?pct(v):num(v))} cursor=${{fill:th.cursor}}/>
            ${STATUS.map(t=>html`<${Bar} key=${t.k} yAxisId="l" dataKey=${t.k} name=${t.l} stackId="s" fill=${t.c} fillOpacity=${dim(t.k)}/>`)}
            <${Line} yAxisId="r" type="monotone" dataKey="mv" name="Moving %" stroke=${th.text} strokeWidth=${2} dot=${false}/><//><//>
        <//>
      </div>
      <${Card} title="Findings" sub="Checks run automatically on every row">
        <div className="alist">${findings.length?findings.map((f,i)=>html`<div key=${i} className="aitem"><span className="ai" style=${{background:f.c+'1c',color:f.c}}><${Icon} n=${f.i} s=${16}/></span><span><b>${f.t}</b><br/><span className="muted">${f.d}</span></span></div>`):html`<${Empty} t="Every row adds up and no centre repeated its figures."/>`}</div>
        <div style=${{height:12}}></div>
        <${More} label=${'Show '+fmtDay(last)+' by centre'} count=${lastRows.length}><${DataTable} xname=${'Daily running '+last} cols=${cols} rows=${lastRows} search=${false} selKey=${x=>F.site===x.site} onRow=${x=>setFilters(f=>({...f,site:f.site===x.site?'all':x.site}))}/><//>
      <//></div>`}
  </div>`;
}

/* ================= DIESEL / FUEL ================= */
function Fuel(){
  const app=useApp(); const {derived,th,sn}=app; const F=useF();
  const [view,setView]=useState('a'); const [route,setRoute]=useState(null); const [cell,setCell]=useState(null); const [stF,setStF]=useState(null);
  const routes=FUEL_ROUTES.filter(r=>F.s(r.site));
  const rows=derived.fuel.filter(x=>F.m(x.date)&&F.s(x.site));
  const rr=route?rows.filter(x=>x.route===route):rows;
  const cnt=k=>rr.filter(x=>x.status===k).length; const w=rr.length?cnt('within')/rr.length*100:0;
  const avgR=rr.length?sum(rr,x=>x.litres/x.target)/rr.length*100:0;
  const byDay=groupBy(rr,x=>x.date); const dk=Object.keys(byDay).sort().slice(-21);
  const spk=f=>dk.map(d=>f(byDay[d]));
  const byRoute=routes.map(r=>{const x=rows.filter(y=>y.route===r.k); return {k:r.k,l:laneShort(r.k),within:x.filter(y=>y.status==='within').length,near:x.filter(y=>y.status==='near').length,above:x.filter(y=>y.status==='above').length,p:x.length?x.filter(y=>y.status==='within').length/x.length*100:0};});
  const dates=[...new Set(rows.map(x=>x.date))].sort();
  const last7=dates.slice(-7).map(d=>{const x=rr.filter(y=>y.date===d); return {l:fmtDay(d),within:sum(x.filter(y=>y.status==='within'),y=>y.litres),near:sum(x.filter(y=>y.status==='near'),y=>y.litres),above:sum(x.filter(y=>y.status==='above'),y=>y.litres)};});
  const hdays=dates.slice(-31);
  const heat={}; rows.forEach(x=>{if(!hdays.includes(x.date)) return; const k=x.route+'|'+x.date; (heat[k]=heat[k]||[]).push(x);});
  const hc=x=>x.some(y=>y.status==='above')?th.bad:x.some(y=>y.status==='near')?th.warn:th.good;
  const off=Object.entries(groupBy(rr.filter(x=>x.status==='above'),x=>x.vehicle)).map(([v,a])=>({id:v,vehicle:v,n:a.length,avg:sum(a,x=>x.litres/x.target)/a.length*100-100,route:[...new Set(a.map(x=>laneShort(x.route)))].join(', ')})).sort((a,b)=>b.n-a.n);
  const detail=cell?(heat[cell.route+'|'+cell.date]||[]):null;
  const tableRows=(stF?rr.filter(x=>x.status===stF):rr).slice().sort((a,b)=>a.date<b.date?1:-1);
  const worstR=[...byRoute].sort((a,b)=>a.p-b.p)[0];
  const tot7=sum(last7,x=>x.within+x.near+x.above);
  return html`<div>
    <${ModHead} title="Diesel / Fuel" icon="fuel" desc="Litres per trip on each route, checked against that route’s own target." view=${view} setView=${setView}/>
    ${view==='e'?html`<${FuelEntry}/>`:html`<div>
      <${Summary} items=${[{t:w>=80?'good':w>=65?'warn':'bad',s:`${pct(w,0)} of fills were within target${route?' on '+laneShort(route):''}.`},worstR&&!route?{t:'warn',s:`${laneShort(worstR.k)} has the most fills over target.`}:null,off[0]?{t:'bad',s:`${off[0].vehicle} went above range ${off[0].n} times — book a check.`}:null]}/>
      <div className="chips" style=${{marginBottom:14}}><button className=${'chip'+(!route?' on':'')} onClick=${()=>{setRoute(null);setCell(null);}}>All lanes</button>${routes.map(r=>html`<button key=${r.k} className=${'chip'+(route===r.k?' on':'')} onClick=${()=>{setRoute(route===r.k?null:r.k);setCell(null);}}>${laneShort(r.k)} · ${r.target} L</button>`)}</div>
      <div className="kpis">
        <${Kpi} label="Within target" icon="check" value=${w} fmt=${v=>pct(v)} tone=${w>=80?'good':w>=65?'warn':'bad'} sub=${num(cnt('within'))+' of '+num(rr.length)} spark=${spk(a=>a.filter(x=>x.status==='within').length/a.length*100)} onClick=${()=>setStF(s=>s==='within'?null:'within')} active=${stF==='within'}/>
        <${Kpi} label="Near threshold" icon="alert" value=${cnt('near')} tone="warn" sub="Up to 8% over" spark=${spk(a=>a.filter(x=>x.status==='near').length)} onClick=${()=>setStF(s=>s==='near'?null:'near')} active=${stF==='near'}/>
        <${Kpi} label="Above range" icon="up" value=${cnt('above')} tone="bad" sub="More than 8% over" spark=${spk(a=>a.filter(x=>x.status==='above').length)} onClick=${()=>setStF(s=>s==='above'?null:'above')} active=${stF==='above'}/>
        <${Kpi} label="Average vs target" icon="fuel" value=${avgR} fmt=${v=>pct(v)} sub="100% = on target" tone=${avgR<=100?'good':avgR<=104?'warn':'bad'} spark=${spk(a=>sum(a,x=>x.litres/x.target)/a.length*100)}/>
      </div>
      <div className="grid g2">
        <${Card} title="Fills by lane" sub="Click a lane to focus every chart on it" insight=${[worstR?`${laneShort(worstR.k)} has the lowest share within target (${pct(worstR.p,0)}).`:null]}>
          <${ResponsiveContainer} width="100%" height=${230}><${BarChart} data=${byRoute} layout="vertical" margin=${{top:0,right:10,left:6,bottom:0}} onClick=${e=>pickBar(e,p=>{setRoute(r=>r===p.k?null:p.k);setCell(null);})} style=${{cursor:'pointer'}}>
            <${CartesianGrid} stroke=${th.grid} strokeDasharray="3 4" horizontal=${false}/><${XAxis} type="number" ...${axis(th)}/><${YAxis} type="category" dataKey="l" ...${axis(th)} width=${132}/>
            <${Tooltip} content=${tipOf((v,k,p)=>num(v)+(k==='within'?' ('+pct(p.p,0)+')':''))} cursor=${{fill:th.cursor}}/>
            ${['within','near','above'].map((k,i)=>html`<${Bar} key=${k} dataKey=${k} name=${FUEL_ST[k].l} stackId="f" fill=${FUEL_ST[k].c} maxBarSize=${30} radius=${i===2?[0,6,6,0]:0}>${byRoute.map(b=>html`<${Cell} key=${b.k} fill=${FUEL_ST[k].c} fillOpacity=${route&&route!==b.k?.22:1}/>`)}<//>`)}<//><//>
          <${Legendish} items=${Object.values(FUEL_ST)}/>
        <//>
        <${Card} title="Last 7 days · litres used" sub=${route?laneShort(route):'All lanes in view'} insight=${[tot7?`${num(tot7)} litres used; ${pct(sum(last7,x=>x.above)/tot7*100,0)} came from above-range fills.`:null]}>
          <${ResponsiveContainer} width="100%" height=${230}><${BarChart} data=${last7} margin=${{top:6,right:6,left:-8,bottom:0}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)}/><${YAxis} ...${axis(th)}/>
            <${Tooltip} content=${tipOf(v=>num1(v)+' L')} cursor=${{fill:th.cursor}}/>
            ${['within','near','above'].map((k,i)=>html`<${Bar} key=${k} dataKey=${k} name=${FUEL_ST[k].l} stackId="l" fill=${FUEL_ST[k].c} maxBarSize=${36} radius=${i===2?[6,6,0,0]:0}/>`)}<//><//>
          <${Legendish} items=${Object.values(FUEL_ST)}/>
        <//>
      </div>
      <${Card} title="Lane × day" sub="Each square is one lane on one day. Click to see the vehicles." insight=${[cell?`${laneShort(cell.route)} on ${fmtDay(cell.date)}: ${detail.filter(x=>x.status==='within').length} of ${detail.length} fills within target.`:'Green = every fill within target, amber = a fill up to 8% over, red = a fill more than 8% over.']}>
          <div style=${{overflowX:'auto',paddingBottom:4}}><div className="heat"  style=${{gridTemplateColumns:'auto repeat('+hdays.length+',minmax(14px,1fr))'}}>
            <span></span>${hdays.map((d,i)=>html`<span key=${d} className="hd">${i%4===0?+d.slice(8,10):''}</span>`)}
            ${routes.map(r=>[html`<span key=${r.k} className="hl">${laneShort(r.k)}</span>`,...hdays.map(d=>{const x=heat[r.k+'|'+d]||[]; const p=x.length?x.filter(y=>y.status==='within').length/x.length*100:null; const s=cell&&cell.route===r.k&&cell.date===d;
              return html`<button key=${r.k+d} className=${'hc'+(s?' sel':'')} style=${{background:p==null?'var(--line)':hc(x),opacity:route&&route!==r.k?.22:1}} title=${laneShort(r.k)+' · '+fmtDay(d)+(p==null?' · no fills':' · '+pct(p,0)+' within target')} aria-label=${r.k+' '+fmtDay(d)} onClick=${()=>setCell(s?null:{route:r.k,date:d})}></button>`;})])}
          </div></div>
          ${detail?html`<div style=${{marginTop:12}}><${DataTable} search=${false} cols=${[{k:'vehicle',l:'Vehicle',rn:x=>html`<${VLink} v=${x.vehicle}/>`},{k:'litres',l:'Litres',r:1,rn:x=>num1(x.litres)},{k:'target',l:'Target',r:1,cls:'calc'},{k:'status',l:'Status',rn:x=>html`<${Pill} t=${FUEL_ST[x.status].l} c=${FUEL_ST[x.status].c}/>`}]} rows=${detail}/></div>`:null}
      <//>
      <div style=${{height:16}}></div>
      <div className="grid g2">
        <${Card} title="Repeat over-consumers" sub="Vehicles most often above range">
          <div className="alist">${off.length?off.slice(0,5).map(o=>html`<div key=${o.id} className="aitem"><span className="ai" style=${{background:'#EF44441c',color:'#EF4444'}}><${Icon} n="fuel" s=${15}/></span><span><${VLink} v=${o.vehicle}/><br/><span className="muted">${o.n}× above range · ${pct(o.avg,0)} over on average · ${o.route}</span></span></div>`):html`<${Empty} t="No vehicle went above range."/>`}</div>
        <//>
        <${Card} title=${'All fills'+(stF?' · '+FUEL_ST[stF].l.toLowerCase():'')} sub="Newest first. Click a KPI above to filter by status.">
        <${More} count=${tableRows.length}><${DataTable} cols=${[{k:'date',l:'Date',rn:x=>fmtDay(x.date)},{k:'route',l:'Lane',rn:x=>laneShort(x.route)},{k:'site',l:'Centre',rn:x=>sn(x.site)},{k:'vehicle',l:'Vehicle',rn:x=>html`<${VLink} v=${x.vehicle}/>`},{k:'litres',l:'Litres',r:1,rn:x=>num1(x.litres)},{k:'target',l:'Target',r:1,cls:'calc'},{k:'status',l:'Status',rn:x=>html`<${Pill} t=${FUEL_ST[x.status].l} c=${FUEL_ST[x.status].c}/>`}]} rows=${tableRows} pageSize=${10}/><//>
        <//>
      </div></div>`}
  </div>`;
}

/* ================= PREVENTIVE MAINTENANCE ================= */
function Maintenance(){
  const app=useApp(); const {derived,th,sn}=app; const F=useF();
  const [view,setView]=useState('a'); const [make,setMake]=useState(null); const [st,setSt]=useState(null);
  const all=derived.pm.filter(x=>F.s(x.site)); const rows=all.filter(x=>(!make||x.make===make)&&(!st||x.status===st));
  const c=k=>all.filter(x=>x.status===k).length;
  const byMake=MAKES.map(m=>{const x=all.filter(y=>y.make===m); return {m,ok:x.filter(y=>y.status==='ok').length,soon:x.filter(y=>y.status==='soon').length,overdue:x.filter(y=>y.status==='overdue').length};});
  const mk=['2026-11','2026-12','2027-01'];
  const upcoming=[{l:'Overdue now',n:c('overdue'),c:th.bad},...mk.map(k=>({l:monthLabel(k),n:all.filter(x=>x.status!=='overdue'&&monthOf(x.dueDate)===k).length,c:th.accent})),{l:'Later',n:all.filter(x=>x.status!=='overdue'&&x.dueDate>='2027-02').length,c:th.faint}];
  const plan=mk.map(k=>({k,v:all.filter(x=>x.status!=='overdue'&&monthOf(x.dueDate)===k).sort((a,b)=>a.dueDate<b.dueDate?-1:1)}));
  const worstMake=[...byMake].sort((a,b)=>b.overdue-a.overdue)[0];
  const avgUsed=all.length?sum(all,x=>Math.min(x.used,150))/all.length:0;
  const cols=[{k:'vehicle',l:'Vehicle',rn:x=>html`<${VLink} v=${x.vehicle}/>`},{k:'make',l:'Type'},{k:'site',l:'Centre',rn:x=>sn(x.site)},{k:'odometer',l:'Odometer',r:1,rn:x=>num(x.odometer)},{k:'lastServiceDate',l:'Last service',rn:x=>fmtDay(x.lastServiceDate)},{k:'dueKm',l:'Next due km',r:1,cls:'calc',rn:x=>num(x.dueKm)},{k:'left',l:'Km left',r:1,cls:'calc',rn:x=>html`<span style=${{color:x.left<0?th.bad:'inherit',fontWeight:x.left<0?700:400}}>${num(x.left)}</span>`},{k:'used',l:'Interval used',cls:'calc',rn:x=>html`<div className="row"><span style=${{width:40}}>${pct(x.used,0)}</span><div style=${{width:76}}><${Prog} v=${x.used} c=${PM_ST[x.status].c}/></div></div>`},{k:'status',l:'Status',rn:x=>html`<${Pill} t=${PM_ST[x.status].l} c=${PM_ST[x.status].c}/>`}];
  return html`<div>
    <${ModHead} title="Preventive Maintenance" icon="wrench" desc="Service status by vehicle and make, with the next three months planned so repairs don’t become breakdowns." view=${view} setView=${setView}/>
    ${view==='e'?html`<${PmEntry}/>`:html`<div>
      <${Summary} items=${[{t:c('overdue')?'bad':'good',s:c('overdue')?`${c('overdue')} vehicle${c('overdue')>1?'s are':' is'} past the service interval.`:'No vehicle is overdue for service.'},{t:'warn',s:`${c('soon')} more fall due within 1,500 km.`},{t:'info',s:`${upcoming[1].n} service${upcoming[1].n===1?'':'s'} to book in ${upcoming[1].l}.`}]}/>
      <div className="kpis">
        <${Kpi} label="Vehicles tracked" icon="truck" value=${all.length} sub=${'Avg '+pct(avgUsed,0)+' of interval used'} onClick=${()=>{setSt(null);setMake(null);}} active=${!st&&!make}/>
        <${Kpi} label="Overdue" icon="alert" value=${c('overdue')} tone="bad" onClick=${()=>setSt(s=>s==='overdue'?null:'overdue')} active=${st==='overdue'}/>
        <${Kpi} label="Due soon" icon="clock" value=${c('soon')} tone="warn" sub="Within 1,500 km" onClick=${()=>setSt(s=>s==='soon'?null:'soon')} active=${st==='soon'}/>
        <${Kpi} label="OK" icon="ok" value=${c('ok')} tone="good" onClick=${()=>setSt(s=>s==='ok'?null:'ok')} active=${st==='ok'}/>
      </div>
      <div className="grid g2">
        <${Card} title="Fleet status by vehicle type" sub="Click a type to filter the list" insight=${[worstMake&&worstMake.overdue?`${worstMake.m} has the most overdue services (${worstMake.overdue}).`:'No overdue services by vehicle type.']}>
          <${ResponsiveContainer} width="100%" height=${220}><${BarChart} data=${byMake} margin=${{top:6,right:6,left:-20,bottom:0}} onClick=${e=>pickBar(e,p=>setMake(m=>m===p.m?null:p.m))} style=${{cursor:'pointer'}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="m" ...${axis(th)}/><${YAxis} ...${axis(th)} allowDecimals=${false}/>
            <${Tooltip} content=${tipOf(num)} cursor=${{fill:th.cursor}}/>
            ${['ok','soon','overdue'].map((k,i)=>html`<${Bar} key=${k} dataKey=${k} name=${PM_ST[k].l} stackId="p" fill=${PM_ST[k].c} maxBarSize=${56} radius=${i===2?[6,6,0,0]:0}>${byMake.map(b=>html`<${Cell} key=${b.m} fill=${PM_ST[k].c} fillOpacity=${make&&make!==b.m?.22:1}/>`)}<//>`)}<//><//>
          <${Legendish} items=${Object.values(PM_ST)}/>
        <//>
        <${Card} title="Upcoming services" sub="Estimated from km left at about 160 km a day" insight=${[`${upcoming[1].n} service(s) fall due in ${upcoming[1].l}; ${upcoming[0].n} are already overdue.`]}>
          <${ResponsiveContainer} width="100%" height=${220}><${BarChart} data=${upcoming} margin=${{top:6,right:6,left:-20,bottom:0}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)}/><${YAxis} ...${axis(th)} allowDecimals=${false}/>
            <${Tooltip} content=${tipOf(v=>num(v)+' vehicles')} cursor=${{fill:th.cursor}}/>
            <${Bar} dataKey="n" name="Services" radius=${[6,6,0,0]} maxBarSize=${48}>${upcoming.map((u,i)=>html`<${Cell} key=${i} fill=${u.c}/>`)}<//><//><//>
        <//>
      </div>
      <${Card} title="Quarter plan" sub="Vehicles to book, month by month">
        <div className="grid g3" style=${{marginBottom:0}}>${plan.map(p=>html`<div key=${p.k} style=${{border:'1px solid var(--line)',borderRadius:12,padding:'12px 14px'}}><div className="row"><b style=${{fontFamily:'Sora,sans-serif',fontSize:13.5}}>${monthLabel(p.k)}</b><span className="sp"></span><${Pill} t=${p.v.length+' due'} c=${th.accent}/></div>
          <div className="row wrap" style=${{gap:6,marginTop:10}}>${p.v.length?p.v.map(x=>html`<button key=${x.id} className="chip" title=${'Open '+x.vehicle+' · '+x.make+' · '+sn(x.site)} onClick=${()=>app.openVehicle(x.vehicle)}>${x.vehicle} · ${fmtDay(x.dueDate)}</button>`):html`<span className="muted sm">Nothing due</span>`}</div></div>`)}</div>
      <//>
      <div style=${{height:16}}></div>
      <${Card} title=${'Vehicles'+(make?' · '+make:'')+(st?' · '+PM_ST[st].l.toLowerCase():'')} sub="Sorted by km left, most urgent first">
        <${More} count=${rows.length} open=${!!(st||make)}><${DataTable} cols=${cols} rows=${rows} initialSort=${{k:'left',dir:1}} pageSize=${10}/><//>
      <//></div>`}
  </div>`;
}

/* ================= NETWORK MAP ================= */
const OP_STATES=['West Bengal','Odisha','Jharkhand','Chhattisgarh','Assam'];
const proj=([lon,lat])=>[INDIA.pad+(lon*Math.PI/180-INDIA.x0)*INDIA.k, INDIA.pad+(INDIA.y1-Math.log(Math.tan(Math.PI/4+lat*Math.PI/360)))*INDIA.k];
const EAST_VB=(()=>{const a=proj([80.6,28.1]),b=proj([95.0,18.4]); return [a[0],a[1],b[0]-a[0],b[1]-a[1]];})();
const ALL_VB=[0,0,INDIA.W,INDIA.H];
function NetworkCard(){
  const app=useApp(); const {derived,data,sn,setFilters,th,latestMonth}=app; const F=useF();
  const [zoom,setZoom]=useState('east'); const [vb,setVb]=useState(EAST_VB); const [hov,setHov]=useState(null); const vbRef=useRef(EAST_VB); const box=useRef();
  useEffect(()=>{const from=vbRef.current, to=zoom==='east'?EAST_VB:ALL_VB, t0=performance.now(); let raf;
    const step=t=>{const p=Math.min(1,(t-t0)/750), e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2; const v=from.map((x,i)=>x+(to[i]-x)*e); vbRef.current=v; setVb(v); if(p<1) raf=requestAnimationFrame(step);};
    raf=requestAnimationFrame(step); return ()=>cancelAnimationFrame(raf);},[zoom]);
  const m=F.month==='all'?null:F.month;
  const st=useMemo(()=>CENTRES.map(c=>{
    const dr=derived.daily.filter(x=>x.site===c.k&&(!m||monthOf(x.date)===m)); const mv=sum(dr,x=>x.transit)/Math.max(1,sum(dr,x=>x.deployed))*100;
    const tr=derived.trips.filter(x=>x.site===c.k&&(!m||monthOf(x.date)===m));
    return {...c,veh:data.vehicles.filter(v=>v.site===c.k).length,mv,rev:sum(tr,x=>x.revenue),trips:tr.length,clients:CLIENTS.filter(x=>x.site===c.k).length,xy:proj(c.ll)};
  }),[derived,data.vehicles,F.month]);
  const s=Math.max(vb[2]/640,vb[3]/470); const showLbl=vb[2]<INDIA.W*.7; const col=v=>v>=82?th.good:v>=75?th.warn:th.bad;
  const pickC=k=>setFilters(f=>({...f,site:f.site===k?'all':k}));
  const tot={veh:sum(st,x=>x.veh),rev:sum(st,x=>x.rev)};
  const onMove=(e,c)=>{const r=box.current.getBoundingClientRect(); setHov({c,x:e.clientX-r.left,y:e.clientY-r.top});};
  return html`<${Card} title="Our network" sub="Seven centres across East and North-East India. Hover a centre for details, click it to focus the whole app on that centre.">
    ${html`<div className="stats" style=${{marginBottom:14}}><span className="stat"><b>${CENTRES.length}</b>centres</span><span className="stat"><b>${tot.veh}</b>vehicles</span><span className="stat"><b>${CLIENTS.length}</b>clients</span><span className="stat"><b>${money(tot.rev)}</b>${m?'revenue in '+monthShort(m):'revenue'}</span></div>`}
    <div className="netgrid">
      <div className="mapbox" ref=${box} onMouseLeave=${()=>setHov(null)}>
        <div className="mapctl"><div className="seg alt"><button className=${zoom==='east'?'on':''} onClick=${()=>setZoom('east')}>East India</button><button className=${zoom==='india'?'on':''} onClick=${()=>setZoom('india')}>All India</button></div></div>
        <svg viewBox=${vb.join(' ')} preserveAspectRatio="xMidYMid meet" role="img" aria-label="Map of India with seven centres in the east" style=${{height:"100%",position:"absolute",inset:0}}>
          ${INDIA.states.map(x=>html`<path key=${x.n} d=${x.d} className=${'st'+(OP_STATES.includes(x.n)?' op':'')} strokeWidth=${.7*s}/>`)}
          ${showLbl&&INDIA.states.filter(x=>OP_STATES.includes(x.n)).map(x=>html`<text key=${'l'+x.n} x=${x.c[0]} y=${x.c[1]+(x.n==='West Bengal'?14:x.n==='Jharkhand'?-6:0)} textAnchor="middle" className="stl" style=${{fontSize:9*s+'px'}}>${x.n}</text>`)}
          ${st.map(c=>{const ln=LANES.find(l=>l.site===c.k); const a=c.xy, b=proj(ln.to); const mx=(a[0]+b[0])/2-(b[1]-a[1])*.25, my=(a[1]+b[1])/2+(b[0]-a[0])*.25; return html`<g key=${'ln'+c.k} opacity=${F.site!=='all'&&F.site!==c.k?.15:1}><path d=${`M${a[0]},${a[1]} Q${mx},${my} ${b[0]},${b[1]}`} className="lane" strokeWidth=${1.6*s} style=${{strokeDasharray:`${4*s} ${5*s}`}}/><circle cx=${b[0]} cy=${b[1]} r=${2.2*s} fill=${th.accent}/></g>`;})}
          ${st.map(c=>{const R=(4.5+Math.sqrt(c.veh)*1.1)*s, dim=F.site!=='all'&&F.site!==c.k; return html`<g key=${c.k} className="cdot" opacity=${dim?.35:1} onClick=${()=>pickC(c.k)} onMouseMove=${e=>onMove(e,c)} role="button" tabIndex=${0} aria-label=${sn(c.k)+', '+c.veh+' vehicles'} onKeyDown=${e=>{if(e.key==='Enter') pickC(c.k);}}>
            <circle cx=${c.xy[0]} cy=${c.xy[1]} r=${R} fill=${col(c.mv)} opacity=".25"><animate attributeName="r" values=${`${R};${R*2.1};${R}`} dur="2.6s" repeatCount="indefinite"/><animate attributeName="opacity" values=".3;0;.3" dur="2.6s" repeatCount="indefinite"/></circle>
            <circle className="core" cx=${c.xy[0]} cy=${c.xy[1]} r=${R} fill=${col(c.mv)} stroke="#fff" strokeWidth=${1.6*s}/>
            <text x=${c.xy[0]} y=${c.xy[1]+R*.35} textAnchor="middle" fill="#fff" style=${{font:`700 ${8.5*s}px Sora,sans-serif`,pointerEvents:'none'}}>${c.veh}</text>
            ${showLbl?html`<text x=${c.xy[0]+R+3*s} y=${c.xy[1]-R*.2} className="clabel" style=${{fontSize:10.5*s+'px',strokeWidth:3*s+'px'}}>${sn(c.k)}</text>`:null}</g>`;})}
        </svg>
        ${hov?html`<div className="mtip" style=${{left:hov.x,top:hov.y}}><b>${sn(hov.c.k)}</b> <span className="muted">· ${hov.c.st}</span><div className="muted sm" style=${{margin:'2px 0 6px'}}>${hov.c.focus}</div>
          <div className="tip-r"><span>Vehicles</span><b>${hov.c.veh}</b></div><div className="tip-r"><span>Moving</span><b>${pct(hov.c.mv,0)}</b></div><div className="tip-r"><span>Clients</span><b>${hov.c.clients}</b></div><div className="tip-r"><span>Revenue</span><b>${money(hov.c.rev)}</b></div><div className="tip-r"><span>Main lane</span><b>${laneShort(LANES.find(l=>l.site===hov.c.k).k)}</b></div></div>`:null}
        <div className="attr">Map: <a href="https://github.com/datameet/maps" target="_blank" rel="noopener">DataMeet</a>, CC BY 4.0</div>
      </div>
      <div className="clist">
        ${[...st].sort((a,b)=>b.veh-a.veh).map(c=>html`<button key=${c.k} className=${'crow'+(F.site===c.k?' on':'')} onClick=${()=>pickC(c.k)}><span className="sdot" style=${{background:col(c.mv),width:10,height:10}}></span><span style=${{minWidth:0}}><b>${sn(c.k)}</b><small>${c.st} · ${c.focus}</small></span><span className="num" style=${{textAlign:'right'}}><b>${c.veh}</b><small>vehicles</small></span><span><span className="num sm" style=${{display:'block',textAlign:'right',fontWeight:600}}>${pct(c.mv,0)}</span><${Prog} v=${c.mv} c=${col(c.mv)}/></span></button>`)}
        <div className="legend" style=${{marginTop:4}}><span className="legend-k"><span className="sw" style=${{background:th.good,borderRadius:'50%'}}></span>Moving 82%+</span><span className="legend-k"><span className="sw" style=${{background:th.warn,borderRadius:'50%'}}></span>75–82%</span><span className="legend-k"><span className="sw" style=${{background:th.bad,borderRadius:'50%'}}></span>Below 75%</span><span className="legend-k"><span className="sw" style=${{background:th.accent,height:3,borderRadius:2}}></span>Main lane</span></div>
      </div>
    </div>
  <//>`;
}

/* ================= DATA ENTRY: Daily Monitoring ================= */
const latestDate=arr=>arr.reduce((m,x)=>x.date>m?x.date:m,'');
function DailyEntry({newDay}){
  const {data,sn}=useApp(); const F=useF(); const saveAll=useSaver('Daily Truck Running');
  const [date,setDate]=useState(()=>latestDate(data.daily));
  const rows=useMemo(()=>CENTRES.filter(c=>F.s(c.k)).map(c=>{const rec=data.daily.find(x=>x.date===date&&x.site===c.k); const o={_k:c.k,site:c.k,_rec:rec}; ['deployed',...STATUS.map(s=>s.k)].forEach(k=>o[k]=rec?rec[k]:''); return o;}),[data.daily,date,F.site]);
  const cols=[{k:'site',l:'Centre',label:true,fmt:v=>sn(v)},{k:'deployed',l:'Deployed',g:'Fleet',t:'num'},...STATUS.map((s,i)=>({k:s.k,l:s.l,g:i<2?'Moving':'Not moving',t:'num'})),
    {k:'_tot',l:'Row total',g:'Checks',calc:r=>dailyTotal(r)},{k:'_ok',l:'Adds up',g:'Checks',calc:r=>dailyTotal(r)===N(r.deployed),fmt:v=>html`<${Tick} ok=${v}/>`},{k:'_mv',l:'Moving %',g:'Checks',calc:r=>N(r.deployed)?(N(r.loadT)+N(r.unloadT))/N(r.deployed)*100:0,fmt:v=>pct(v,0)}];
  const foot=rs=>{const o={}; ['deployed',...STATUS.map(s=>s.k)].forEach(k=>o[k]=sum(rs,r=>r[k])); o._tot=sum(rs,r=>dailyTotal(r)); const d=sum(rs,r=>N(r.deployed)); o._mv=d?pct(sum(rs,r=>N(r.loadT)+N(r.unloadT))/d*100,0):''; return o;};
  const onSave=({changes})=>saveAll(changes.map(({row,patch})=>row._rec?{coll:'daily',action:'edit',record:{...row._rec,...patch},before:row._rec}:{coll:'daily',action:'add',record:{id:uid(),date,site:row.site,deployed:0,...Object.fromEntries(STATUS.map(s=>[s.k,0])),...patch}}));
  return html`<${Card} title=${'Daily running sheet · '+fmtDay(date)} sub="One row per centre. Every status should add up to the trucks deployed.">
    <${Grid} xname=${'Daily running sheet '+date} cols=${cols} rows=${rows} rkey=${date+F.site} onSave=${onSave} foot=${foot} toolbar=${html`<div className="row" style=${{gap:8}}><${DatePick} value=${date} onChange=${setDate}/><button className="btn" onClick=${()=>{const nd=newDay(); if(nd) setDate(nd);}}><${Icon} n="calplus" s=${15}/>Start new day</button></div>`}/>
  <//>`;
}
function FuelEntry(){
  const {data}=useApp(); const F=useF();
  const [date,setDate]=useState(()=>latestDate(data.fuel)); const lanes=LANES.filter(l=>F.s(l.site));
  const vehOf=k=>data.vehicles.filter(v=>v.site===fuelRoute(k).site).map(v=>v.vehicle);
  const cols=[{k:'route',l:'Lane',t:'select',o:lanes.map(l=>l.k),ol:laneShort,fmt:laneShort},{k:'vehicle',l:'Vehicle',t:'select',o:r=>vehOf(r.route)},{k:'litres',l:'Litres used',t:'num'},
    {k:'_t',l:'Lane target (L)',calc:r=>fuelRoute(r.route).target},{k:'_p',l:'vs target',calc:r=>N(r.litres)/fuelRoute(r.route).target*100,fmt:v=>pct(v,0)},{k:'_s',l:'Status',calc:r=>fuelStatus(r.litres,fuelRoute(r.route).target),fmt:v=>html`<${Pill} t=${FUEL_ST[v].l} c=${FUEL_ST[v].c}/>`}];
  const order=Object.fromEntries(LANES.map((l,i)=>[l.k,i]));
  return html`<${Card} title=${'Diesel fills · '+fmtDay(date)} sub="One row per fill. Status is checked against each lane’s own target.">
    <${RecordGrid} xname=${'Diesel fills '+date} coll="fuel" module="Diesel / Fuel" cols=${cols} rkey=${date+F.site} filter=${x=>x.date===date&&F.s(fuelRoute(x.route).site)} sort=${(a,b)=>order[a.route]-order[b.route]} onAdd=${()=>({date,route:lanes[0].k,vehicle:vehOf(lanes[0].k)[0],litres:''})} toolbar=${html`<${DatePick} value=${date} onChange=${setDate}/>`}/>
  <//>`;
}
function PmEntry(){
  const {sn}=useApp(); const F=useF();
  const cols=[{k:'vehicle',l:'Vehicle',g:'Vehicle',t:'text',lock:true},{k:'make',l:'Type',g:'Vehicle',t:'select',o:MAKES},{k:'site',l:'Centre',g:'Vehicle',t:'select',o:SITES,ol:sn,fmt:sn},
    {k:'odometer',l:'Odometer km',g:'Service record',t:'num'},{k:'lastServiceKm',l:'Last service km',g:'Service record',t:'num'},{k:'lastServiceDate',l:'Last service date',g:'Service record',t:'date'},{k:'intervalKm',l:'Interval km',g:'Service record',t:'num'},
    {k:'_d',l:'Next due km',g:'Next service',calc:r=>pmCalc(r).dueKm,fmt:num},{k:'_l',l:'Km left',g:'Next service',calc:r=>pmCalc(r).left,fmt:num},{k:'_s',l:'Status',g:'Next service',calc:r=>pmCalc(r).status,fmt:v=>html`<${Pill} t=${PM_ST[v].l} c=${PM_ST[v].c}/>`}];
  return html`<${Card} title="Vehicle service register" sub="Update the odometer and last service; the next due date works itself out.">
    <${RecordGrid} xname="Vehicle service register" coll="pm" module="Preventive Maintenance" cols=${cols} rkey=${F.site} search=${true} filter=${x=>F.s(x.site)} sort=${(a,b)=>a.vehicle<b.vehicle?-1:1} onAdd=${()=>({vehicle:'',make:'Tipper',site:F.site!=='all'?F.site:'KOL',odometer:'',lastServiceKm:'',lastServiceDate:DEMO_TODAY,intervalKm:8000})}/>
  <//>`;
}
