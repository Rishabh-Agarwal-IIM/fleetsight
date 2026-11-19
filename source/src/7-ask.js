/* ================= ASK FLEETSIGHT — knowledge base ================= */
const KB=[
 {id:'FP',t:'Fuel Policy',type:'Policy',up:'Apr 2026',sec:[
  {n:'1',h:'Purpose',x:'This policy sets diesel targets for every lane and explains what happens when a fill goes over target. It applies to all seven centres and every vehicle type.'},
  {n:'2',h:'Lane targets',x:'Each lane has a target in litres per round trip, based on distance, load and terrain: Kolkata → Haldia 85 L, Guwahati → Shillong 78 L, Jharsuguda → Paradip 240 L, Angul → Talcher 28 L, Dhanbad → Bokaro 38 L, Jamshedpur → Kolkata 190 L and Korba → Raipur 135 L. The fleet manager reviews targets every quarter.'},
  {n:'3',h:'Fuel thresholds',x:'A fill at or below target is within target. A fill up to 8% above target is near threshold and needs no action on its own. A fill more than 8% above target is above range and is counted against the vehicle.'},
  {n:'4',h:'Action on above-range fuel fills',x:'When a vehicle has 3 above-range fills in a calendar month, the centre must book an injector and tyre-pressure check within 72 hours and brief the driver on idling and speed. At 5 or more above-range fills, the centre head starts a fuel audit that compares the GPS route with the trip sheet. The outcome is recorded in Repair & Maintenance with the reference FUEL-AUDIT.'},
  {n:'5',h:'Hilly lanes',x:'The Guwahati → Shillong lane may run up to 5% above its fuel target from June to September because of monsoon gradients and slow traffic. Outside these months the normal thresholds apply, and repeated near-threshold fills on a hill lane should trigger a brake and clutch inspection.'},
  {n:'6',h:'Fuel cards and receipts',x:'All diesel is bought on company fuel cards at approved pumps. The driver uploads the receipt the same day. A fill without a receipt is treated as above range until it is verified.'}]},
 {id:'BD',t:'Breakdown SOP',type:'SOP',up:'Jan 2026',sec:[
  {n:'1',h:'First 15 minutes',x:'When a truck breaks down, the driver switches on hazard lights, places warning triangles 50 metres behind the truck and calls centre control within 15 minutes with the location and the problem.'},
  {n:'2',h:'Getting a mechanic',x:'Centre control arranges a mechanic within 2 hours inside city limits and within 4 hours on highways. If the breakdown repair will take longer than 8 hours, the load is shifted to a standby vehicle and the client is informed.'},
  {n:'3',h:'Breakdown approvals and records',x:'Breakdown repairs up to ₹25,000 can be approved by the centre supervisor on the spot; larger repairs follow the Approval Matrix. Every breakdown is logged in Repair & Maintenance within 24 hours with a photo of the bill.'}]},
 {id:'AC',t:'Accident SOP',type:'SOP',up:'Jan 2026',sec:[
  {n:'1',h:'Safety first',x:'After an accident, make the area safe, help anyone injured and call 112 for police or ambulance. Do not move the vehicle unless it blocks emergency access.'},
  {n:'2',h:'Reporting an accident',x:'Inform the centre head and the insurer within 2 hours. Take photos of all vehicles, the road and the documents. If a third party is involved, a police report (FIR) must be filed.'},
  {n:'3',h:'Accident claims',x:'All accident costs are booked under Accidental with the incident reference. Claims above ₹50,000 are escalated to the Head of Operations and reviewed in the monthly management meeting.'}]},
 {id:'PM',t:'Preventive Maintenance Schedule',type:'Policy',up:'Mar 2026',sec:[
  {n:'1',h:'Service intervals',x:'Tippers are serviced every 8,000 km, open-body trucks every 10,000 km, bulkers and containers every 12,000 km, and trailers every 15,000 km. Short-haul mining work is harder on engines and brakes, which is why tippers have the shortest service interval.'},
  {n:'2',h:'Service due soon',x:'A vehicle within 1,500 km of its next service is due soon. The centre books the service slot within the week and plans the vehicle’s trips around it.'},
  {n:'3',h:'Overdue service and dispatch',x:'A vehicle that is overdue for service must not be dispatched on long-haul lanes (Jharsuguda → Paradip, Jamshedpur → Kolkata, Korba → Raipur) until it is serviced. Short local trips are allowed for up to 500 km past the due point.'},
  {n:'4',h:'What a service covers',x:'Engine oil and filters, brake inspection, greasing, battery and lights. Tyres are rotated at every second service.'}]},
 {id:'TY',t:'Tyre Policy',type:'Policy',up:'Feb 2026',sec:[
  {n:'1',h:'Tyre types',x:'Radial tyres are fitted on all long-haul vehicles. Nylon tyres are allowed on short-haul tippers. Retreaded tyres may be used only on the rear axles of tippers at Angul and Dhanbad.'},
  {n:'2',h:'Tyre replacement',x:'A tyre is replaced when tread depth falls to 3 mm or there is a sidewall cut. The old tyre is returned to the centre store before a new tyre is issued.'},
  {n:'3',h:'Tyre budget and buying',x:'The monthly tyre budget is ₹3,000 per vehicle. Any single tyre purchase above ₹1,00,000 needs two written quotes.'}]},
 {id:'AP',t:'Approval Matrix',type:'Policy',up:'Apr 2026',sec:[
  {n:'1',h:'Spending approval limits',x:'Spending up to ₹10,000 is approved by the centre supervisor. From ₹10,001 to ₹50,000 the centre head approves. From ₹50,001 to ₹2,00,000 the Head of Operations approves. Anything above ₹2,00,000 needs the CFO.'},
  {n:'2',h:'Approving data changes',x:'Changes to FleetSight data made by guest users wait in Pending Changes until the owner approves them. Targets can be changed only by the owner or an editor.'},
  {n:'3',h:'Emergency approvals',x:'In a breakdown or accident, the centre head may approve up to ₹1,00,000 immediately and record the approval within 24 hours.'}]},
 {id:'DR',t:'Driver Handbook',type:'Handbook',up:'Jan 2026',sec:[
  {n:'1',h:'Driving hours',x:'Drivers drive no more than 10 hours a day, with a 30-minute rest every 4 hours. Night driving on the Guwahati → Shillong lane is not allowed after 10 pm.'},
  {n:'2',h:'Driver allowance',x:'Drivers get a trip allowance of ₹450 to ₹650 per trip day depending on the lane, paid with the monthly salary. Meals for loading crews at mines are booked under Fooding.'},
  {n:'3',h:'Driver salary and overtime',x:'Driver salaries are paid by the 7th of each month. Overtime during client rush periods is approved by the centre head in advance.'},
  {n:'4',h:'Driver conduct',x:'Zero tolerance for alcohol. Seat belts at all times. Mobile phones only on hands-free.'}]},
 {id:'MK',t:'Market Placement & Detention Terms',type:'Terms',up:'Apr 2026',sec:[
  {n:'1',h:'Placement and fill rate',x:'Market bookings must be placed within 24 hours. The fill-rate target is 92% of bookings. Unplaced bookings are reported to the client by 6 pm with a revised placement time.'},
  {n:'2',h:'Detention charges',x:'Free time at loading or unloading is 6 hours. After that, detention is charged to the client at ₹150 per hour of waiting, counted from the gate-in time on the receipt.'},
  {n:'3',h:'Assam and North-East bookings',x:'Assam and North-East bookings get 8 hours of free time because of road conditions, and placement may take up to 36 hours.'}]},
 {id:'RP',t:'Daily Reporting SOP',type:'SOP',up:'Feb 2026',sec:[
  {n:'1',h:'Daily running sheet',x:'Each centre submits its daily truck running sheet by 10 am. Every status must add up to the trucks deployed; rows that do not add up are returned to the centre.'},
  {n:'2',h:'Repeated or identical figures',x:'If a centre reports identical figures for 3 days in a row, centre control calls the centre to confirm the actual count. Repeated figures usually mean the sheet was copied forward instead of updated.'},
  {n:'3',h:'Month-end close',x:'All bills and costs for a month are entered by the 3rd of the next month, and the monthly management report is shared by the 5th.'}]},
 {id:'CC',t:'Cost Control Guidelines',type:'Policy',up:'Apr 2026',sec:[
  {n:'1',h:'Monthly cost targets per vehicle',x:'Monthly targets per vehicle: Repair & Maintenance ₹4,500, Tyres ₹3,000, Parking ₹450, Washing ₹300, Documents ₹700, Accidental ₹900 and Fooding ₹500. Driver salary is budgeted at ₹22,000 per driver.'},
  {n:'2',h:'Daily pace tracking',x:'Each cost target is split into a daily pace: monthly target ÷ 30. Spend up to 100% of pace is on track, 100% to 110% is watch, and above 110% is over pace.'},
  {n:'3',h:'Weekly cost review',x:'Any centre above 110% of pace on a cost head explains the reason in the weekly review. Two months in a row over target means the target or the process is revised.'}]},
 {id:'DC',t:'Document Renewal SOP',type:'SOP',up:'Jan 2026',sec:[
  {n:'1',h:'Documents we track',x:'Permit, fitness certificate, insurance, PUC and road tax are tracked for every vehicle.'},
  {n:'2',h:'When to renew documents',x:'Start renewal 30 days before expiry. A vehicle with any expired document must not leave the yard.'}]},
 {id:'RCF',t:'Rate Card — FMCG & Consumer',type:'Client terms',up:'Apr 2026',sec:[
  {n:'1',h:'FMCG rates',x:'FMCG and beverage loads are billed per trip, about 10% above heavy-material rates for the same distance, because of careful handling and tighter delivery windows.'},
  {n:'2',h:'FMCG service terms',x:'Unloading free time for FMCG clients is 4 hours. Damages above 0.5% of load value are recovered after a joint survey.'}]},
 {id:'RCH',t:'Rate Card — Heavy materials',type:'Client terms',up:'Apr 2026',sec:[
  {n:'1',h:'Heavy material rates',x:'Cement, steel, coal, aluminium and iron ore loads are billed per trip by lane and tonnage. Coal from mine to siding at Angul and Dhanbad is a short, high-frequency trip with a lower rate per trip.'},
  {n:'2',h:'Weight shortage',x:'A weight shortage of up to 0.2% is accepted. Beyond that, the shortage is deducted from the freight bill.'}]},
 {id:'IR1',t:'Incident report — Guwahati brake overheating',type:'Incident',up:'8 Oct 2026',sec:[
  {n:'1',h:'What happened',x:'On 8 Oct 2026, two Guwahati trucks reported brake overheating on the descent from Shillong. Both were stopped safely and towed to the centre.'},
  {n:'2',h:'Findings',x:'Worn brake linings on older containers combined with long descents at full load. A fleet-wide check at Guwahati found 6 more vehicles needing brake work.'},
  {n:'3',h:'Actions and cost impact',x:'Brakes were overhauled on 8 Guwahati vehicles in October, which is why Guwahati’s repair and maintenance spend and its repairing count rose sharply that month. Drivers were retrained on engine braking, and a brake check is now part of every Shillong trip.'}]},
 {id:'IR2',t:'Incident report — Jamshedpur NH-49 claim',type:'Incident',up:'21 Oct 2026',sec:[
  {n:'1',h:'What happened',x:'On 21 Oct 2026, JSR-112 was in a low-speed collision with a car on NH-49 near Jamshedpur. Nobody was injured.'},
  {n:'2',h:'Claim and cost',x:'A third-party claim of ₹82,000 was booked under Accidental for Jamshedpur, pending insurer settlement. Because it is above ₹50,000, it was escalated to the Head of Operations.'}]},
 {id:'MR',t:'Monthly review notes — October 2026',type:'Review',up:'Nov 2026',sec:[
  {n:'1',h:'Angul driver salary',x:'Angul driver salary was about 8% above sanctioned in October because of approved overtime during the rail-siding rush for a coal client.'},
  {n:'2',h:'Guwahati repairs',x:'Guwahati repair spend was over target because of the brake overhaul programme (see the incident report of 8 Oct). It is expected to return to normal from December.'},
  {n:'3',h:'Korba fuel',x:'Korba vehicle KRB-118 was flagged for repeated above-range diesel fills, and an injector check was booked as per Fuel Policy section 4.'}]},
 {id:'CP',t:'Centre profiles',type:'Reference',up:'Apr 2026',sec:CENTRES.map((c,i)=>({n:String(i+1),h:c.n+' centre',x:`${c.n} (${c.st}) runs ${c.v} vehicles focused on ${c.focus.toLowerCase()}. Its main lane is ${LANES.find(l=>l.site===c.k).l}, about ${LANES.find(l=>l.site===c.k).km} km per round trip.`}))}];

