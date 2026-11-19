/* FleetSight — fleet operations and cost intelligence. Built by Rishabh Agarwal. */
const {useState,useEffect,useMemo,useRef,useCallback,createContext,useContext} = React;
const html = htm.bind(React.createElement);
const {ResponsiveContainer,BarChart,Bar,LineChart,Line,ComposedChart,Area,AreaChart,XAxis,YAxis,CartesianGrid,Tooltip,Legend,Cell,ReferenceLine} = Recharts;

/* ---------- utilities ---------- */
const pad = n => String(n).padStart(2,'0');
const toISO = d => d.toISOString().slice(0,10);
const addDays = (iso,n) => { const d = new Date(iso+'T00:00:00Z'); d.setUTCDate(d.getUTCDate()+n); return toISO(d); };
const diffDays = (a,b) => Math.round((new Date(a+'T00:00:00Z') - new Date(b+'T00:00:00Z'))/864e5);
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const monthOf = d => (d||'').slice(0,7);
const monthLabel = k => MON[+k.slice(5,7)-1]+' '+k.slice(0,4);
const monthShort = k => MON[+k.slice(5,7)-1];
const daysInMonth = k => new Date(Date.UTC(+k.slice(0,4), +k.slice(5,7), 0)).getUTCDate();
const fmtDay = d => d ? (+d.slice(8,10))+' '+MON[+d.slice(5,7)-1] : '—';
const inr0 = n => Math.round(n||0).toLocaleString('en-IN');
const money = n => { n=+n||0; const a=Math.abs(n), s=n<0?'−':''; if(a>=1e7) return s+'₹'+(a/1e7).toFixed(2)+' Cr'; if(a>=1e5) return s+'₹'+(a/1e5).toFixed(2)+' L'; return s+'₹'+inr0(a); };
const moneyFull = n => (n<0?'−':'')+'₹'+inr0(Math.abs(n||0));
const num = n => inr0(n);
const num1 = n => (Math.round((+n||0)*10)/10).toLocaleString('en-IN');
const pct = (n,d=1) => (isFinite(n)&&!isNaN(n) ? (+n).toFixed(d) : '0')+'%';
const sum = (arr,f) => arr.reduce((a,x)=>a+(+(f?f(x):x)||0),0);
const groupBy = (arr,f) => arr.reduce((m,x)=>{const k=f(x);(m[k]=m[k]||[]).push(x);return m;},{});
const uid = () => Math.random().toString(36).slice(2,8)+Date.now().toString(36).slice(-5);
const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
const N = v => +v||0;

/* ---------- reference data: centres, lanes, clients ---------- */
const DEMO_TODAY = '2026-10-31';
const START = '2026-08-01';
const CENTRES = [
  {k:'KOL',n:'Kolkata',st:'West Bengal',ll:[88.36,22.57],v:50,focus:'FMCG, beverages and cement'},
  {k:'GHY',n:'Guwahati',st:'Assam',ll:[91.74,26.14],v:30,focus:'FMCG and cement for the North East'},
  {k:'JSG',n:'Jharsuguda',st:'Odisha',ll:[84.01,21.86],v:40,focus:'Aluminium, coal and power'},
  {k:'ANG',n:'Angul',st:'Odisha',ll:[85.10,20.84],v:30,focus:'Coal, mine to siding'},
  {k:'DHN',n:'Dhanbad',st:'Jharkhand',ll:[86.43,23.80],v:35,focus:'Coal and steel'},
  {k:'JSR',n:'Jamshedpur',st:'Jharkhand',ll:[86.20,22.80],v:25,focus:'Steel coils and iron ore'},
  {k:'KRB',n:'Korba',st:'Chhattisgarh',ll:[82.68,22.35],v:40,focus:'Coal, cement and iron ore'}];
