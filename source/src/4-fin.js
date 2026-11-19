/* ================= MARKET OPS ================= */
function Market(){
  const app=useApp(); const {data,settings,th,latestMonth}=app; const F=useF();
  const [view,setView]=useState('a'); const [area,setArea]=useState(null);
  const rows=data.market.filter(x=>F.m(x.date)); const rr=area?rows.filter(x=>x.area===area):rows;
  const B=sum(rr,x=>x.bookings), P=sum(rr,x=>x.placements), fill=B?P/B*100:0, det=rr.length?sum(rr,x=>x.detentionHrs)/rr.length:0;
  const byD=groupBy(rr,x=>x.date); const dk=Object.keys(byD).sort().slice(-21); const spk=f=>dk.map(d=>f(byD[d]));
  const byArea=AREAS.map(a=>{const x=rows.filter(y=>y.area===a); const b=sum(x,y=>y.bookings),p=sum(x,y=>y.placements); return {a,bookings:b,placements:p,fill:b?p/b*100:0,det:x.length?sum(x,y=>y.detentionHrs)/x.length:0};});
  const m=F.month==='all'?latestMonth:F.month; const mr=data.market.filter(x=>monthOf(x.date)===m&&(!area||x.area===area));
  const tgt=area?mktTgt(settings,m,area):sum(AREAS,a=>mktTgt(settings,m,a));
  const dm=daysInMonth(m); const lastD=mr.reduce((mx,x)=>x.date>mx?x.date:mx,''); const days=lastD?+lastD.slice(8,10):0;
  const pace=[]; let run=0; for(let i=1;i<=days;i++){const d=m+'-'+pad(i); run+=sum(mr.filter(x=>x.date===d),x=>x.placements); pace.push({l:fmtDay(d),actual:run,target:Math.round(tgt/dm*i)});}
  const paceIdx=days?run/(tgt/dm*days)*100:0;
  const routes=byArea.map(x=>({...x,id:x.a,route:x.a,tgt:mktTgt(settings,m,x.a)}));
  const lowA=[...byArea].sort((a,b)=>a.fill-b.fill)[0]; const hiD=[...byArea].sort((a,b)=>b.det-a.det)[0];
  return html`<div>
    <${ModHead} title="Market Ops" icon="pin" desc="Market loads booked against trucks placed in each state, with waiting time and month pace. The centre filter does not apply here." view=${view} setView=${setView}/>
    ${view==='e'?html`<${MarketEntry}/>`:html`<div>
      <${Summary} items=${[{t:fill>=90?'good':fill>=80?'warn':'bad',s:`${pct(fill,0)} of bookings were placed${area?' in '+area:''}.`},lowA&&!area?{t:'bad',s:`${lowA.a} converts the fewest bookings (${pct(lowA.fill,0)}).`}:null,{t:paceIdx>=95?'good':'warn',s:`${monthLabel(m)} placements are at ${pct(paceIdx,0)} of target pace.`}]}/>
      <div className="chips" style=${{marginBottom:14}}><button className=${'chip'+(!area?' on':'')} onClick=${()=>setArea(null)}>All states</button>${AREAS.map(a=>html`<button key=${a} className=${'chip'+(area===a?' on':'')} onClick=${()=>setArea(area===a?null:a)}>${a}</button>`)}</div>
      <div className="kpis">
        <${Kpi} label="Bookings" icon="calplus" value=${B} sub=${num(P)+' placed'} spark=${spk(a=>sum(a,x=>x.bookings))}/>
        <${Kpi} label="Fill rate" icon="check" value=${fill} fmt=${v=>pct(v)} tone=${fill>=90?'good':fill>=80?'warn':'bad'} sub=${num(B-P)+' not placed'} spark=${spk(a=>sum(a,x=>x.placements)/Math.max(1,sum(a,x=>x.bookings))*100)}/>
        <${Kpi} label="Avg detention" icon="clock" value=${det} fmt=${v=>num1(v)+' h'} tone=${det<=6?'good':det<=8?'warn':'bad'} sub="Waiting per booking" spark=${spk(a=>sum(a,x=>x.detentionHrs)/a.length)}/>
        <${Kpi} label=${'Pace · '+monthShort(m)} icon="route" value=${paceIdx} fmt=${v=>pct(v,0)} tone=${paceIdx>=95?'good':paceIdx>=85?'warn':'bad'} sub=${num(run)+' of '+num(tgt)}/>
      </div>
      <div className="grid g2">
        <${Card} title="Bookings vs placements" sub="Click a state to focus" insight=${[lowA?`${lowA.a} loses the most bookings — each unplaced booking is lost revenue.`:null]}>
          <${ResponsiveContainer} width="100%" height=${240}><${BarChart} data=${byArea} margin=${{top:6,right:6,left:-10,bottom:0}} barGap=${4} onClick=${e=>pickBar(e,p=>setArea(a=>a===p.a?null:p.a))} style=${{cursor:'pointer'}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="a" ...${axis(th)} interval=${0} tick=${{fill:th.muted,fontSize:10}}/><${YAxis} ...${axis(th)}/>
            <${Tooltip} content=${tipOf((v,k,p)=>num(v)+(k==='placements'?' ('+pct(p.fill,0)+')':''))} cursor=${{fill:th.cursor}}/>
            <${Bar} dataKey="bookings" name="Bookings" fill=${th.faint} radius=${[6,6,0,0]} maxBarSize=${26}>${byArea.map(b=>html`<${Cell} key=${b.a} fill=${th.faint} fillOpacity=${area&&area!==b.a?.3:1}/>`)}<//>
            <${Bar} dataKey="placements" name="Placements" fill=${th.accent} radius=${[6,6,0,0]} maxBarSize=${26}>${byArea.map(b=>html`<${Cell} key=${b.a} fill=${th.accent} fillOpacity=${area&&area!==b.a?.3:1}/>`)}<//><//><//>
          <${Legendish} items=${[{l:'Bookings',c:th.faint},{l:'Placements',c:th.accent}]}/>
        <//>
        <${Card} title=${'Month pace · '+monthLabel(m)+(area?' · '+area:'')} sub=${'Cumulative placements vs a monthly target of '+num(tgt)} insight=${[`Placements are at ${pct(paceIdx,0)} of where they should be after ${days} days.`]}>
          <${ResponsiveContainer} width="100%" height=${240}><${ComposedChart} data=${pace} margin=${{top:6,right:8,left:-6,bottom:0}}>
            <defs><linearGradient id="gpace" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor=${th.accent} stopOpacity=${.28}/><stop offset="100%" stopColor=${th.accent} stopOpacity=${0}/></linearGradient></defs>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)} minTickGap=${24}/><${YAxis} ...${axis(th)}/>
            <${Tooltip} content=${tipOf(num)}/>
            <${Area} dataKey="actual" name="Placements" stroke=${th.accent} strokeWidth=${2.4} fill="url(#gpace)"/><${Line} dataKey="target" name="Target pace" stroke=${th.muted} strokeDasharray="5 4" dot=${false}/><//><//>
          <${Legendish} items=${[{l:'Placements',c:th.accent},{l:'Target pace (dashed)',c:th.muted}]}/>
        <//>
      </div>
      <div className="grid g2">
        <${Card} title="Average detention by state" sub="Hours a truck waits at loading or unloading" insight=${[hiD?`${hiD.a} has the longest waits (${num1(hiD.det)} h), tying up trucks that could take another booking.`:null]}>
          <${ResponsiveContainer} width="100%" height=${220}><${BarChart} data=${byArea} margin=${{top:6,right:6,left:-20,bottom:0}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="a" ...${axis(th)} interval=${0} tick=${{fill:th.muted,fontSize:10}}/><${YAxis} ...${axis(th)}/>
            <${Tooltip} content=${tipOf(v=>num1(v)+' h')} cursor=${{fill:th.cursor}}/><${ReferenceLine} y=${8} stroke=${th.bad} strokeDasharray="4 4" label=${{value:'8 h limit',fill:th.bad,fontSize:11,position:'insideTopRight'}}/>
            <${Bar} dataKey="det" name="Detention" radius=${[6,6,0,0]} maxBarSize=${40}>${byArea.map(b=>html`<${Cell} key=${b.a} fill=${b.det>8?th.bad:b.det>6?th.warn:th.good}/>`)}<//><//><//>
        <//>
        <${Card} title="State detail" sub="Lowest fill first">
          <${DataTable} xname="Market by state" search=${false} pageSize=${6} initialSort=${{k:'fill',dir:1}} cols=${[{k:'route',l:'State'},{k:'bookings',l:'Booked',r:1},{k:'placements',l:'Placed',r:1},{k:'fill',l:'Fill',rn:x=>html`<div className="row"><span style=${{width:36}}>${pct(x.fill,0)}</span><div style=${{width:64}}><${Prog} v=${x.fill} c=${x.fill>=90?th.good:x.fill>=80?th.warn:th.bad}/></div></div>`},{k:'det',l:'Wait',r:1,rn:x=>num1(x.det)+' h'}]} rows=${routes}/>
        <//>
      </div></div>`}
  </div>`;
}