/* ================= retrieval engine (BM25, the classic search-engine formula) ================= */
const STOP=new Set('a an the of to in on for and or is are was were be been by with at as it its this that these from what which who whom how why when where do does did should can could would will i we our us you your me my there their about into than then any all per has have had if not no so up out more most much very just also only off over vs'.split(' '));
const SYN={diesel:'fuel',litre:'fuel',litres:'fuel',mileage:'fuel',consumption:'fuel',consuming:'fuel',fill:'fuel',fills:'fuel',breakdowns:'breakdown',broke:'breakdown',broken:'breakdown',repairs:'repair',repaired:'repair',maintenance:'repair',servicing:'service',serviced:'service',trucks:'vehicle',truck:'vehicle',lorry:'vehicle',vehicles:'vehicle',tyres:'tyre',tire:'tyre',tires:'tyre',approve:'approval',approves:'approval',approved:'approval',approver:'approval',sanction:'approval',authorise:'approval',authorize:'approval',crash:'accident',collision:'accident',accidents:'accident',wage:'salary',wages:'salary',pay:'salary',waiting:'detention',wait:'detention',budget:'target',targets:'target',spend:'cost',spending:'cost',expense:'cost',expenses:'cost',costs:'cost',permit:'document',insurance:'document',fitness:'document',puc:'document',documents:'document',drivers:'driver',hours:'hour',overheating:'brake',brakes:'brake',customer:'client',customers:'client',clients:'client'};
function stem(w){if(SYN[w]) return SYN[w]; let s=w; if(s.length>4&&s.endsWith('ies')) s=s.slice(0,-3)+'y'; else if(s.length>3&&s.endsWith('s')&&!s.endsWith('ss')) s=s.slice(0,-1); return SYN[s]||s;}
function toks(t){return String(t).toLowerCase().replace(/₹/g,' ').replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(w=>w&&!STOP.has(w)).map(stem).filter(w=>w.length>1);}
const KBX=(()=>{const chunks=KB.flatMap(d=>d.sec.map(s=>({id:d.id+'-'+s.n,doc:d,sec:s,tk:toks(d.t+' '+s.h+' '+s.h+' '+s.x)})));
  const df={}; chunks.forEach(c=>new Set(c.tk).forEach(w=>df[w]=(df[w]||0)+1)); const avg=sum(chunks,c=>c.tk.length)/chunks.length; return {chunks,df,avg,N:chunks.length};})();