const CEN = Object.fromEntries(CENTRES.map(c=>[c.k,c]));
const SITES = CENTRES.map(c=>c.k);
const VTYPES = [{k:'Tipper',iv:8000},{k:'Trailer',iv:15000},{k:'Bulker',iv:12000},{k:'Container',iv:12000},{k:'Open body',iv:10000}];
const MAKES = VTYPES.map(t=>t.k);
const TYPE_MIX = {KOL:{Container:.4,Bulker:.3,'Open body':.3},GHY:{Container:.5,Bulker:.3,'Open body':.2},JSG:{Trailer:.4,Tipper:.4,Bulker:.2},ANG:{Tipper:.8,'Open body':.2},DHN:{Tipper:.75,'Open body':.25},JSR:{Trailer:.7,'Open body':.3},KRB:{Tipper:.6,Bulker:.25,Trailer:.15}};
const LANES = [
  {k:'KOL-HAL',site:'KOL',l:'Kolkata → Haldia Port',to:[88.06,22.03],km:250,target:85,toll:900,days:[1,2],trips:[6,8]},
  {k:'GHY-SHL',site:'GHY',l:'Guwahati → Shillong',to:[91.89,25.58],km:200,target:78,toll:400,days:[1,2],trips:[6,8]},
  {k:'JSG-PDP',site:'JSG',l:'Jharsuguda → Paradip Port',to:[86.61,20.32],km:700,target:240,toll:2600,days:[3,4],trips:[4,6]},
  {k:'ANG-TAL',site:'ANG',l:'Angul → Talcher mines',to:[85.23,20.95],km:60,target:28,toll:0,days:[1,1],trips:[9,12]},
  {k:'DHN-BKR',site:'DHN',l:'Dhanbad → Bokaro',to:[86.15,23.67],km:100,target:38,toll:250,days:[1,1],trips:[9,12]},
  {k:'JSR-KOL',site:'JSR',l:'Jamshedpur → Kolkata',to:[88.36,22.57],km:560,target:190,toll:1900,days:[3,4],trips:[4,6]},
  {k:'KRB-RPR',site:'KRB',l:'Korba → Raipur',to:[81.63,21.25],km:400,target:135,toll:1200,days:[2,3],trips:[6,8]}];
const LANE = Object.fromEntries(LANES.map(l=>[l.k,l]));
const laneShort = k => (LANE[k]?LANE[k].l:k).replace(' Port','').replace(' mines','');
const FUEL_ROUTES = LANES;
const SEGMENTS = {'Heavy materials':['Cement','Steel','Coal','Aluminium','Iron ore','Power'],'FMCG & consumer':['FMCG','Beverages'],'Agri & chemicals':['Fertiliser']};
const segOf = ind => Object.keys(SEGMENTS).find(s=>SEGMENTS[s].includes(ind))||'Heavy materials';
const BRANCHES = Object.keys(SEGMENTS);
const CLIENTS = [
  ['Freshtide Consumer','FMCG','KOL'],['Nutrigo Foods','FMCG','KOL'],['Homeglow Care','FMCG','KOL'],['Brewlane Drinks','Beverages','KOL'],['Cementra Eastern','Cement','KOL'],['Agrovita Nutrients','Fertiliser','KOL'],
  ['Purebasket Foods','FMCG','GHY'],['Dailyneed Brands','FMCG','GHY'],['Teaspring Beverages','Beverages','GHY'],['Northline Cement','Cement','GHY'],['Hillcem Industries','Cement','GHY'],
  ['Aluvia Metals','Aluminium','JSG'],['Alumora Smelters','Aluminium','JSG'],['Silvane Aluminium','Aluminium','JSG'],['Coalvista Energy','Coal','JSG'],['Emberline Coal','Coal','JSG'],['Voltaris Power','Power','JSG'],
  ['Talcora Mining','Coal','ANG'],['Deepseam Coal','Coal','ANG'],['Minexa Resources','Coal','ANG'],['Ferrocore Steel','Steel','ANG'],['Gridwave Thermal','Power','ANG'],
  ['Seamstone Collieries','Coal','DHN'],['Darkvein Coal','Coal','DHN'],['Pitcraft Minerals','Coal','DHN'],['Ironvale Steel','Steel','DHN'],['Kisanmitra Agro','Fertiliser','DHN'],
  ['Coilmark Steel','Steel','JSR'],['Platewell Industries','Steel','JSR'],['Rollforge Metals','Steel','JSR'],['Tensora Steel','Steel','JSR'],['Hematix Ores','Iron ore','JSR'],
  ['Coalridge Energy','Coal','KRB'],['Seamfire Coal','Coal','KRB'],['Stonecrest Cement','Cement','KRB'],['Cemverra Cement','Cement','KRB'],['Calcora Cement','Cement','KRB'],['Oretrail Minerals','Iron ore','KRB'],['Ferrum Hills Mining','Iron ore','KRB'],['Spongeline Steel','Steel','KRB']
].map(([n,ind,site])=>({n,ind,site,seg:segOf(ind)}));
const CLIENT = Object.fromEntries(CLIENTS.map(c=>[c.n,c]));
const STATUS = [
  {k:'loadT',l:'Load transit',c:'#14B8A6'},{k:'unloadT',l:'Unload transit',c:'#0E7490'},
  {k:'noDriver',l:'Without driver',c:'#F59E0B'},{k:'repair',l:'Repairing',c:'#EF4444'},
  {k:'loadIssue',l:'Loading issue',c:'#A78BFA'},{k:'unloadIssue',l:'Unloading issue',c:'#F472B6'},
  {k:'accident',l:'Accident',c:'#991B1B'},{k:'others',l:'Others',c:'#94A3B8'}];