/* ================= FINANCIALS ================= */
function Financials(){
  const app=useApp(); const {derived,th}=app; const F=useF();
  const [view,setView]=useState('a'); const [br,setBr]=useState(null);
  const base=derived.trips.filter(x=>F.s(x.site)&&(!br||x.branch===br)); const rows=base.filter(x=>F.m(x.date));
  const s=k=>sum(rows,x=>N(x[k])); const rev=s('revenue'), cost=s('cost'), rep=s('repair'), net=s('net'), mg=rev?net/rev*100:0;
  const wk=f=>series(rows,'date',f);
  let run=0; const steps=[['Revenue',rev,'r'],['Allowance',-s('allowance')],['Additive',-s('additive')],['Fuel',-s('fuel')],['Route exp.',-s('routeExp')],['Toll',-s('toll')],['Repairs',-rep]].map(([l,v,t])=>{if(t==='r'){run=v; return {l,_base:0,v,c:th.accent,raw:v};} const b=run+v; run=b; return {l,_base:Math.max(0,b),v:Math.abs(v),c:'#F87171',raw:v};});
  steps.push({l:'Net profit',_base:Math.min(0,net),v:Math.abs(net),c:net>=0?th.good:th.bad,raw:net});
  const byBr=BRANCHES.map(b=>{const x=derived.trips.filter(y=>F.s(y.site)&&F.m(y.date)&&y.branch===b); const r=sum(x,y=>y.revenue), n=sum(x,y=>y.net); return {b,revenue:r,net:n,m:r?n/r*100:0,trips:x.length};});
  const trend=app.months.map(m=>{const x=base.filter(y=>monthOf(y.date)===m); return {l:monthLabel(m),revenue:sum(x,y=>y.revenue),cost:sum(x,y=>y.cost+y.repair),net:sum(x,y=>y.net)};});
  const fuelShare=rev?s('fuel')/rev*100:0; const weak=[...byBr].sort((a,b)=>a.m-b.m)[0];
  return html`<div>
    <${ModHead} title="Financials" icon="rupee" desc="Trip profitability: revenue less trip costs, then repairs shared by each vehicle’s trip days." view=${view} setView=${setView}/>
    ${view==='e'?html`<${TripEntry}/>`:html`<div>
      <${Summary} items=${[{t:mg>=15?'good':mg>=0?'warn':'bad',s:`Net margin is ${pct(mg)} on ${money(rev)} of revenue${br?' from '+br:''}.`},{t:'info',s:`Fuel is the biggest cost at ${pct(fuelShare,0)} of revenue.`},weak&&!br?{t:'warn',s:`${weak.b} earns the thinnest margin (${pct(weak.m)}).`}:null]}/>
      <div className="chips" style=${{marginBottom:14}}><button className=${'chip'+(!br?' on':'')} onClick=${()=>setBr(null)}>All segments</button>${BRANCHES.map(b=>html`<button key=${b} className=${'chip'+(br===b?' on':'')} onClick=${()=>setBr(br===b?null:b)}>${b}</button>`)}</div>
      <div className="kpis">
        <${Kpi} label="Revenue" icon="rupee" value=${rev} fmt=${money} sub=${num(rows.length)+' trips'} spark=${wk(a=>sum(a,x=>x.revenue))}/>
        <${Kpi} label="Trip cost" icon="truck" value=${cost} fmt=${money} sub=${pct(rev?cost/rev*100:0,0)+' of revenue'} tone="warn" spark=${wk(a=>sum(a,x=>x.cost))}/>
        <${Kpi} label="Net profit" icon="up" value=${net} fmt=${money} tone=${net>=0?'good':'bad'} sub=${'After '+money(rep)+' repairs'} spark=${wk(a=>sum(a,x=>x.net))}/>
        <${Kpi} label="Net margin" icon="pie" value=${mg} fmt=${v=>pct(v)} tone=${mg>=15?'good':mg>=0?'warn':'bad'} spark=${wk(a=>{const r=sum(a,x=>x.revenue); return r?sum(a,x=>x.net)/r*100:0;})}/>
      </div>
      <div className="grid g21">
        <${Card} title="From revenue to net profit" sub=${br||'All segments'} insight=${[`Repairs shared across trips take ${money(rep)} off trip profit.`]}>
          <${ResponsiveContainer} width="100%" height=${270}><${BarChart} data=${steps} margin=${{top:8,right:8,left:4,bottom:0}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)} interval=${0}/><${YAxis} ...${axis(th)} tickFormatter=${shortMoney}/>
            <${Tooltip} content=${p=>p.active&&p.payload&&p.payload.length?html`<div className="tip"><div className="tip-l">${p.label}</div><div className="tip-r"><span>Amount</span><b>${moneyFull(p.payload[0].payload.raw)}</b></div></div>`:null} cursor=${{fill:th.cursor}}/>
            <${Bar} dataKey="_base" stackId="w" fill="transparent"/><${Bar} dataKey="v" stackId="w" radius=${[6,6,6,6]} maxBarSize=${46}>${steps.map((x,i)=>html`<${Cell} key=${i} fill=${x.c}/>`)}<//><//><//>
        <//>
        <${Card} title="Profit by segment" sub="Click a segment to filter" insight=${[weak?`${weak.b} has the lowest margin at ${pct(weak.m)}.`:null]}>
          <${ResponsiveContainer} width="100%" height=${270}><${BarChart} data=${byBr} margin=${{top:8,right:6,left:-6,bottom:0}} barGap=${4} onClick=${e=>pickBar(e,p=>setBr(b=>b===p.b?null:p.b))} style=${{cursor:'pointer'}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="b" ...${axis(th)} interval=${0} tick=${{fill:th.muted,fontSize:10.5}}/><${YAxis} ...${axis(th)} tickFormatter=${shortMoney}/>
            <${Tooltip} content=${tipOf((v,k,p)=>moneyFull(v)+(k==='net'?' ('+pct(p.m)+')':''))} cursor=${{fill:th.cursor}}/>
            <${Bar} dataKey="revenue" name="Revenue" fill=${th.faint} radius=${[6,6,0,0]} maxBarSize=${34}>${byBr.map(x=>html`<${Cell} key=${x.b} fill=${th.faint} fillOpacity=${br&&br!==x.b?.3:1}/>`)}<//>
            <${Bar} dataKey="net" name="Net profit" fill=${th.accent} radius=${[6,6,0,0]} maxBarSize=${34}>${byBr.map(x=>html`<${Cell} key=${x.b} fill=${th.accent} fillOpacity=${br&&br!==x.b?.3:1}/>`)}<//><//><//>
          <${Legendish} items=${[{l:'Revenue',c:th.faint},{l:'Net profit',c:th.accent}]}/>
        <//>
      </div>
      <${TopClients} br=${br}/>
      <${Card} title="Trend by month" sub="Every month is shown here, whichever month tab is selected" insight=${[trend.length>1?`Net profit moved from ${money(trend[0].net)} in ${trend[0].l} to ${money(trend[trend.length-1].net)} in ${trend[trend.length-1].l}.`:null]}>
        <${ResponsiveContainer} width="100%" height=${240}><${ComposedChart} data=${trend} margin=${{top:8,right:8,left:4,bottom:0}}>
          <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)}/><${YAxis} ...${axis(th)} tickFormatter=${shortMoney}/>
          <${Tooltip} content=${tipOf(moneyFull)} cursor=${{fill:th.cursor}}/>
          <${Bar} dataKey="revenue" name="Revenue" fill=${th.accent} radius=${[6,6,0,0]} maxBarSize=${40}/><${Bar} dataKey="cost" name="Cost incl. repairs" fill=${th.faint} radius=${[6,6,0,0]} maxBarSize=${40}/><${Line} dataKey="net" name="Net profit" stroke=${th.good} strokeWidth=${2.5} dot=${{r:4,fill:th.good}}/><//><//>
        <${Legendish} items=${[{l:'Revenue',c:th.accent},{l:'Cost incl. repairs',c:th.faint},{l:'Net profit',c:th.good}]}/>
      <//></div>`}
  </div>`;
}

/* ================= FLEET COST ================= */
const CC=['#14B8A6','#0E7490','#F59E0B','#3B82F6','#A78BFA','#EF4444','#84CC16','#94A3B8'];
function CostOverview(){
  const app=useApp(); const {data,settings,th,sn,go,setFilters,months}=app; const F=useF(); const [view,setView]=useState('a');
  const rows=data.cost.filter(x=>F.m(x.date)&&F.s(x.site)); const A=sum(rows,x=>x.amount), T=costTargetFor(settings,COST_CATS.map(c=>c.k),F,months);
  const byCat=COST_CATS.map((c,i)=>{const a=sum(rows.filter(x=>x.category===c.k),x=>x.amount), t=costTargetFor(settings,[c.k],F,months); return {k:c.k,l:c.l,actual:a,target:t,p:t?a/t*100:0,c:CC[i]};});
  const bySite=SITES.map(s=>{const o={s,name:sn(s)}; COST_CATS.forEach(c=>o[c.k]=sum(data.cost.filter(x=>F.m(x.date)&&x.site===s&&x.category===c.k),x=>x.amount)); return o;});
  const trend=months.map(m=>{const o={l:monthLabel(m)}; COST_CATS.forEach(c=>o[c.k]=sum(data.cost.filter(x=>monthOf(x.date)===m&&F.s(x.site)&&x.category===c.k),x=>x.amount)); return o;});
  const over=byCat.filter(c=>c.p>100).sort((a,b)=>b.p-a.p); const pend=rows.filter(x=>x.status==='Pending');
  const wk=cumul(series(rows,'date',a=>sum(a,x=>x.amount)));
  return html`<div>
    <${ModHead} title="Management Overview" icon="pie" desc="Every fleet cost head in one place, against its monthly target." view=${view} setView=${setView}/>
    ${view==='e'?html`<${CostGrid}/>`:html`<div>
      <${Summary} items=${[{t:A<=T?'good':'bad',s:`Fleet cost is ${pct(T?A/T*100:0,0)} of target — ${A<=T?money(T-A)+' under':money(A-T)+' over'}.`},over.length?{t:'warn',s:`${over.map(c=>c.l).join(', ')} ${over.length>1?'are':'is'} over target.`}:{t:'good',s:'Every category is within target.'},pend.length?{t:'info',s:`${pend.length} entries (${money(sum(pend,x=>x.amount))}) are still pending approval.`}:null]}/>
      <div className="kpis">
        <${Kpi} label="Total spend" icon="rupee" value=${A} fmt=${money} sub=${num(rows.length)+' entries'} spark=${wk}/>
        <${Kpi} label="Target" icon="check" value=${T} fmt=${money} sub=${F.month==='all'?months.length+' months':'This month'}/>
        <${Kpi} label="Variance" icon=${A<=T?'down':'up'} value=${A-T} fmt=${money} tone=${A<=T?'good':'bad'} sub=${A<=T?'Under target':'Over target'}/>
        <${Kpi} label="Pending approval" icon="clock" value=${pend.length} sub=${money(sum(pend,x=>x.amount))} tone=${pend.length?'warn':'good'}/>
      </div>
      <${Card} title="Spend vs target by category" sub="Click a row to open the category">
        <div className="alist">${byCat.map(c=>html`<button key=${c.k} className="aitem" onClick=${()=>go(CAT[c.k].page)} style=${{display:'grid',gridTemplateColumns:'30px minmax(120px,1.2fr) minmax(100px,2fr) 90px 54px 16px',gap:12}}>
          <span className="ai" style=${{background:c.c+'1f',color:c.c}}><${Icon} n=${CAT[c.k].i} s=${15}/></span><b>${c.l}</b>
          <${Prog} v=${c.p} c=${c.p>108?th.bad:c.p>100?th.warn:th.accent}/><span className="num" style=${{textAlign:'right'}}>${money(c.actual)}</span><span className="num muted" style=${{textAlign:'right',color:c.p>100?th.bad:undefined,fontWeight:c.p>100?700:400}}>${pct(c.p,0)}</span><span className="go"><${Icon} n="arrow" s=${15}/></span></button>`)}</div>
      <//>
      <div style=${{height:16}}></div>
      <div className="grid g2">
        <${Card} title="Spend by centre" sub="Click a centre to filter">
          <${ResponsiveContainer} width="100%" height=${250}><${BarChart} data=${bySite} margin=${{top:6,right:6,left:4,bottom:0}} onClick=${e=>pickBar(e,p=>setFilters(f=>({...f,site:f.site===p.s?'all':p.s})))} style=${{cursor:'pointer'}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="name" ...${axis(th)} interval=${0} tick=${{fill:th.muted,fontSize:10}}/><${YAxis} ...${axis(th)} tickFormatter=${shortMoney}/>
            <${Tooltip} content=${tipOf(moneyFull)} cursor=${{fill:th.cursor}}/>
            ${COST_CATS.map((c,i)=>html`<${Bar} key=${c.k} dataKey=${c.k} name=${c.l} stackId="c" fill=${CC[i]} maxBarSize=${54} radius=${i===7?[6,6,0,0]:0}>${bySite.map(b=>html`<${Cell} key=${b.s} fill=${CC[i]} fillOpacity=${F.site!=='all'&&F.site!==b.s?.22:1}/>`)}<//>`)}<//><//>
        <//>
        <${Card} title="Monthly trend" sub="All months, by category">
          <${ResponsiveContainer} width="100%" height=${250}><${BarChart} data=${trend} margin=${{top:6,right:6,left:4,bottom:0}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)}/><${YAxis} ...${axis(th)} tickFormatter=${shortMoney}/>
            <${Tooltip} content=${tipOf(moneyFull)} cursor=${{fill:th.cursor}}/>
            ${COST_CATS.map((c,i)=>html`<${Bar} key=${c.k} dataKey=${c.k} name=${c.l} stackId="c" fill=${CC[i]} maxBarSize=${54} radius=${i===7?[6,6,0,0]:0}/>`)}<//><//>
        <//>
      </div>
      <${Legendish} items=${COST_CATS.map((c,i)=>({l:c.l,c:CC[i]}))}/></div>`}
  </div>`;
}
function CostCategory({cat}){
  const app=useApp(); const {data,settings,th,sn,setFilters,months,latestMonth}=app; const F=useF(); const C=CAT[cat];
  const [view,setView]=useState('a'); const [head,setHead]=useState(null);
  const all=data.cost.filter(x=>x.category===cat); const rows=all.filter(x=>F.m(x.date)&&F.s(x.site)&&(!head||x.head===head));
  const A=sum(rows,x=>x.amount), T=costTargetFor(settings,[cat],F,months);
  const isSal=cat==='salary', isRm=cat==='rm';
  const bySite=SITES.map(s=>{const r=all.filter(x=>F.m(x.date)&&x.site===s&&(!head||x.head===head)); return {s,name:sn(s),actual:sum(r,x=>x.amount),target:sum(F.month==='all'?months:[F.month],mm=>costTgt(settings,cat,mm,s))};});
  const byHead=Object.entries(groupBy(all.filter(x=>F.m(x.date)&&F.s(x.site)),x=>x.head)).map(([h,a])=>({h,amt:sum(a,x=>x.amount),qty:sum(a,x=>x.qty)})).sort((a,b)=>b.amt-a.amt);
  const m=F.month==='all'?latestMonth:F.month; const dm=daysInMonth(m); const mt=sum(SITES.filter(F.s),s=>costTgt(settings,cat,m,s)); const dt=mt/30;
  const mr=all.filter(x=>monthOf(x.date)===m&&F.s(x.site)); const lastDay=m===monthOf(DEMO_TODAY)?+DEMO_TODAY.slice(8,10):dm;
  const cum=[]; let run=0; for(let i=1;i<=lastDay;i++){const d=m+'-'+pad(i); run+=sum(mr.filter(x=>x.date===d),x=>x.amount); cum.push({l:fmtDay(d),actual:run,pace:Math.round(dt*Math.min(i,30))});}
  const paceP=dt?run/(dt*Math.min(lastDay,30))*100:0; const PS=paceP<=100?{l:'On track',c:th.good,t:'good'}:paceP<=110?{l:'Watch',c:th.warn,t:'warn'}:{l:'Over pace',c:th.bad,t:'bad'};
  const sitePace=SITES.filter(F.s).map(s=>{const a=sum(mr.filter(x=>x.site===s),x=>x.amount), t=costTgt(settings,cat,m,s), exp=t/30*Math.min(lastDay,30); return {id:s,s,name:sn(s),a,t,daily:t/30,exp,p:exp?a/exp*100:0};});
  const split=i=>Object.entries(groupBy(rows,x=>(x.head.split(' · ')[i]||'Other'))).map(([b,a])=>({l:b,amt:sum(a,x=>x.amount),qty:sum(a,x=>x.qty)})).sort((a,b)=>b.amt-a.amt);
  const overS=bySite.filter(x=>x.actual>x.target).sort((a,b)=>b.actual/b.target-a.actual/a.target);
  const wk=cumul(series(rows,'date',a=>sum(a,x=>x.amount)));
  const topVeh=isRm?Object.entries(groupBy(rows.filter(x=>x.vehicle),x=>x.vehicle)).map(([v,a])=>({v,amt:sum(a,x=>x.amount),n:a.length})).sort((a,b)=>b.amt-a.amt).slice(0,5):[];
  const tgtWord=isSal?'sanctioned salary':'target';
  return html`<div>
    <${ModHead} title=${C.l} icon=${C.i} desc=${isSal?'Sanctioned salary against actual payout, by centre.':isRm?'Repair spend tracked day by day against a monthly target, so overspending shows up early.':'Spend by centre and cost head, against a monthly target with a daily pace tracker.'} view=${view} setView=${setView}/>
    ${view==='e'?html`<${CostGrid} cat=${cat}/>`:html`<div>
      <${Summary} items=${[{t:A<=T?'good':'bad',s:`${money(A)} spent — ${pct(T?A/T*100:0,0)} of ${tgtWord}.`},{t:PS.t,s:`${monthLabel(m)} spend is at ${pct(paceP,0)} of the daily pace (${PS.l.toLowerCase()}).`},overS.length?{t:'warn',s:`${overS.map(x=>x.name).join(', ')} ${overS.length>1?'are':'is'} over ${tgtWord}.`}:{t:'good',s:`Every centre is within ${tgtWord}.`},topVeh[0]?{t:'info',s:`${topVeh[0].v} had the highest repair bill (${money(topVeh[0].amt)}).`}:null]}/>
      ${byHead.length>1?html`<div className="chips" style=${{marginBottom:14}}><button className=${'chip'+(!head?' on':'')} onClick=${()=>setHead(null)}>All heads</button>${byHead.map(h=>html`<button key=${h.h} className=${'chip'+(head===h.h?' on':'')} onClick=${()=>setHead(head===h.h?null:h.h)}>${h.h}</button>`)}</div>`:null}
      <div className="kpis">
        <${Kpi} label=${isSal?'Actual payout':'Spend'} icon=${C.i} value=${A} fmt=${money} sub=${rows.length+' entries'} spark=${wk}/>
        <${Kpi} label=${isSal?'Sanctioned':'Target'} icon="check" value=${T} fmt=${money}/>
        <${Kpi} label="Variance" icon=${A<=T?'down':'up'} value=${A-T} fmt=${money} tone=${A<=T?'good':'bad'} sub=${pct(T?A/T*100:0,0)+' of '+tgtWord}/>
        <${Kpi} label=${'Pace · '+monthShort(m)} icon="clock" value=${paceP} fmt=${v=>pct(v,0)} tone=${PS.t} sub=${PS.l}/>
      </div>
      <div className="grid g2">
        <${Card} title=${isSal?'Sanctioned vs actual by centre':'Actual vs target by centre'} sub="Click a centre to filter" insight=${[overS.length?`${overS[0].name} is ${money(overS[0].actual-overS[0].target)} over ${tgtWord}.`:`Every centre is within ${tgtWord}.`]}>
          <${ResponsiveContainer} width="100%" height=${240}><${BarChart} data=${bySite} margin=${{top:6,right:6,left:4,bottom:0}} barGap=${4} onClick=${e=>pickBar(e,p=>setFilters(f=>({...f,site:f.site===p.s?'all':p.s})))} style=${{cursor:'pointer'}}>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="name" ...${axis(th)} interval=${0} tick=${{fill:th.muted,fontSize:10}}/><${YAxis} ...${axis(th)} tickFormatter=${shortMoney}/>
            <${Tooltip} content=${tipOf(moneyFull)} cursor=${{fill:th.cursor}}/>
            <${Bar} dataKey="target" name=${isSal?'Sanctioned':'Target'} fill=${th.faint} radius=${[6,6,0,0]} maxBarSize=${32}/>
            <${Bar} dataKey="actual" name="Actual" radius=${[6,6,0,0]} maxBarSize=${32}>${bySite.map(b=>html`<${Cell} key=${b.s} fill=${b.actual>b.target?th.bad:th.accent} fillOpacity=${F.site!=='all'&&F.site!==b.s?.25:1}/>`)}<//><//><//>
          <${Legendish} items=${[{l:'Actual',c:th.accent},{l:'Over',c:th.bad},{l:isSal?'Sanctioned':'Target',c:th.faint}]}/>
        <//>
        <${Card} title=${'Target tracker · '+monthLabel(m)} sub=${'Daily target = monthly target ÷ 30 = '+money(dt)} insight=${[`Month-to-date spend is ${money(run)} against an expected ${money(dt*Math.min(lastDay,30))} — ${PS.l.toLowerCase()}.`]}>
          <${ResponsiveContainer} width="100%" height=${200}><${ComposedChart} data=${cum} margin=${{top:6,right:8,left:4,bottom:0}}>
            <defs><linearGradient id=${'gc'+cat} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor=${PS.c} stopOpacity=${.25}/><stop offset="100%" stopColor=${PS.c} stopOpacity=${0}/></linearGradient></defs>
            <${CartesianGrid} ...${grid(th)}/><${XAxis} dataKey="l" ...${axis(th)} minTickGap=${24}/><${YAxis} ...${axis(th)} tickFormatter=${shortMoney}/>
            <${Tooltip} content=${tipOf(moneyFull)}/>
            <${Area} type="stepAfter" dataKey="actual" name="Actual (cumulative)" stroke=${PS.c} fill=${'url(#gc'+cat+')'} strokeWidth=${2.2}/><${Line} dataKey="pace" name="Target pace" stroke=${th.muted} strokeDasharray="5 4" dot=${false}/><//><//>
          <div style=${{marginTop:10}}><${DataTable} search=${false} cols=${[{k:'name',l:'Centre'},{k:'daily',l:'Daily target',r:1,cls:'calc',rn:x=>money(x.daily)},{k:'a',l:'Month to date',r:1,rn:x=>money(x.a)},{k:'p',l:'Pace',cls:'calc',rn:x=>html`<div className="row"><span style=${{width:40}}>${pct(x.p,0)}</span><div style=${{width:70}}><${Prog} v=${x.p} c=${x.p<=100?th.good:x.p<=110?th.warn:th.bad}/></div></div>`}]} rows=${sitePace}/></div>
        <//>
      </div>
      ${cat==='tyre'?html`<div className="grid g2">${[['By brand',split(0)],['By type',split(1)]].map(([t,d])=>html`<${Card} key=${t} title=${t} sub="Spend and tyres bought">
          <${ResponsiveContainer} width="100%" height=${190}><${BarChart} data=${d} layout="vertical" margin=${{top:0,right:10,left:6,bottom:0}}><${CartesianGrid} stroke=${th.grid} strokeDasharray="3 4" horizontal=${false}/><${XAxis} type="number" ...${axis(th)} tickFormatter=${shortMoney}/><${YAxis} type="category" dataKey="l" ...${axis(th)} width=${70}/>
            <${Tooltip} content=${tipOf((v,k,p)=>moneyFull(v)+' · '+p.qty+' tyres')} cursor=${{fill:th.cursor}}/><${Bar} dataKey="amt" name="Spend" fill=${th.accent} radius=${[0,6,6,0]} maxBarSize=${26}/><//><//><//>`)}</div>`:null}
      ${isRm&&topVeh.length?html`<div><${Card} title="Highest repair bills" sub="Vehicles with the most repair spend in this period">
        <div className="alist">${topVeh.map(v=>html`<div key=${v.v} className="aitem" style=${{display:'grid',gridTemplateColumns:'30px 110px 1fr 90px',gap:12}}><span className="ai" style=${{background:'var(--soft)',color:'var(--accent)'}}><${Icon} n="truck" s=${15}/></span><${VLink} v=${v.v}/><${Prog} v=${v.amt} max=${topVeh[0].amt}/><span className="num" style=${{textAlign:'right'}}>${money(v.amt)}</span></div>`)}</div>
      <//><div style=${{height:16}}></div></div>`:null}
      <${Card} title="Entries" sub="Newest first">
        <${More} count=${rows.length}><${DataTable} pageSize=${10} initialSort=${{k:'date',dir:-1}} cols=${[{k:'date',l:'Date',rn:x=>fmtDay(x.date)},{k:'site',l:'Centre',rn:x=>sn(x.site)},{k:'head',l:'Cost head'},{k:'vehicle',l:'Vehicle',rn:x=>html`<${VLink} v=${x.vehicle}/>`},{k:'qty',l:'Qty',r:1},{k:'amount',l:'Amount',r:1,rn:x=>moneyFull(x.amount)},{k:'ref',l:'Reference'},{k:'status',l:'Status',rn:x=>html`<${Pill} t=${x.status} c=${x.status==='Pending'?th.warn:x.status==='Paid'?th.info:th.good}/>`}]} rows=${rows}/><//>
      <//></div>`}
  </div>`;
}
function CostEntry(){
  return html`<div><${ModHead} title="All Categories (Entry)" icon="table" desc="One sheet for every fleet cost head: category, centre, cost head, date, vehicle, amount, quantity, reference, remarks and status." noEntry=${true}/><${CostGrid}/></div>`;
}

/* ================= DATA ENTRY: Market, Financials, Fleet Cost ================= */
function MarketEntry(){
  const app=useApp(); const {data,settings,setSettings,role,toast,months,latestMonth}=app; const F=useF(); const saveAll=useSaver('Market Ops');
  const [tab,setTab]=useState('daily'); const [m,setM]=useState(F.month==='all'?latestMonth:F.month);
  const short={'West Bengal':'WB','Assam & NE':'Assam & NE','Odisha':'Odisha','Jharkhand':'Jharkhand','Chhattisgarh':'Chhattisgarh'};
  const recs=useMemo(()=>{const o={}; data.market.forEach(x=>{if(monthOf(x.date)===m) o[x.date+'|'+x.area]=x;}); return o;},[data.market,m]);
  const last=Math.max(...Object.keys(recs).map(k=>+k.slice(8,10)),0)||daysInMonth(m);
  const dayRows=useMemo(()=>{const r=[]; for(let i=1;i<=Math.max(last,1);i++){const d=m+'-'+pad(i); const o={_k:d,date:d}; AREAS.forEach(a=>{const x=recs[d+'|'+a]; o[a+'|b']=x?x.bookings:''; o[a+'|p']=x?x.placements:''; o[a+'|w']=x?x.detentionHrs:'';}); r.push(o);} return r;},[recs,m]);
  const dcols=[{k:'date',l:'Date',label:true,fmt:fmtDay},...AREAS.flatMap(a=>[{k:a+'|b',l:'Booked',g:a,t:'num'},{k:a+'|p',l:'Placed',g:a,t:'num'},{k:a+'|w',l:'Wait h',g:a,t:'num'}]),{k:'_f',l:'Fill %',g:'All states',calc:r=>{const b=sum(AREAS,a=>N(r[a+'|b'])); return b?sum(AREAS,a=>N(r[a+'|p']))/b*100:0;},fmt:v=>pct(v,0)}];
  const dfoot=rs=>{const o={}; AREAS.forEach(a=>{o[a+'|b']=sum(rs,r=>N(r[a+'|b'])); o[a+'|p']=sum(rs,r=>N(r[a+'|p']));}); const b=sum(AREAS,a=>o[a+'|b']); o._f=b?pct(sum(AREAS,a=>o[a+'|p'])/b*100,0):''; return o;};
  const dsave=({changes})=>{const out=[]; changes.forEach(({row,patch})=>{AREAS.forEach(a=>{const ks=['b','p','w'].filter(x=>(a+'|'+x) in patch); if(!ks.length) return; const x=recs[row.date+'|'+a]; const p={}; if(ks.includes('b')) p.bookings=patch[a+'|b']; if(ks.includes('p')) p.placements=patch[a+'|p']; if(ks.includes('w')) p.detentionHrs=patch[a+'|w'];
      out.push(x?{coll:'market',action:'edit',record:{...x,...p},before:x}:{coll:'market',action:'add',record:{id:uid(),date:row.date,area:a,bookings:0,placements:0,detentionHrs:0,...p}});});}); saveAll(out);};
  // monthly targets matrix (like a planning sheet)
  const allM=[...new Set([...months,...Object.keys(settings.marketTargets)])].sort();
  const tRows=allM.map(mm=>{const o={_k:mm,m:mm}; AREAS.forEach(a=>{o[a+'|t']=mktTgt(settings,mm,a); o[a+'|a']=sum(data.market.filter(x=>monthOf(x.date)===mm&&x.area===a),x=>x.placements);}); return o;});
  const tcols=[{k:'m',l:'Month',label:true,fmt:monthLabel},...AREAS.flatMap(a=>[{k:a+'|t',l:'Target',g:a,t:'num'},{k:a+'|a',l:'Actual',g:a,calc:r=>r[a+'|a'],fmt:(v,r)=>html`<span style=${{color:v>=N(r[a+'|t'])?'#10B981':v>=N(r[a+'|t'])*.95?'#B45309':'#DC2626',fontWeight:600}}>${num(v)}</span>`}])];
  const tsave=({changes})=>{setSettings(st=>{const mt=JSON.parse(JSON.stringify(st.marketTargets)); changes.forEach(({row,patch})=>{mt[row.m]=mt[row.m]||{...monthVal(st.marketTargets,row.m)}; AREAS.forEach(a=>{if((a+'|t') in patch) mt[row.m][a]=patch[a+'|t'];});}); return {...st,marketTargets:mt};}); toast('Targets saved — pace charts updated');};
  return html`<div>
    <${Tabs} tabs=${[['daily','Daily bookings'],['targets','Monthly targets']]} value=${tab} onChange=${setTab}/>
    ${tab==='daily'?html`<${Card} title=${'Daily bookings · '+monthLabel(m)} sub="One row per day. Each state has booked, placed and average waiting hours.">
      <${Grid} xname=${'Market daily bookings '+m} cols=${dcols} rows=${dayRows} rkey=${'d'+m} onSave=${dsave} foot=${dfoot} toolbar=${html`<${MonthPick} value=${m} onChange=${setM} months=${months}/>`}/>
    <//>`:html`<${Card} title="Monthly placement targets" sub="Set the target for each state and month. Actual placements fill in by themselves: green when on target.">
      <${Grid} xname="Market monthly targets" cols=${tcols} rows=${tRows} rkey=${'t'+allM.join()} onSave=${tsave} canEdit=${role!=='Guest'} note="Only the Owner or an Editor can change targets"/>
    <//>`}</div>`;
}
function TopClients({br}){
  const {derived,th,sn}=useApp(); const F=useF();
  const rows=CLIENTS.filter(c=>!br||c.seg===br).map(c=>{const t=derived.trips.filter(x=>x.client===c.n&&F.m(x.date)&&F.s(x.site)); const rev=sum(t,x=>x.revenue), net=sum(t,x=>x.net); return {id:c.n,n:c.n,ind:c.ind,site:c.site,trips:t.length,rev,net,mg:rev?net/rev*100:0};}).filter(x=>x.trips);
  const top=[...rows].sort((a,b)=>b.rev-a.rev); const share=top.length?sum(top.slice(0,5),x=>x.rev)/Math.max(1,sum(top,x=>x.rev))*100:0; const low=[...rows].sort((a,b)=>a.mg-b.mg)[0];
  return html`<div><${Card} title="Clients" sub=${rows.length+' active clients, highest revenue first'} insight=${[top.length?`The top 5 clients bring in ${pct(share,0)} of revenue.`:null,low?`${low.n} has the thinnest margin (${pct(low.mg)}) — review its rate card.`:null]}>
    <${DataTable} pageSize=${8} initialSort=${{k:'rev',dir:-1}} cols=${[{k:'n',l:'Client',rn:x=>html`<b>${x.n}</b>`},{k:'ind',l:'Industry'},{k:'site',l:'Centre',rn:x=>sn(x.site)},{k:'trips',l:'Trips',r:1},{k:'rev',l:'Revenue',r:1,rn:x=>money(x.rev)},{k:'net',l:'Net profit',r:1,rn:x=>money(x.net)},{k:'mg',l:'Margin',rn:x=>html`<div className="row"><span style=${{width:44}}>${pct(x.mg,0)}</span><div style=${{width:70}}><${Prog} v=${Math.max(0,x.mg)} max=${35} c=${x.mg>=18?th.good:x.mg>=10?th.warn:th.bad}/></div></div>`}]} rows=${rows}/>
  <//><div style=${{height:16}}></div></div>`;
}
function TripEntry(){
  const {data,sn,months,latestMonth}=useApp(); const F=useF(); const [m,setM]=useState(F.month==='all'?latestMonth:F.month);
  const vehs=data.vehicles.filter(v=>F.s(v.site)).map(v=>v.vehicle);
  const cols=[{k:'date',l:'Date',g:'Trip',t:'date'},{k:'vehicle',l:'Vehicle',g:'Trip',t:'select',o:vehs},{k:'client',l:'Client',g:'Trip',t:'select',o:r=>CLIENTS.filter(c=>c.site===String(r.vehicle).slice(0,3)).map(c=>c.n)},
    {k:'freight',l:'Freight',g:'Income',t:'num'},{k:'otherIncome',l:'Other',g:'Income',t:'num'},
    {k:'fuel',l:'Fuel',g:'Trip costs',t:'num'},{k:'allowance',l:'Allowance',g:'Trip costs',t:'num'},{k:'toll',l:'Toll',g:'Trip costs',t:'num'},{k:'routeExp',l:'Route exp.',g:'Trip costs',t:'num'},{k:'additive',l:'Additive',g:'Trip costs',t:'num'},{k:'tripDays',l:'Days',g:'Trip costs',t:'num'},
    {k:'_r',l:'Revenue',g:'Result',calc:tripRev,fmt:moneyFull},{k:'_c',l:'Cost',g:'Result',calc:tripCost,fmt:moneyFull},{k:'_p',l:'Profit',g:'Result',calc:r=>tripRev(r)-tripCost(r),fmt:v=>html`<span style=${{color:v<0?'#DC2626':'inherit',fontWeight:600}}>${moneyFull(v)}</span>`}];
  return html`<${Card} title=${'Trip sheet · '+monthLabel(m)} sub="One row per trip. Revenue, cost and profit work themselves out.">
    <${RecordGrid} xname=${'Trip sheet '+m} coll="trips" module="Financials" cols=${cols} rkey=${m+F.site} search=${true} filter=${x=>monthOf(x.date)===m&&F.s(x.site)} sort=${(a,b)=>a.date<b.date?1:a.date>b.date?-1:0} fix=${r=>({...r,site:String(r.vehicle).slice(0,3)})}
      onAdd=${()=>{const v=vehs[0]; const c=CLIENTS.find(x=>x.site===v.slice(0,3)); return {date:m===monthOf(DEMO_TODAY)?DEMO_TODAY:m+'-01',vehicle:v,client:c?c.n:'',freight:'',otherIncome:0,fuel:'',allowance:'',toll:'',routeExp:'',additive:'',tripDays:1};}} toolbar=${html`<${MonthPick} value=${m} onChange=${setM} months=${months}/>`}/>
  <//>`;
}
function CostGrid({cat}){
  const app=useApp(); const {data,settings,setSettings,sn,role,toast,months,latestMonth}=app; const F=useF();
  const [tab,setTab]=useState('entries'); const [m,setM]=useState(F.month==='all'?latestMonth:F.month);
  const C=cat?CAT[cat]:null;
  const cols=[...(cat?[]:[{k:'category',l:'Category',t:'select',o:COST_CATS.map(c=>c.k),ol:k=>CAT[k].l,fmt:k=>CAT[k]?CAT[k].l:k}]),
    {k:'date',l:'Date',t:'date'},{k:'site',l:'Centre',t:'select',o:SITES,ol:sn,fmt:sn},{k:'head',l:'Cost head',t:'select',o:r=>COST_HEADS[r.category]||[]},{k:'vehicle',l:'Vehicle',t:'select',o:r=>['',...data.vehicles.filter(v=>v.site===r.site).map(v=>v.vehicle)],ol:v=>v||'—'},
    {k:'amount',l:'Amount ₹',t:'num'},{k:'qty',l:'Qty',t:'num'},{k:'ref',l:'Reference',t:'text'},{k:'remarks',l:'Remarks',t:'text',w:180},{k:'status',l:'Status',t:'select',o:['Approved','Pending','Paid']},
    {k:'_u',l:'Per unit',calc:r=>N(r.qty)?N(r.amount)/N(r.qty):N(r.amount),fmt:moneyFull}];
  const entries=html`<${Card} title=${(C?C.l:'Fleet cost')+' entries · '+monthLabel(m)} sub="One row per bill or voucher. Change any blue cell, then save.">
    <${RecordGrid} xname=${(C?C.l:'Fleet cost')+' entries '+m} coll="cost" module=${C?C.l:'Fleet Cost'} cols=${cols} rkey=${m+F.site+cat} search=${true} filter=${x=>(!cat||x.category===cat)&&monthOf(x.date)===m&&F.s(x.site)} sort=${(a,b)=>a.date<b.date?1:a.date>b.date?-1:0}
      onAdd=${()=>{const c=cat||'rm'; const st=F.site!=='all'?F.site:'KOL'; return {category:c,date:m===monthOf(DEMO_TODAY)?DEMO_TODAY:m+'-01',site:st,head:COST_HEADS[c][0],vehicle:'',amount:'',qty:c==='salary'?CEN[st].v:1,ref:'',remarks:'',status:'Pending'};}} toolbar=${html`<${MonthPick} value=${m} onChange=${setM} months=${months}/>`}/>
  <//>`;
  if(!cat) return entries;
  const allM=[...new Set([...months,...Object.keys(settings.costTargets[cat])])].sort();
  const sites=SITES.filter(F.s);
  const tRows=allM.map(mm=>{const o={_k:mm,m:mm}; sites.forEach(s=>{o[s+'|t']=costTgt(settings,cat,mm,s); o[s+'|a']=sum(data.cost.filter(x=>x.category===cat&&x.site===s&&monthOf(x.date)===mm),x=>x.amount);}); return o;});
  const tw=cat==='salary'?'Sanctioned':'Target';
  const tcols=[{k:'m',l:'Month',label:true,fmt:monthLabel},...sites.flatMap(s=>[{k:s+'|t',l:tw,g:sn(s),t:'num'},{k:s+'|a',l:'Actual',g:sn(s),calc:r=>r[s+'|a'],fmt:(v,r)=>html`<span style=${{color:v<=N(r[s+'|t'])?'#10B981':v<=N(r[s+'|t'])*1.05?'#B45309':'#DC2626',fontWeight:600}}>${money(v)}</span>`}])];
  const tsave=({changes})=>{setSettings(st=>{const ct=JSON.parse(JSON.stringify(st.costTargets)); changes.forEach(({row,patch})=>{ct[cat][row.m]=ct[cat][row.m]||{...monthVal(st.costTargets[cat],row.m)}; sites.forEach(s=>{if((s+'|t') in patch) ct[cat][row.m][s]=patch[s+'|t'];});}); return {...st,costTargets:ct};}); toast(tw+'s saved — charts updated');};
  return html`<div><${Tabs} tabs=${[['entries','Entries'],['targets','Monthly '+tw.toLowerCase()+'s']]} value=${tab} onChange=${setTab}/>
    ${tab==='entries'?entries:html`<${Card} title=${'Monthly '+tw.toLowerCase()+'s · '+C.l} sub=${'Set the '+tw.toLowerCase()+' for each centre and month. Actual spend fills in by itself: green when within '+tw.toLowerCase()+'.'}>
      <${Grid} xname=${C.l+' monthly '+tw.toLowerCase()+'s'} cols=${tcols} rows=${tRows} rkey=${'t'+cat+F.site+allM.join()} onSave=${tsave} canEdit=${role!=='Guest'} note="Only the Owner or an Editor can change targets"/>
    <//>`}</div>`;
}