function kbSearch(q,k=3){
  const qt=[...new Set(toks(q))]; const {chunks,df,avg,N}=KBX; const k1=1.4,b=.75;
  const res=chunks.map(c=>{let s=0; const tf={}; c.tk.forEach(w=>tf[w]=(tf[w]||0)+1); const hit=[];
    qt.forEach(w=>{if(!tf[w]) return; hit.push(w); const idf=Math.log(1+(N-df[w]+.5)/(df[w]+.5)); s+=idf*tf[w]*(k1+1)/(tf[w]+k1*(1-b+b*c.tk.length/avg));}); return {...c,score:s,hit};})
    .filter(r=>r.score>0).sort((a,b)=>b.score-a.score).slice(0,k);
  return {terms:qt,res};
}
function bestSentence(text,terms,must){const ss=text.split(/(?<=[.!?])\s+(?=[A-Z₹(])/); if(must){const f=ss.find(x=>x.includes(must)); if(f) return f.trim();} let bi=0,bv=-1; ss.forEach((x,i)=>{const t=new Set(toks(x)); const v=terms.filter(w=>t.has(w)).length; if(v>bv){bv=v;bi=i;}}); let out=ss[bi].trim(); if(bi>0&&/^(After that|Beyond that|That|This|It|They|These|Both|Outside these)\b/.test(out)) out=ss[bi-1].trim()+' '+out; return out;}

/* ================= understanding the question ================= */
const CAT_WORDS=[['rm',/repair|maintenance|breakdown|brake/],['tyre',/tyre|tire/],['parking',/parking/],['washing',/wash/],['docs',/document|permit|insurance|fitness|puc|road tax/],['accident',/accident|claim|collision/],['fooding',/food|meal/],['salary',/salary|wage|overtime|driver pay/]];
function parseQ(q,app){
  const ql=q.toLowerCase(); const E={};
  const vm=ql.match(/\b(kol|ghy|jsg|ang|dhn|jsr|krb)[\s-]?(\d{3})\b/); if(vm){const code=vm[1].toUpperCase()+'-'+vm[2]; if(app.data.vehicles.some(v=>v.vehicle===code)) E.vehicle=code;}
  const c=CENTRES.find(c=>ql.includes(c.n.toLowerCase())||ql.includes(app.sn(c.k).toLowerCase())||new RegExp('\\b'+c.k.toLowerCase()+'\\b').test(ql)&&!vm); if(c) E.centre=c.k;
  const st=/assam|north.?east/.test(ql)?'Assam & NE':AREAS.find(x=>x!=='Assam & NE'&&ql.includes(x.toLowerCase())); if(st) E.state=st;
  const mm={aug:'2026-08',sep:'2026-09',oct:'2026-10',nov:'2026-11'}; const mt=ql.match(/\b(aug|sep|oct|nov)[a-z]*\b/); if(mt) E.month=mm[mt[1]];
  const cat=CAT_WORDS.find(([k,re])=>re.test(ql)); if(cat) E.cat=cat[0];
  const cl=CLIENTS.find(x=>ql.includes(x.n.toLowerCase().split(' ')[0])); if(cl) E.client=cl.n;
  const am=ql.match(/(?:₹|rs\.?|inr)\s*([\d,]+(?:\.\d+)?)\s*(k|lakh|lac|l)?\b|([\d,]+(?:\.\d+)?)\s*(k|lakh|lac)\b|\b(\d{1,3}(?:,\d{2,3})+|\d{4,})\b/);
  if(am){const n=+(am[1]||am[3]||am[5]||'0').replace(/,/g,''); const u=am[2]||am[4]; E.amount=u==='k'?n*1000:(u&&u!=='')?n*100000:n;}
  const I={approval:/approv|who (can )?(sign|sanction|authori)|sanction limit|authori[sz]/.test(ql),fuel:/fuel|diesel|litre|mileage|consum/.test(ql),service:/service|overdue|due for|servicing/.test(ql),
    market:/booking|placement|market|fill rate|detention|waiting/.test(ql),client:/client|customer|margin|profit|revenue|earn/.test(ql),
    cost:/cost|spend|budget|target|expense|over target|went up|go up|gone up|increase|\bhigh(er)?\b|\bover\b/.test(ql)||!!E.cat,health:/attention|worst|problem|issue|summary|overall|health|how are we|doing/.test(ql),
    policy:/should|policy|rule|sop|process|what to do|how do|allowed|procedure|steps|what happens|why/.test(ql),define:/^(what is|what's|what are|how many|how much|how long|when should|when do|when is|what does|is it allowed|can a|can we)\b/.test(ql.trim())};
  return {E,I};
}

/* ================= tools the assistant can call ================= */
function monthRows(arr,m,key='date'){return arr.filter(x=>monthOf(x[key])===m);}
const TOOLS={
  vehicle(app,E,m,I){
    const {data,derived,sn}=app; const code=E.vehicle; const v=data.vehicles.find(x=>x.vehicle===code); const lane=LANES.find(l=>l.site===v.site);
    const tr=derived.trips.filter(t=>t.vehicle===code&&monthOf(t.date)===m); const fu=derived.fuel.filter(f=>f.vehicle===code&&monthOf(f.date)===m); const pm=derived.pm.find(p=>p.vehicle===code);
    const over=fu.filter(x=>x.status==='above'); const avgO=fu.length?sum(fu,x=>x.litres/x.target)/fu.length*100-100:0; const rev=sum(tr,x=>x.revenue), net=sum(tr,x=>x.net);
    const fuelQ=I.fuel||(!I.service&&!I.cost&&!I.client);
    let lead, next=[], hint='';
    if(I.service){lead=`${code} is ${pm.status==='overdue'?'overdue for service by '+num(-pm.left)+' km':pm.status==='soon'?'due for service in '+num(pm.left)+' km':'not due for service yet — '+num(pm.left)+' km left'}.`; hint='service overdue dispatch interval'; if(pm.status==='overdue') next.push('Book its service now and keep it off long-haul lanes until done (PM Schedule §3).');}
    else if(fuelQ){lead=over.length?`${code} went above its fuel range ${over.length} time${over.length>1?'s':''} in ${monthLabel(m)}, using ${pct(avgO)} more diesel than the ${lane.target} L target on ${laneShort(lane.k)}.`:`${code} stayed within its fuel range in ${monthLabel(m)} (${fu.length} fills, ${pct(avgO)} vs target).`;
      hint='fuel above range action check injector driver'; if(over.length>=5) next.push('Start a fuel audit comparing the GPS route with the trip sheet (Fuel Policy §4).'); else if(over.length>=3) next.push('Book an injector and tyre-pressure check within 72 hours and brief the driver (Fuel Policy §4).');}
    else {lead=`${code} earned ${money(rev)} from ${tr.length} trips in ${monthLabel(m)} at a ${pct(rev?net/rev*100:0)} margin.`; hint='vehicle';}
    if(pm.status==='soon'&&!I.service) next.push(`Its service is due in ${num(pm.left)} km — do both jobs in one visit.`);
    return {name:'Vehicle data',sum:`${code}: ${fu.length} fills, ${over.length} above range; ${tr.length} trips; service ${PM_ST[pm.status].l.toLowerCase()}`,lead,
      facts:[['Vehicle',`${v.make}, ${sn(v.site)}`],['Fuel fills above range',`${over.length} of ${fu.length}`,over.length>=3?'bad':'good'],['Avg vs target',(avgO>=0?'+':'')+pct(avgO),avgO>4?'bad':avgO>0?'warn':'good'],['Trips · margin',`${tr.length} · ${pct(rev?net/rev*100:0)}`],['Next service',pm.status==='overdue'?'Overdue':num(pm.left)+' km',pm.status==='ok'?'good':pm.status==='soon'?'warn':'bad']],
      next,hint,actions:[{l:'Open '+code+' in Vehicle 360',veh:code}]};
  },
  fuel(app,E,m){
    const {derived,sn}=app; const rows=derived.fuel.filter(x=>monthOf(x.date)===m&&(!E.centre||x.site===E.centre)); const w=rows.filter(x=>x.status==='within').length/Math.max(1,rows.length)*100;
    const lanes=LANES.filter(l=>!E.centre||l.site===E.centre).map(l=>{const x=rows.filter(y=>y.route===l.k); return {l,p:x.length?x.filter(y=>y.status==='within').length/x.length*100:100};}).sort((a,b)=>a.p-b.p);
    const off=Object.entries(groupBy(rows.filter(x=>x.status==='above'),x=>x.vehicle)).sort((a,b)=>b[1].length-a[1].length);
    const worst=lanes[0]; const top=off[0];
    const next=[]; if(top&&top[1].length>=3) next.push(`Start with ${top[0]}: ${top[1].length} above-range fills means an injector check within 72 hours (Fuel Policy §4).`);
    if(worst&&worst.l.k==='GHY-SHL'&&worst.p<80) next.push('Guwahati → Shillong is a hill lane; outside June–September the normal limits apply, so check brakes and clutch (Fuel Policy §5).');
    return {name:'Fuel data',sum:`${num(rows.length)} fills checked, ${pct(w,0)} within target`,lead:`${pct(w,0)} of diesel fills were within target in ${monthLabel(m)}${E.centre?' at '+sn(E.centre):''}. ${worst?laneShort(worst.l.k)+' is the weakest lane ('+pct(worst.p,0)+' within).':''}`,
      facts:[['Fills checked',num(rows.length)],['Within target',pct(w,0),w>=80?'good':w>=65?'warn':'bad'],['Weakest lane',worst?laneShort(worst.l.k):'—','warn'],['Top over-consumer',top?`${top[0]} (${top[1].length}×)`:'None',top&&top[1].length>=3?'bad':'good']],
      next,hint:'fuel above range action threshold'+(worst&&worst.l.k==='GHY-SHL'?' hilly lane':''),actions:top?[{l:'Open '+top[0],veh:top[0]},{l:'Go to Diesel / Fuel',go:'fuel'}]:[{l:'Go to Diesel / Fuel',go:'fuel'}]};
  },
  service(app,E){
    const {derived,sn}=app; const all=derived.pm.filter(x=>!E.centre||x.site===E.centre); const od=all.filter(x=>x.status==='overdue').sort((a,b)=>a.left-b.left); const soon=all.filter(x=>x.status==='soon');
    return {name:'Service register',sum:`${od.length} overdue, ${soon.length} due soon`,lead:od.length?`${od.length} vehicle${od.length>1?'s are':' is'} overdue for service${E.centre?' at '+sn(E.centre):''}: ${od.slice(0,5).map(x=>x.vehicle).join(', ')}${od.length>5?' and more':''}.`:`No vehicle is overdue for service${E.centre?' at '+sn(E.centre):''}.`,
      facts:[['Vehicles tracked',all.length],['Overdue',od.length,od.length?'bad':'good'],['Due within 1,500 km',soon.length,'warn'],['Most overdue',od[0]?`${od[0].vehicle} (${num(-od[0].left)} km)`:'—']],
      next:od.length?['Book the overdue vehicles first and keep them off long-haul lanes until serviced (PM Schedule §3).']:[],hint:'service overdue dispatch interval due soon',actions:[...(od[0]?[{l:'Open '+od[0].vehicle,veh:od[0].vehicle}]:[]),{l:'Go to Preventive Maintenance',go:'maintenance'}]};
  },
  cost(app,E,m){
    const {data,settings,sn}=app; const inC=s=>!E.centre||s===E.centre; const prev=toISO(new Date(Date.UTC(+m.slice(0,4),+m.slice(5,7)-2,1))).slice(0,7);
    const calc=(k,mm)=>({a:sum(data.cost.filter(x=>x.category===k&&monthOf(x.date)===mm&&inC(x.site)),x=>x.amount),t:sum(SITES.filter(inC),s=>costTgt(settings,k,mm,s))});
    const where=E.centre?sn(E.centre):'all centres';
    if(E.cat){const C=CAT[E.cat], c=calc(E.cat,m), p=calc(E.cat,prev); const pc=c.t?c.a/c.t*100:0; const ch=p.a?(c.a/p.a-1)*100:0;
      const rows=data.cost.filter(x=>x.category===E.cat&&monthOf(x.date)===m&&inC(x.site)); const heads=Object.entries(groupBy(rows,x=>x.head)).map(([h,a])=>[h,sum(a,x=>x.amount)]).sort((a,b)=>b[1]-a[1]);
      return {name:'Cost data',sum:`${C.l} at ${where}: ${money(c.a)} vs ${money(c.t)} target`,lead:`${C.l} at ${where} was ${money(c.a)} in ${monthLabel(m)} — ${pct(pc,0)} of target, ${ch>=0?'up':'down'} ${pct(Math.abs(ch),0)} on ${monthShort(prev)}.`,
        facts:[['Actual',money(c.a)],['Target',money(c.t)],['Used',pct(pc,0),pc<=100?'good':pc<=110?'warn':'bad'],['Biggest head',heads[0]?`${heads[0][0]} (${money(heads[0][1])})`:'—']],
        next:pc>110?['Explain the overspend in the weekly cost review (Cost Control §3).']:[],hint:`${C.l} ${E.centre?sn(E.centre):''} ${heads[0]?heads[0][0]:''} ${monthShort(m)} incident review notes`,actions:[{l:'Go to '+C.l,go:C.page}]};}
    const cats=COST_CATS.map(c=>({c,...calc(c.k,m)})).map(x=>({...x,p:x.t?x.a/x.t*100:0})).sort((a,b)=>b.p-a.p); const A=sum(cats,x=>x.a), T=sum(cats,x=>x.t); const over=cats.filter(x=>x.p>100);
    return {name:'Cost data',sum:`Fleet cost at ${where}: ${money(A)} vs ${money(T)}`,lead:`Fleet cost at ${where} was ${money(A)} in ${monthLabel(m)}, ${pct(T?A/T*100:0,0)} of target. ${over.length?over.slice(0,3).map(x=>x.c.l+' ('+pct(x.p,0)+')').join(', ')+(over.length>1?' are':' is')+' over target.':'Every cost head is within target.'}`,
      facts:cats.slice(0,4).map(x=>[x.c.l,pct(x.p,0)+' of target',x.p<=100?'good':x.p<=110?'warn':'bad']),next:over.length?['Ask the centre heads to explain heads above 110% of pace in the weekly review (Cost Control §3).']:[],hint:'cost target pace review '+over.map(x=>x.c.l).join(' ')+' '+(E.centre?sn(E.centre):''),actions:[{l:'Go to Management Overview',go:'cost-overview'}]};
  },
  market(app,E,m){
    const {data,settings}=app; const rows=data.market.filter(x=>monthOf(x.date)===m&&(!E.state||x.area===E.state));
    const by=AREAS.filter(a=>!E.state||a===E.state).map(a=>{const x=rows.filter(y=>y.area===a); const b=sum(x,y=>y.bookings),p=sum(x,y=>y.placements); return {a,f:b?p/b*100:0,d:x.length?sum(x,y=>y.detentionHrs)/x.length:0,p,t:mktTgt(settings,m,a)};});
    const B=sum(rows,x=>x.bookings), P=sum(rows,x=>x.placements); const low=[...by].sort((a,b)=>a.f-b.f)[0], wait=[...by].sort((a,b)=>b.d-a.d)[0];
    return {name:'Market data',sum:`${num(B)} bookings, ${pct(B?P/B*100:0,0)} placed`,lead:`${pct(B?P/B*100:0,0)} of market bookings were placed in ${monthLabel(m)}${E.state?' in '+E.state:''}, against a 92% target. ${low&&!E.state?low.a+' had the lowest fill rate ('+pct(low.f,0)+').':''}`,
      facts:[['Bookings',num(B)],['Placed',num(P)],['Lowest fill',low?`${low.a} (${pct(low.f,0)})`:'—',low&&low.f<88?'bad':'good'],['Longest wait',wait?`${wait.a} (${num1(wait.d)} h)`:'—',wait&&wait.d>6?'warn':'good']],
      next:wait&&wait.d>6?[`Bill detention for waits beyond free time in ${wait.a} (Market Terms §2).`]:[],hint:'placement fill rate detention free time'+(low&&/Assam/.test(low.a)?' assam north east':''),actions:[{l:'Go to Market Ops',go:'market'}]};
  },
  client(app,E,m){
    const {derived,sn}=app; const rows=derived.trips.filter(x=>monthOf(x.date)===m&&(!E.centre||x.site===E.centre));
    const by=CLIENTS.map(c=>{const t=rows.filter(x=>x.client===c.n); const r=sum(t,x=>x.revenue),n=sum(t,x=>x.net); return {c,t:t.length,r,mg:r?n/r*100:0};}).filter(x=>x.t);
    const avg=sum(by,x=>x.r)?sum(rows,x=>x.net)/sum(rows,x=>x.revenue)*100:0;
    if(E.client){const x=by.find(y=>y.c.n===E.client)||{c:CLIENT[E.client],t:0,r:0,mg:0}; return {name:'Client data',sum:`${E.client}: ${x.t} trips, ${pct(x.mg)} margin`,lead:`${E.client} (${x.c.ind}, ${sn(x.c.site)}) gave ${x.t} trips and ${money(x.r)} of revenue in ${monthLabel(m)} at a ${pct(x.mg)} margin — ${x.mg>=avg?'above':'below'} the ${pct(avg)} average.`,
      facts:[['Industry',x.c.ind],['Trips',x.t],['Revenue',money(x.r)],['Margin',pct(x.mg),x.mg>=avg?'good':'warn']],next:[],hint:x.c.seg==='FMCG & consumer'?'fmcg rate card terms':'heavy material rate card',actions:[{l:'Go to Financials',go:'financials'}]};}
    const low=[...by].sort((a,b)=>a.mg-b.mg)[0], top=[...by].sort((a,b)=>b.r-a.r)[0];
    return {name:'Client data',sum:`${by.length} active clients, average margin ${pct(avg)}`,lead:`${low.c.n} had the lowest margin in ${monthLabel(m)} at ${pct(low.mg)}, against an average of ${pct(avg)}. ${top.c.n} brought in the most revenue (${money(top.r)}).`,
      facts:[['Active clients',by.length],['Average margin',pct(avg)],['Lowest margin',`${low.c.n} (${pct(low.mg)})`,'warn'],['Top revenue',`${top.c.n}`]],next:['Review the rate card for the lowest-margin client before the next renewal.'],hint:low.c.seg==='FMCG & consumer'?'fmcg rate card':'heavy material rate card shortage',actions:[{l:'Go to Financials',go:'financials'}]};
  },
  centre(app,E,m){
    const {data,derived,settings,sn}=app; const k=E.centre; const dr=monthRows(derived.daily,m).filter(x=>x.site===k); const fu=monthRows(derived.fuel,m).filter(x=>x.site===k); const tr=monthRows(derived.trips,m).filter(x=>x.site===k);
    const co=sum(monthRows(data.cost,m).filter(x=>x.site===k),x=>x.amount), ct=sum(COST_CATS,c=>costTgt(settings,c.k,m,k)); const mv=sum(dr,x=>x.transit)/Math.max(1,sum(dr,x=>x.deployed))*100; const rev=sum(tr,x=>x.revenue);
    return {name:'Centre data',sum:`${sn(k)}: moving ${pct(mv,0)}, cost ${pct(ct?co/ct*100:0,0)} of target`,lead:`${sn(k)} runs ${data.vehicles.filter(v=>v.site===k).length} vehicles. In ${monthLabel(m)} its trucks were moving ${pct(mv,0)} of the time, earned ${money(rev)} and spent ${pct(ct?co/ct*100:0,0)} of the cost target.`,
      facts:[['Moving',pct(mv,0),mv>=82?'good':mv>=75?'warn':'bad'],['Fuel within target',pct(fu.filter(x=>x.status==='within').length/Math.max(1,fu.length)*100,0)],['Revenue',money(rev)],['Cost vs target',pct(ct?co/ct*100:0,0),co<=ct?'good':'bad']],next:[],hint:sn(k)+' centre '+monthShort(m),actions:[{l:'Focus the app on '+sn(k),site:k}]};
  },
  health(app,E,m){
    const {data,derived,settings,sn}=app;
    const sc=CENTRES.map(c=>{const dr=monthRows(derived.daily,m).filter(x=>x.site===c.k); const fu=monthRows(derived.fuel,m).filter(x=>x.site===c.k); const mv=sum(dr,x=>x.transit)/Math.max(1,sum(dr,x=>x.deployed))*100; const fw=fu.filter(x=>x.status==='within').length/Math.max(1,fu.length)*100;
      const co=sum(monthRows(data.cost,m).filter(x=>x.site===c.k),x=>x.amount), ct=sum(COST_CATS,k=>costTgt(settings,k.k,m,c.k)); const rep=findRepeats(dr).length; const od=derived.pm.filter(x=>x.site===c.k&&x.status==='overdue').length;
      const why=[]; if(mv<78) why.push('low moving rate ('+pct(mv,0)+')'); if(fw<75) why.push('fuel within target only '+pct(fw,0)); if(ct&&co/ct>1.03) why.push('cost '+pct(co/ct*100,0)+' of target'); if(rep) why.push('repeated daily figures'); if(od>=3) why.push(od+' services overdue');
      return {c,why,s:why.length};}).sort((a,b)=>b.s-a.s);
    const top=sc.filter(x=>x.s);
    return {name:'Network health',sum:`${top.length} centre${top.length===1?'':'s'} with open issues`,lead:top.length?`${sn(top[0].c.k)} needs the most attention in ${monthLabel(m)}: ${top[0].why.join(', ')}.`:'No centre has open issues this month.',
      facts:top.slice(0,4).map(x=>[sn(x.c.k),x.why.slice(0,2).join(', '),x.s>=2?'bad':'warn']),next:top.length?['Raise these in the weekly review, starting with '+sn(top[0].c.k)+'.']:[],hint:'daily reporting identical figures review '+(top[0]?sn(top[0].c.k):''),actions:top[0]?[{l:'Focus the app on '+sn(top[0].c.k),site:top[0].c.k}]:[]};
  },
  approval(app,E){
    const a=E.amount; const L=[[10000,'Centre supervisor'],[50000,'Centre head'],[200000,'Head of Operations'],[Infinity,'CFO']]; const who=a?L.find(x=>a<=x[0])[1]:null;
    return {name:'Approval matrix',sum:a?`₹${inr0(a)} → ${who}`:'Approval levels listed',lead:a?`A spend of ₹${inr0(a)} needs approval from the ${who}.`:'Approvals depend on the amount:',
      facts:[['Up to ₹10,000','Centre supervisor'],['₹10,001 – ₹50,000','Centre head'],['₹50,001 – ₹2,00,000','Head of Operations'],['Above ₹2,00,000','CFO']].map(f=>[f[0],f[1],who===f[1]?'good':null]),
      qk:who||undefined,next:a&&a<=100000?['In a breakdown or accident, the centre head can approve this immediately and record it within 24 hours (Approval Matrix §3).']:[],hint:'approval matrix spending limit emergency',actions:[]};
  }
};

/* ================= the agent: plan → call tools → search documents → compose ================= */
function runAgent(q,app){
  const {E,I}=parseQ(q,app); const F=app.filters; const m=E.month||(F.month==='all'?app.latestMonth:F.month);
  if(!E.centre&&F.site!=='all'&&!E.vehicle&&!/all centres|network|every centre/.test(q.toLowerCase())) E.centreFromFilter=true;
  const Ec={...E,centre:E.centre||(E.centreFromFilter?F.site:undefined)};
  let tool=null;
  if(I.approval) tool='approval'; else if(E.vehicle) tool='vehicle'; else if(I.fuel) tool='fuel'; else if(I.service) tool='service'; else if(I.market) tool='market';
  else if(I.cost) tool='cost'; else if(I.client||E.client) tool='client'; else if(I.health) tool='health'; else if(E.centre) tool='centre';
  const pre=kbSearch(q,1).res[0]; if(I.define&&!I.approval&&!E.vehicle&&!E.centre&&!E.state&&!E.client&&pre&&pre.score>=6) tool=null;
  const out=tool?TOOLS[tool](app,Ec,m,I):null;
  const docQ=q+' '+(out?out.hint:'');
  const S=kbSearch(docQ,3); const top=S.res[0];
  const strong=top&&top.score>=3.2;
  const steps=[{k:'parse',t:'Understood the question',chips:[E.vehicle&&'Vehicle '+E.vehicle,Ec.centre&&'Centre '+app.sn(Ec.centre)+(E.centreFromFilter?' (from filter)':''),E.state&&'State '+E.state,E.cat&&CAT[E.cat].l,E.client&&E.client,E.amount&&'₹'+inr0(E.amount),'Month '+monthLabel(m),...Object.keys(I).filter(k=>I[k]).map(k=>'about '+k)].filter(Boolean)}];
  if(out) steps.push({k:'tool',t:'Called a data tool: '+out.name,d:out.sum});
  steps.push({k:'search',t:'Searched '+KB.length+' documents for: '+S.terms.slice(0,8).join(', '),res:S.res});
  const cites=strong?S.res.filter((r,i)=>i===0||(r.score>=top.score*.6&&r.score>=5)).slice(0,2):[];
  let ans;
  if(out) ans={lead:out.lead,facts:out.facts,quote:cites[0]?{t:bestSentence(cites[0].sec.x,S.terms,out.qk),i:1}:null,next:out.next,actions:out.actions};
  else if(strong) ans={lead:bestSentence(cites[0].sec.x,S.terms),more:cites[0].sec.x,quote:null,facts:[],next:[],actions:[],docOnly:true};
  else ans={lead:'I couldn’t find that in FleetSight’s data or its documents, so I won’t guess. Try asking about fuel, costs, services, market bookings, clients, approvals or a vehicle code like KRB-118.',facts:[],next:[],actions:[],none:true};
  ans.cites=cites; steps.push({k:'compose',t:ans.none?'Nothing reliable found — said so instead of guessing':'Wrote the answer'+(cites.length?' with '+cites.length+' source'+(cites.length>1?'s':''):'')+(out?' using live data':'')});
  return {q,ans,steps,terms:S.terms};
}

/* ================= chat panel ================= */
const ASK_SUGGEST=['Why is KRB-118 using extra diesel, and what should we do?','Which centre needs attention this month?','Why did Guwahati’s repair cost go up in October?','Who approves a ₹60,000 repair?','Which vehicles are overdue for service at Korba?','What should a driver do if a truck breaks down on the highway?','Which client has the lowest margin?','Why was Angul’s driver salary over in October?'];
function AskFab({onClick}){return html`<button className="askfab" onClick=${onClick} aria-label="Ask FleetSight"><${Icon} n="ai" s=${18}/><span>Ask FleetSight</span></button>`;}
function Highlight({text,terms}){
  if(!terms||!terms.length) return text;
  const parts=String(text).split(/(\s+)/); return parts.map((p,i)=>{const t=toks(p); return t.length&&terms.includes(t[0])?html`<mark key=${i}>${p}</mark>`:p;});
}
function AskPanel({onClose,msgs,setMsgs}){
  const app=useApp(); const [tab,setTab]=useState('ask'); const [q,setQ]=useState(''); const [doc,setDoc]=useState(null); const [kq,setKq]=useState(''); const body=useRef(); const inp=useRef();
  useEffect(()=>{const k=e=>{if(e.key==='Escape') onClose();}; window.addEventListener('keydown',k); setTimeout(()=>inp.current&&inp.current.focus(),120); return ()=>window.removeEventListener('keydown',k);},[]);
  useEffect(()=>{if(body.current) body.current.scrollTop=body.current.scrollHeight;},[msgs,tab]);
  const ask=text=>{const t=(text||q).trim(); if(!t) return; setQ(''); const id=uid(); const r=runAgent(t,app);
    setMsgs(ms=>[...ms,{id:id+'u',role:'user',t},{id,role:'bot',r,shown:0}]);
    r.steps.forEach((_,i)=>setTimeout(()=>setMsgs(ms=>ms.map(x=>x.id===id?{...x,shown:i+1}:x)),380*(i+1)));
  };
  const act=a=>{if(a.veh) app.openVehicle(a.veh); else if(a.go){app.go(a.go);} else if(a.site) app.setFilters(f=>({...f,site:a.site}));};
  const openCite=(c,terms)=>{setDoc({d:c.doc,sec:c.sec.n,terms}); setTab('docs');};
  const docs=kq?KB.filter(d=>(d.t+' '+d.sec.map(s=>s.h+' '+s.x).join(' ')).toLowerCase().includes(kq.toLowerCase())):KB;
  const types=[...new Set(KB.map(d=>d.type))];
  useEffect(()=>{if(doc&&doc.sec){setTimeout(()=>{const el=document.getElementById('kbsec-'+doc.sec); if(el) el.scrollIntoView({block:'start',behavior:'smooth'});},80);}},[doc]);
  return html`<div className="askwrap" role="dialog" aria-label="Ask FleetSight">
    <div className="askhead">
      <div className="row" style=${{gap:10}}><span className="askicon"><${Icon} n="ai" s=${18}/></span><div style=${{flex:1}}><b>Ask FleetSight</b><span>Answers from live data and ${KB.length} company documents</span></div><button className="ibtn" style=${{color:'#fff'}} aria-label="Close" onClick=${onClose}><${Icon} n="x" s=${18}/></button></div>
      <div className="asktabs"><button className=${tab==='ask'?'on':''} onClick=${()=>setTab('ask')}>Ask</button><button className=${tab==='docs'?'on':''} onClick=${()=>{setTab('docs');}}>Documents (${KB.length})</button></div>
    </div>
    ${tab==='ask'?html`<div className="askbody" ref=${body}>
      ${msgs.length?null:html`<div className="askhello"><p><b>Hi! I can answer questions about your fleet.</b> I check the live numbers, search the company’s policies and SOPs, and show you exactly how I got the answer.</p><div className="askchips">${ASK_SUGGEST.map(s=>html`<button key=${s} className="chip" onClick=${()=>ask(s)}>${s}</button>`)}</div><p className="muted xs" style=${{marginTop:12}}><${Icon} n="lock" s=${12}/> Everything runs inside your browser. Nothing you type leaves this page.</p></div>`}
      ${msgs.map(mg=>mg.role==='user'?html`<div key=${mg.id} className="umsg">${mg.t}</div>`:html`<${BotMsg} key=${mg.id} m=${mg} act=${act} openCite=${openCite}/>`)}
    </div>
    <div className="askin"><input ref=${inp} className="inp" placeholder="Ask about fuel, costs, a vehicle, a policy…" value=${q} onInput=${e=>setQ(e.target.value)} onKeyDown=${e=>{if(e.key==='Enter') ask();}} aria-label="Your question"/><button className="btn pri" onClick=${()=>ask()} aria-label="Send" disabled=${!q.trim()}><${Icon} n="arrow" s=${16}/></button></div>`
    :html`<div className="askbody">${doc?html`<div>
        <button className="btn sm" onClick=${()=>setDoc(null)} style=${{marginBottom:10}}><${Icon} n="cup" s=${14} c="rot"/>All documents</button>
        <div className="kbdoc"><div className="row"><${Pill} t=${doc.d.type} c="#0E7490"/><span className="muted xs">Updated ${doc.d.up}</span></div><h3>${doc.d.t}</h3>
          ${doc.d.sec.map(s=>html`<div key=${s.n} id=${'kbsec-'+s.n} className=${'kbsec'+(doc.sec===s.n?' hit':'')}><h4>§${s.n} ${s.h}</h4><p><${Highlight} text=${s.x} terms=${doc.sec===s.n?doc.terms:null}/></p></div>`)}</div></div>`
      :html`<div><div className="search" style=${{maxWidth:'none',marginBottom:12}}><${Icon} n="search" s=${14}/><input className="inp" placeholder="Search documents" value=${kq} onInput=${e=>setKq(e.target.value)}/></div>
        <p className="muted xs" style=${{margin:'0 0 10px'}}>These are the documents the assistant searches. Each section is one searchable passage.</p>
        ${types.map(t=>{const ds=docs.filter(d=>d.type===t); return ds.length?html`<div key=${t} style=${{marginBottom:10}}><div className="navg" style=${{padding:'4px 0'}}>${t}</div><div className="alist">${ds.map(d=>html`<button key=${d.id} className="aitem" onClick=${()=>setDoc({d,sec:null,terms:null})}><span className="ai" style=${{background:'var(--soft)',color:'var(--accent)'}}><${Icon} n="file" s=${15}/></span><span><b>${d.t}</b><br/><span className="muted">${d.sec.length} sections · updated ${d.up}</span></span><span className="go"><${Icon} n="arrow" s=${15}/></span></button>`)}</div></div>`:null;})}</div>`}</div>`}
  </div>`;
}
function BotMsg({m,act,openCite}){
  const {r,shown}=m; const done=shown>=r.steps.length; const [trace,setTrace]=useState(false); const a=r.ans; const TONE_C={good:'#10B981',warn:'#F59E0B',bad:'#EF4444'};
  if(!done) return html`<div className="bmsg"><div className="thinking">${r.steps.slice(0,shown+1).map((s,i)=>html`<div key=${i} className=${'tstep2'+(i<shown?' ok':'')}>${i<shown?html`<${Icon} n="check" s=${13}/>`:html`<span className="spin"></span>`}<span>${s.t}</span></div>`)}</div></div>`;
  return html`<div className="bmsg">
    <p className="blead">${a.lead}${a.docOnly&&a.cites[0]?html` <button className="cite" onClick=${()=>openCite(a.cites[0],r.terms)}>1</button>`:null}</p>
    ${a.facts&&a.facts.length?html`<div className="bfacts">${a.facts.map((f,i)=>html`<div key=${i}><span>${f[0]}</span><b style=${{color:f[2]?TONE_C[f[2]]:undefined}}>${f[1]}</b></div>`)}</div>`:null}
    ${a.quote?html`<div className="bquote"><span className="muted xs">What our documents say</span><p>“${a.quote.t}” <button className="cite" onClick=${()=>openCite(a.cites[0],r.terms)}>1</button></p></div>`:null}
    ${a.next&&a.next.length?html`<div className="bnext"><b>Suggested next step</b>${a.next.map((n,i)=>html`<div key=${i} className="row" style=${{alignItems:'flex-start',gap:6}}><${Icon} n="arrow" s=${14}/><span>${n}</span></div>`)}</div>`:null}
    ${a.actions&&a.actions.length?html`<div className="row wrap" style=${{gap:6,marginTop:8}}>${a.actions.map((x,i)=>html`<button key=${i} className="btn sm" onClick=${()=>act(x)}>${x.l}</button>`)}</div>`:null}
    ${a.cites.length?html`<div className="bsrc"><span className="muted xs">Sources</span>${a.cites.map((c,i)=>html`<button key=${c.id} className="srcchip" onClick=${()=>openCite(c,r.terms)}><i>${i+1}</i>${c.doc.t} §${c.sec.n}</button>`)}</div>`:null}
    <button className="tracebtn" onClick=${()=>setTrace(!trace)} aria-expanded=${trace}><${Icon} n=${trace?'cup':'cdown'} s=${13}/>How I worked this out</button>
    ${trace?html`<ol className="trace">${r.steps.map((s,i)=>html`<li key=${i}><b>${s.t}</b>
      ${s.chips?html`<div className="row wrap" style=${{gap:4,marginTop:4}}>${s.chips.map(c=>html`<span key=${c} className="tchip">${c}</span>`)}</div>`:null}
      ${s.d?html`<div className="muted xs" style=${{marginTop:2}}>${s.d}</div>`:null}
      ${s.res?html`<div style=${{marginTop:4}}>${s.res.length?s.res.map(x=>html`<div key=${x.id} className="tres"><span>${x.doc.t} §${x.sec.n}</span><span className="tbar"><i style=${{width:Math.min(100,x.score/s.res[0].score*100)+'%'}}></i></span><b>${x.score.toFixed(1)}</b></div>`):html`<span className="muted xs">No matching passage.</span>`}<div className="muted xs" style=${{marginTop:3}}>Score = BM25 relevance. Higher means more of your words, and rarer ones, appear in that passage.</div></div>`:null}</li>`)}</ol>`:null}
  </div>`;
}