const AREAS = ['West Bengal','Assam & NE','Odisha','Jharkhand','Chhattisgarh'];
const COST_CATS = [
  {k:'rm',l:'Repair & Maintenance',page:'repair',i:'wrench',rate:4500},
  {k:'tyre',l:'Tyre Purchase',page:'cost-tyre',i:'disc',rate:3000},
  {k:'parking',l:'Parking',page:'cost-parking',i:'parking',rate:450},
  {k:'washing',l:'Washing',page:'cost-washing',i:'drop',rate:300},
  {k:'docs',l:'Documents Renewal',page:'cost-documents',i:'file',rate:700},
  {k:'accident',l:'Accidental',page:'cost-accidental',i:'alert',rate:900},
  {k:'fooding',l:'Fooding',page:'cost-fooding',i:'food',rate:500},
  {k:'salary',l:'Driver Salary',page:'cost-salary',i:'users',rate:22000}];
const CAT = Object.fromEntries(COST_CATS.map(c=>[c.k,c]));
const COST_HEADS = {
  rm:['Engine','Brakes','Electrical','Suspension','Body work','Clutch & gearbox'],
  tyre:['Radial · new','Nylon · new','Retread'],
  parking:['Yard parking','Highway parking','Port parking'],
  washing:['Full wash','Under-body wash'],
  docs:['Permit','Fitness','Insurance','PUC','Road tax'],
  accident:['Body repair','Third-party claim','Towing'],
  fooding:['Driver meals','Loading crew meals'],
  salary:['Driver salary']};
const WIDGETS = ['moving','fuel','profit','cost','market','pm'];
const DATA_MONTHS = ['2026-08','2026-09','2026-10'];

function defaultSettings(){
  const ct={}; COST_CATS.forEach(c=>{ct[c.k]={}; DATA_MONTHS.forEach(m=>{ct[c.k][m]={}; CENTRES.forEach(s=>ct[c.k][m][s.k]=Math.round(s.v*c.rate/1000)*1000);});});
  const base={'West Bengal':22,'Assam & NE':12,'Odisha':18,'Jharkhand':16,'Chhattisgarh':14};
  const mt={}; DATA_MONTHS.forEach(m=>{mt[m]={}; AREAS.forEach(a=>mt[m][a]=Math.round(base[a]*daysInMonth(m)*.93/10)*10);});
  return {
    siteNames:Object.fromEntries(CENTRES.map(c=>[c.k,c.n])),
    hidden:[], accent:'teal', dark:null,
    widgets:['moving','fuel','profit','cost','market','pm'], hiddenWidgets:['market','pm'],
    marketTargets:mt, costTargets:ct
  };
}
// a target for any month: falls back to the latest month that has one
function monthVal(obj,m){ if(!obj) return null; if(obj[m]) return obj[m]; const ks=Object.keys(obj).sort(); const prev=ks.filter(k=>k<=m).pop()||ks[0]; return obj[prev]; }
const costTgt=(settings,cat,m,site)=>N((monthVal(settings.costTargets[cat],m)||{})[site]);
const mktTgt=(settings,m,area)=>N((monthVal(settings.marketTargets,m)||{})[area]);

