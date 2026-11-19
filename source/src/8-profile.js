/* ================= MEET THE BUILDER ================= */
const PROFILE={name:'Rishabh Agarwal',role:'AVP – IT',edu:['MBA Finance, Indian Institute of Management Sirmaur','B.Tech Computer Science'],
  quote:'Helping you understand businesses, not just numbers.',linkedin:'https://www.linkedin.com/in/iimrishabh-agarwal/',
  skills:['Operations analytics','Cost & profitability','MIS & dashboards','Data storytelling','AI assistants (RAG + agents)']};
function Avatar({s=76}){return html`<span className="avatar" style=${{width:s,height:s}}><img src=${PROFILE_IMG} alt=${'Photo of '+PROFILE.name} width=${s} height=${s}/></span>`;}
const LI_ICON='<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>';
function ProfileCard({inModal}){
  return html`<section className=${'profile'+(inModal?' inmodal':'')} aria-label="Meet the builder">
    <div className="prof-top">
      <${Avatar} s=${inModal?96:92}/>
      <div className="prof-id"><div className="prof-tag">Meet the builder</div><h2>${PROFILE.name}</h2><div className="prof-role">${PROFILE.role}</div>
        ${PROFILE.edu.map(e=>html`<div key=${e} className="prof-edu"><${Icon} n="check" s=${13}/>${e}</div>`)}</div>
      <a className="prof-li" href=${PROFILE.linkedin} target="_blank" rel="noopener noreferrer"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" dangerouslySetInnerHTML=${{__html:LI_ICON}}></svg>Connect on LinkedIn</a>
    </div>
    <p className="prof-quote">“${PROFILE.quote}”</p>
    <div className="prof-chips">${PROFILE.skills.map(s=>html`<span key=${s}>${s}</span>`)}</div>
  </section>`;
}
function ProfileChip({onClick}){
  return html`<button className="profchip" onClick=${onClick} aria-label="About the builder"><${Avatar} s=${34}/><span><b>${PROFILE.name}</b><small>Built FleetSight</small></span><${Icon} n="arrow" s=${15}/></button>`;
}