/* ---------- seeded data generator (same numbers on every load) ---------- */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function generateData(){
  const r = mulberry32(20261031);
  const rnd=(a,b)=>a+r()*(b-a), ri=(a,b)=>Math.floor(rnd(a,b+1)), pick=a=>a[Math.floor(r()*a.length)];
  const g=()=>{let u=0;for(let i=0;i<6;i++)u+=r();return (u/6-0.5)*3.4;};
  const binom=(n,p)=>{let c=0;for(let i=0;i<n;i++) if(r()<p) c++; return c;};
  const DATES=[]; for(let d=START; d<=DEMO_TODAY; d=addDays(d,1)) DATES.push(d);
  const settings=defaultSettings();

  // 250 vehicles across 7 centres
  const vehicles=[];
  CENTRES.forEach(c=>{const mix=Object.entries(TYPE_MIX[c.k]); let i=0;
    mix.forEach(([t,share],mi)=>{const n=mi===mix.length-1?c.v-i:Math.round(c.v*share); for(let j=0;j<n;j++,i++) vehicles.push({id:'v'+vehicles.length,vehicle:c.k+'-'+(101+i),make:t,site:c.k});});});
  const vOf=s=>vehicles.filter(v=>v.site===s);

  // daily truck running
  const daily=[]; let lastG=null;
  DATES.forEach(d=>CENTRES.forEach(c=>{
    const dep=Math.round(c.v*.9)+ri(-1,1);
    const st={noDriver:binom(dep,c.k==='KRB'?.07:.045),repair:binom(dep,c.k==='GHY'&&d>='2026-10-01'?.11:.06),loadIssue:binom(dep,.03),unloadIssue:binom(dep,.025),accident:r()<.02?1:0,others:binom(dep,.02)};
    const rest=dep-sum(Object.values(st)); const lt=Math.round(rest*rnd(.47,.58));
    let row={id:'d'+daily.length,date:d,site:c.k,deployed:dep,...st,loadT:lt,unloadT:rest-lt};
    if(c.k==='GHY'&&d>='2026-10-26'&&lastG) row={...lastG,id:row.id,date:d};
    if(c.k==='GHY') lastG=row;
    daily.push(row);
  }));
  [['2026-10-12','DHN'],['2026-09-18','KOL'],['2026-10-30','JSG']].forEach(([d,s])=>{const x=daily.find(y=>y.date===d&&y.site===s); if(x) x.others+=1;});

  // diesel fills: 4 per lane per day
  const fuel=[];
  DATES.forEach((d,di)=>LANES.forEach((ln,li)=>{const vs=vOf(ln.site); for(let j=0;j<4;j++){const v=vs[(di*4+j+li*3)%vs.length]; let f=.975+g()*.042; if(v.vehicle==='KRB-118') f+=.13; if(ln.k==='GHY-SHL'&&d>='2026-10-01') f+=.02; fuel.push({id:'f'+fuel.length,date:d,route:ln.k,vehicle:v.vehicle,litres:Math.round(ln.target*f)});}}));

  // preventive maintenance
  const pm=vehicles.map((v,i)=>{const it=VTYPES.find(t=>t.k===v.make).iv, odo=ri(38000,245000), since=Math.round(it*rnd(.04,1.08)); return {id:'pm'+i,vehicle:v.vehicle,make:v.make,site:v.site,odometer:odo,lastServiceKm:odo-since,lastServiceDate:addDays(DEMO_TODAY,-Math.round(since/160)),intervalKm:it};});

  // market ops (hired-market loads by state)
  const mbase={'West Bengal':22,'Assam & NE':12,'Odisha':18,'Jharkhand':16,'Chhattisgarh':14};
  const market=[];
  DATES.forEach(d=>AREAS.forEach(a=>{const b=Math.max(4,Math.round(mbase[a]+g()*2.4)); const p=Math.max(0,b-(a==='Assam & NE'?ri(1,4):ri(0,2))); market.push({id:'m'+market.length,date:d,area:a,bookings:b,placements:p,detentionHrs:+(rnd(2.5,6.5)+(a==='Chhattisgarh'?4:0)).toFixed(1)});}));

  // trips (financials)
  const trips=[];
  vehicles.forEach(v=>{const ln=LANES.find(l=>l.site===v.site); const cl=CLIENTS.filter(c=>c.site===v.site);
    DATA_MONTHS.forEach(m=>{const n=ri(ln.trips[0],ln.trips[1]);
      for(let t=0;t<n;t++){
        const date=m+'-'+pad(ri(1,daysInMonth(m))); const c=pick(cl);
        const fuelCost=Math.round(ln.target*rnd(.95,1.08)*92/10)*10;
        const rate=c.seg==='FMCG & consumer'?1.1:c.seg==='Agri & chemicals'?.94:1;
        const freight=Math.round((fuelCost*rnd(1.36,1.52)*rate+ln.toll+1500)/100)*100;
        const td=ri(ln.days[0],ln.days[1]);
        trips.push({id:'t'+trips.length,date,vehicle:v.vehicle,site:v.site,client:c.n,freight,otherIncome:r()<.25?ri(3,15)*100:0,allowance:td*ri(450,650),additive:Math.round(ln.km*rnd(.5,.9)/10)*10,fuel:fuelCost,routeExp:ri(4,18)*100,toll:ln.toll,tripDays:td});
      }});});

  // fleet cost
  const cost=[]; const add=o=>cost.push({id:'c'+cost.length,ref:'REF-'+(5000+cost.length),remarks:'',qty:1,status:r()<.9?'Approved':'Pending',vehicle:'',...o});
  const split=(total,n)=>{const w=Array.from({length:n},()=>rnd(.4,1.6)); const s=w.reduce((a,b)=>a+b,0); return w.map(x=>Math.max(100,Math.round(total*x/s/10)*10));};
  DATA_MONTHS.forEach(m=>{const dm=daysInMonth(m); const d=()=>m+'-'+pad(ri(1,dm));
    CENTRES.forEach(c=>{const vs=vOf(c.k); const T=k=>settings.costTargets[k][m][c.k];
      split(T('rm')*rnd(.86,1)*((c.k==='GHY'&&m==='2026-10')?1.28:1),Math.round(c.v/3)).forEach(a=>add({category:'rm',site:c.k,head:pick(COST_HEADS.rm),date:d(),vehicle:pick(vs).vehicle,amount:a}));
      let tb=T('tyre')*rnd(.8,1.02); while(tb>8000){const h=pick(COST_HEADS.tyre),u=h==='Retread'?ri(80,100)*100:h.startsWith('Nylon')?ri(150,170)*100:ri(220,260)*100,q=Math.max(1,Math.min(6,Math.floor(tb/u))); add({category:'tyre',site:c.k,head:h,date:d(),vehicle:pick(vs).vehicle,qty:q,amount:q*u}); tb-=q*u;}
      split(T('parking')*rnd(.85,1.03)*((c.k==='JSG'&&m==='2026-10')?1.2:1),6).forEach(a=>add({category:'parking',site:c.k,head:pick(COST_HEADS.parking),date:d(),vehicle:pick(vs).vehicle,amount:a}));
      split(T('washing')*rnd(.85,1),4).forEach(a=>add({category:'washing',site:c.k,head:pick(COST_HEADS.washing),date:d(),vehicle:pick(vs).vehicle,amount:a}));
      split(T('docs')*rnd(.7,1),Math.max(1,Math.round(c.v/15))).forEach(a=>add({category:'docs',site:c.k,head:pick(COST_HEADS.docs),date:d(),vehicle:pick(vs).vehicle,amount:a}));
      if(r()<.55) add({category:'accident',site:c.k,head:pick(COST_HEADS.accident),date:d(),vehicle:pick(vs).vehicle,amount:Math.round(T('accident')*rnd(.5,1.1)/100)*100});
      split(T('fooding')*rnd(.85,1.02),5).forEach(a=>add({category:'fooding',site:c.k,head:pick(COST_HEADS.fooding),date:d(),amount:a}));
      add({category:'salary',site:c.k,head:'Driver salary',date:m+'-'+pad(dm),qty:c.v,amount:Math.round(T('salary')*((c.k==='ANG'&&m==='2026-10')?1.08:rnd(.96,1.01))/100)*100,status:'Approved'});
    });});
  add({category:'accident',site:'JSR',head:'Third-party claim',date:'2026-10-21',vehicle:'JSR-112',amount:82000,remarks:'NH-49 incident, claim filed',status:'Pending'});

  const pending=[
    {id:'p1',coll:'cost',action:'add',module:'Parking',by:'Guest',at:'2026-10-31T09:12:00.000Z',status:'pending',record:{id:'cx1',category:'parking',site:'GHY',head:'Highway parking',date:'2026-10-31',vehicle:'GHY-114',amount:1800,qty:1,ref:'REF-9001',remarks:'Night halt, Jorabat',status:'Pending'}},
    {id:'p2',coll:'fuel',action:'edit',module:'Diesel / Fuel',by:'Guest',at:'2026-10-31T10:40:00.000Z',status:'pending',before:fuel[fuel.length-3],record:{...fuel[fuel.length-3],litres:fuel[fuel.length-3].litres-6}}
  ];
  return {vehicles,daily,fuel,pm,market,trips,cost,pending};
}

/* ---------- derived values (grey "calculated" cells) ---------- */
const dailyTotal = x => STATUS.reduce((a,s)=>a+N(x[s.k]),0);
const fuelRoute = k => LANE[k]||{k,site:'KOL',target:80,l:k};
const fuelStatus = (litres,target) => { const q=N(litres)/target; return q<=1?'within':q<=1.08?'near':'above'; };
const FUEL_ST = {within:{l:'Within target',c:'#10B981'},near:{l:'Near threshold',c:'#F59E0B'},above:{l:'Above range',c:'#EF4444'}};
const ivOf = t => (VTYPES.find(x=>x.k===t)||{iv:10000}).iv;
function pmCalc(x){
  const dueKm=N(x.lastServiceKm)+N(x.intervalKm), left=dueKm-N(x.odometer);
  return {...x,dueKm,left,status:left<0?'overdue':left<=1500?'soon':'ok',dueDate:addDays(DEMO_TODAY,Math.max(0,Math.round(left/160))),used:N(x.intervalKm)?(N(x.odometer)-N(x.lastServiceKm))/N(x.intervalKm)*100:0};
}
const tripRev = t => N(t.freight)+N(t.otherIncome);
const tripCost = t => N(t.allowance)+N(t.additive)+N(t.fuel)+N(t.routeExp)+N(t.toll);
function derive(data){
  const daily=data.daily.map(x=>{const o={...x}; ['deployed',...STATUS.map(s=>s.k)].forEach(k=>o[k]=N(x[k])); o.total=dailyTotal(o); o.transit=o.loadT+o.unloadT; o.ok=o.total===o.deployed; o.moving=o.deployed?o.transit/o.deployed*100:0; return o;});
  const fuel=data.fuel.map(x=>{const rt=fuelRoute(x.route); return {...x,litres:N(x.litres),site:rt.site,target:rt.target,status:fuelStatus(x.litres,rt.target)};});
  const rm={}; data.cost.forEach(c=>{if(c.category==='rm'&&c.vehicle){const k=c.vehicle+'|'+monthOf(c.date); rm[k]=(rm[k]||0)+N(c.amount);}});
  const td={}; data.trips.forEach(t=>{const k=t.vehicle+'|'+monthOf(t.date); td[k]=(td[k]||0)+N(t.tripDays);});
  const trips=data.trips.map(t=>{const revenue=tripRev(t), cost=tripCost(t); const k=t.vehicle+'|'+monthOf(t.date); const repair=td[k]?(rm[k]||0)*N(t.tripDays)/td[k]:0; const cl=CLIENT[t.client]||{ind:'Other',seg:'Heavy materials'}; return {...t,revenue,cost,profit:revenue-cost,repair,net:revenue-cost-repair,ind:cl.ind,branch:cl.seg};});
  return {daily,fuel,trips,pm:data.pm.map(pmCalc)};
}
function findRepeats(rows){
  const out=[]; const sig=x=>[x.deployed,...STATUS.map(t=>x[t.k])].join('|');
  Object.entries(groupBy(rows,x=>x.site)).forEach(([s,arr])=>{
    arr=[...arr].sort((a,b)=>a.date<b.date?-1:1); let start=0;
    for(let i=1;i<=arr.length;i++){
      if(i<arr.length&&sig(arr[i])===sig(arr[i-1])&&diffDays(arr[i].date,arr[i-1].date)===1) continue;
      if(i-start>=3) out.push({site:s,from:arr[start].date,to:arr[i-1].date,days:i-start,transit:arr[start].transit});
      start=i;
    }});
  return out;
}

/* ---------- storage (localStorage, falls back to memory) ---------- */
const LS_KEY='fleetsight-v2';
function loadStore(){try{const s=localStorage.getItem(LS_KEY); if(s){const o=JSON.parse(s); if(o&&o.data&&o.settings&&o.data.daily) return o;}}catch(e){} return null;}
function saveStore(o){try{localStorage.setItem(LS_KEY,JSON.stringify(o)); return true;}catch(e){return false;}}
function clearStore(){try{localStorage.removeItem(LS_KEY);}catch(e){}}
async function saveFile(filename,data){
  const blob=data instanceof Blob?data:new Blob([data],{type:'application/json'});
  try{ if(window.claude&&window.claude.use){const dl=await window.claude.use('downloads'); if(dl){await dl.save({filename,data:blob}); return 'saved';}} }
  catch(e){ const c=e&&e.code; if(c==='declined') return 'declined'; if(c&&!['unavailable','not_granted','capability_disabled','capability_removed'].includes(c)) return 'failed'; }
  try{const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800); return 'saved';}catch(e){return 'failed';}
}

const COLL_LABELS={daily:'Daily truck running',fuel:'Diesel fills',pm:'Vehicles (maintenance)',market:'Market bookings',trips:'Trips',cost:'Fleet cost entries',pending:'Pending changes'};
