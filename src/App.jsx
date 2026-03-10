import { useState, useEffect } from "react";

const API = process.env.REACT_APP_API_URL || "https://jobagent-api.onrender.com";
const LI = "#0a66c2";

// region: "romandie" = VD, GE, FR, NE, VS | "other" = ZH, BE, LU…
// ── Offres FR + EN ───────────────────────────────────────────────────────────
const JOBS_FR = [
  { id:1,  lang:"fr", region:"romandie", title:"Ingénieur Mécanique Senior – Ferroviaire", company:"MATISA SA", location:"Crissier, VD", salary:"105–120k CHF", score:97, tags:["Ferroviaire","CATIA","Change Request"], desc:"Conception mécanique machines ferroviaires haute technologie. CATIA, Change Requests, coordination multi-sites.", url:"https://www.matisa.ch/carrieres", source:"jobup.ch", linkedin:false, easyApply:false, note:"🏆 Match parfait — ferroviaire + CATIA + 8 ans" },
  { id:2,  lang:"fr", region:"other",    title:"Chef de Projet Technique – Rail", company:"Stadler Rail", location:"Biel/Bienne, BE", salary:"110–130k CHF", score:93, tags:["Chef de projet","Ferroviaire","Management"], desc:"Pilotage projets matériel roulant ferroviaire. Management pluridisciplinaire, coordination internationale.", url:"https://www.linkedin.com/jobs/search/?keywords=stadler+rail+chef+projet", source:"LinkedIn", linkedin:true, easyApply:true, note:"⭐ Votre exp. ALSTOM multi-sites = atout majeur" },
  { id:3,  lang:"fr", region:"romandie", title:"Ingénieur Système CVC/HVAC", company:"Amstein+Walthert", location:"Lausanne, VD", salary:"102–118k CHF", score:88, tags:["HVAC","CVC","Ingénierie"], desc:"Systèmes HVAC complexes pour projets industriels Romandie.", url:"https://www.linkedin.com/jobs/search/?keywords=ingenieur+hvac+lausanne", source:"LinkedIn", linkedin:true, easyApply:false, note:"Spécialité CVC ferroviaire MI20 très valorisée" },
  { id:4,  lang:"fr", region:"romandie", title:"Chef de Projet Infrastructures", company:"CFF / SBB", location:"Lausanne, VD", salary:"108–125k CHF", score:85, tags:["Ferroviaire","CFF","Infrastructure"], desc:"Gestion projets infrastructure ferroviaire réseau national suisse.", url:"https://www.sbb.ch/fr/a-propos-des-cff/emplois.html", source:"sbb.ch", linkedin:false, easyApply:false, note:"CFF = sécurité emploi + 2e pilier avantageux" },
  { id:5,  lang:"fr", region:"other",    title:"Ingénieur Conception Mécanique", company:"RUAG MRO Switzerland", location:"Emmen, LU", salary:"100–115k CHF", score:81, tags:["Mécanique","CATIA","Teamcenter"], desc:"Conception mécanique avancée transport et défense. CATIA V5/V6, Teamcenter, Windchill.", url:"https://www.linkedin.com/jobs/search/?keywords=ruag+ingenieur+mecanique", source:"LinkedIn", linkedin:true, easyApply:true, note:"Vos outils (CATIA, Teamcenter) = match direct" },
  { id:6,  lang:"fr", region:"romandie", title:"Chef de Projet – Énergie & Industrie", company:"Lombardi SA", location:"Lausanne, VD", salary:"100–118k CHF", score:77, tags:["Gestion projet","Ingénierie"], desc:"Pilotage projets ingénierie industrielle complexes.", url:"https://ch.indeed.com/emplois?q=lombardi+chef+de+projet", source:"Indeed CH", linkedin:false, easyApply:false, note:"Bon match management, secteur élargi" },
  { id:7,  lang:"fr", region:"romandie", title:"Chef de Projet Technique – Ferroviaire", company:"Alstom (site Romandie)", location:"Genève, GE", salary:"110–130k CHF", score:91, tags:["Ferroviaire","Chef de projet","Alstom"], desc:"Pilotage de projets matériel roulant pour clients suisses et européens. Management multi-sites, coordination fournisseurs, CATIA.", url:"https://www.linkedin.com/jobs/search/?keywords=alstom+chef+de+projet+geneve", source:"LinkedIn", linkedin:true, easyApply:true, note:"🏆 Alstom Genève — votre profil ALSTOM France = atout direct" },
  { id:8,  lang:"fr", region:"romandie", title:"Ingénieur Projets Industriels", company:"Philip Morris International", location:"Lausanne, VD", salary:"105–125k CHF", score:78, tags:["Ingénierie","Gestion de projet","CATIA"], desc:"Gestion de projets d'ingénierie industrielle complexes. Coordination équipes internationales, suivi fournisseurs, planification.", url:"https://www.linkedin.com/jobs/search/?keywords=ingenieur+projet+lausanne+industriel", source:"LinkedIn", linkedin:true, easyApply:false, note:"Secteur industriel hors rail — votre gestion de projet valorisée" },
];

const JOBS_EN = [
  { id:101, lang:"en", region:"romandie", title:"Senior Project Manager – Rail Systems", company:"Alstom Switzerland", location:"Lausanne, VD", salary:"115–135k CHF", score:96, tags:["Railway","Project Management","Systems"], desc:"Lead complex rail system projects from the Lausanne office. Coordinate multidisciplinary teams, manage suppliers, strong HVAC/mechanical background preferred.", url:"https://www.linkedin.com/jobs/search/?keywords=senior+project+manager+rail+lausanne", source:"LinkedIn", linkedin:true, easyApply:true, note:"🏆 Direct match — your ALSTOM background is ideal, Lausanne site" },
  { id:102, lang:"en", region:"romandie", title:"HVAC Systems Engineer – Rail", company:"Bombardier Transportation", location:"Genève, GE", salary:"110–128k CHF", score:93, tags:["HVAC","Railway","Systems Engineering","CATIA"], desc:"Design and validate HVAC systems for rolling stock at the Geneva engineering centre. CATIA V5/V6, change management, collaboration with France and Belgium teams.", url:"https://www.linkedin.com/jobs/search/?keywords=hvac+systems+engineer+railway+geneva", source:"LinkedIn", linkedin:true, easyApply:true, note:"⭐ MI20 HVAC development = perfect fit for Geneva role" },
  { id:103, lang:"en", region:"romandie", title:"Mechanical Project Engineer", company:"CERN", location:"Meyrin, GE", salary:"108–130k CHF", score:86, tags:["Mechanical","Project Management","CATIA","Systems"], desc:"Lead mechanical engineering projects for large-scale scientific infrastructure. CATIA, multi-site coordination, international teams, French and English working languages.", url:"https://careers.cern.ch/", source:"cern.ch", linkedin:false, easyApply:false, note:"CERN = international, top conditions, VD/GE border" },
  { id:104, lang:"en", region:"romandie", title:"Technical Project Manager – Infrastructure", company:"SBB CFF FFS", location:"Lausanne, VD", salary:"112–128k CHF", score:88, tags:["Project Management","Railway","Infrastructure","SAP"], desc:"Manage railway infrastructure projects for the western Switzerland network. SAP, French and English, multi-stakeholder coordination.", url:"https://www.sbb.ch/en/the-sbb/jobs-and-careers.html", source:"sbb.ch", linkedin:false, easyApply:false, note:"SBB Lausanne — Romandie focus, French is an asset" },
  { id:105, lang:"en", region:"romandie", title:"Systems Engineer – Rail Projects", company:"Thales Suisse SA", location:"Écublens, VD", salary:"103–120k CHF", score:83, tags:["Systems Engineering","Railway","IBM DOORS","Requirements"], desc:"Requirements engineering and systems design for signalling and rail projects. IBM DOORS, international collaboration, English and French.", url:"https://www.linkedin.com/jobs/search/?keywords=thales+systems+engineer+railway+lausanne", source:"LinkedIn", linkedin:true, easyApply:false, note:"Thales VD — IBM DOORS from ALSTOM is directly valued" },
  { id:106, lang:"en", region:"other",    title:"Senior Mechanical Design Engineer", company:"RUAG MRO Switzerland", location:"Emmen, LU", salary:"105–120k CHF", score:79, tags:["CAD","CATIA","Teamcenter","Windchill"], desc:"Senior mechanical design for defence and transport. CATIA, Teamcenter, Windchill. English-speaking international teams.", url:"https://www.linkedin.com/jobs/search/?keywords=ruag+senior+mechanical+engineer", source:"LinkedIn", linkedin:true, easyApply:true, note:"Hors Romandie — outils exacts (CATIA, Teamcenter, Windchill)" },
  { id:107, lang:"en", region:"other",    title:"Mechanical Engineer – Rolling Stock", company:"Stadler Rail", location:"Biel/Bienne, BE", salary:"110–130k CHF", score:88, tags:["Mechanical","CATIA","Rolling Stock"], desc:"Design and develop mechanical systems for rolling stock. CATIA V5/V6, change management, multi-site coordination.", url:"https://www.linkedin.com/jobs/search/?keywords=mechanical+engineer+rolling+stock+stadler", source:"LinkedIn", linkedin:true, easyApply:false, note:"Hors Romandie — MF19/MI20 experience = perfect fit at Stadler" },
];

const ALL_JOBS = [...JOBS_FR, ...JOBS_EN];

const STATUSES = [
  { id:"none",    label:"—",            labelFR:"—",              color:"#94a3b8", bg:"#f8fafc",  icon:"○" },
  { id:"sent",    label:"Sent",         labelFR:"Envoyée",        color:"#2563eb", bg:"#eff6ff",  icon:"📤" },
  { id:"waiting", label:"Waiting",      labelFR:"En attente",     color:"#d97706", bg:"#fffbeb",  icon:"⏳" },
  { id:"interview",label:"Interview",   labelFR:"Entretien",      color:"#7c3aed", bg:"#f5f3ff",  icon:"🎯" },
  { id:"rejected",label:"Rejected",     labelFR:"Refusée",        color:"#dc2626", bg:"#fef2f2",  icon:"❌" },
  { id:"offer",   label:"Job Offer !",  labelFR:"Offre reçue !",  color:"#16a34a", bg:"#f0fdf4",  icon:"🎉" },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

const LiIcon = ({sz=14,color=LI}) => <svg width={sz} height={sz} viewBox="0 0 24 24" fill={color}>
  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
</svg>;

const Ring = ({s,sz=46}) => {
  const r=(sz-7)/2, c=2*Math.PI*r, off=c-(s/100)*c;
  const col=s>=90?"#16a34a":s>=80?"#d97706":"#ea580c";
  return <svg width={sz} height={sz} style={{transform:"rotate(-90deg)",flexShrink:0}}>
    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke="#e5e7eb" strokeWidth="5"/>
    <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={col} strokeWidth="5" strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"/>
    <text x={sz/2} y={sz/2} textAnchor="middle" dominantBaseline="central" fill={col} fontSize="10" fontWeight="700" style={{transform:`rotate(90deg)`,transformOrigin:`${sz/2}px ${sz/2}px`}}>{s}%</text>
  </svg>;
};

// ── Génération lettre ────────────────────────────────────────────────────────
const genLettre = async (job) => {
  const token = process.env.REACT_APP_SECRET || "";
  const isEN = job.lang === "en";

  const prompt = isEN
    ? `You are an expert Swiss recruiter. Write a professional cover letter in English, concise Swiss style, max 220 words. Tailor it specifically to the job description.

CANDIDATE — Rami Tlili, 8 years railway experience:
- Technical Project Manager, AKKODIS/ALSTOM (since Feb. 2023), Crespin
- Key projects: MF19 (Paris Metro lines 3,7,8,10,12,13), MI20 (future RER B), RER D & E
- Team management: 3–6 people, multi-site (India, Tarbes, Charleroi, Villeurbanne)
- Tools: CATIA V5/V6, PTC CREO, IBM DOORS, SAP, Teamcenter, Windchill, ANSYS, Change Requests
- HVAC/CVC railway specialist — full HVAC system development on MI20 project
- MSc Mechanical Engineering, University of Franche-Comté (2016)
- Languages: French (native), English (fluent), Arabic (native)
- Relocating to Switzerland (Permit B, French EU citizen)
- Target salary: ≥ 100,000 CHF/year
- Previous employer: WABTEC-FAIVELEY (Mechanical Design Engineer, 2018–2020)

JOB: ${job.title} at ${job.company}, ${job.location} · ${job.salary}
Description: ${job.desc}
Required skills: ${job.tags.join(", ")}

Instructions: Start with "Dear Hiring Manager," · highlight 8 years ALSTOM/railway experience · match specific requirements from the job description · mention Switzerland relocation · end with "Yours sincerely,\\nRami Tlili"`
    : `Tu es expert en recrutement suisse. Lettre de motivation professionnelle en français, style suisse romand, max 220 mots.

CANDIDAT — Rami Tlili, 8 ans expérience ferroviaire :
- Chef de Projet Technique Ferroviaire, AKKODIS/ALSTOM (depuis fév. 2023)
- Projets phares : MF19 (métro Paris L3,7,8,10,12,13), MI20 (futur RER B), RER D & E
- Management équipes 3–6 personnes, multi-sites (Inde, Tarbes, Charleroi, Villeurbanne)
- Outils : CATIA, PTC CREO, IBM DOORS, SAP, Teamcenter, Windchill, ANSYS, Change Requests
- Spécialité HVAC/CVC ferroviaire — développement complet système CVC MI20
- Master Sciences pour l'Ingénieur – Mécanique, Univ. Franche-Comté (2016)
- Prétentions : ≥ 100 000 CHF/an — Permis B (ressortissant français UE)

OFFRE : ${job.title} chez ${job.company}, ${job.location} · ${job.salary}
Description : ${job.desc}
Compétences : ${job.tags.join(", ")}

Instructions : "Madame, Monsieur," · valorise les 8 ans ALSTOM · mentionne déménagement Suisse · style suisse direct · termine par formule de politesse + "Rami Tlili"`;

  const res = await fetch(`${API}/generate-letter`, {
    method:"POST", headers:{"Content-Type":"application/json","X-JobAgent-Token":token},
    body:JSON.stringify({prompt})
  });
  const d = await res.json();
  if (d.ok) return d.letter;
  throw new Error(d.error);
};

// ── Statut pill ──────────────────────────────────────────────────────────────
const StatusPill = ({statusId, isEN, small}) => {
  const s = STATUSES.find(x=>x.id===statusId) || STATUSES[0];
  return <span style={{background:s.bg,color:s.color,border:`1px solid ${s.color}33`,borderRadius:"20px",padding:small?"2px 8px":"4px 11px",fontSize:small?"10px":"12px",fontWeight:600,whiteSpace:"nowrap",display:"inline-flex",alignItems:"center",gap:"4px"}}>
    {s.icon} {isEN?s.label:s.labelFR}
  </span>;
};

// ── Status picker modal ──────────────────────────────────────────────────────
const StatusPicker = ({current, isEN, onSelect, onClose}) => (
  <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:300,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
    <div style={{background:"#fff",borderRadius:"20px 20px 0 0",width:"100%",maxWidth:"480px",padding:"20px 16px 36px"}} onClick={e=>e.stopPropagation()}>
      <div style={{width:"40px",height:"4px",background:"#e2e8f0",borderRadius:"2px",margin:"0 auto 16px"}}/>
      <div style={{fontSize:"14px",fontWeight:700,color:"#0f172a",marginBottom:"14px",textAlign:"center"}}>
        {isEN?"Update application status":"Mettre à jour le statut"}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
        {STATUSES.map(s=>(
          <button key={s.id} onClick={()=>onSelect(s.id)}
            style={{padding:"13px 16px",borderRadius:"12px",border:`2px solid ${current===s.id?s.color:"#e2e8f0"}`,background:current===s.id?s.bg:"#fff",display:"flex",alignItems:"center",gap:"12px",cursor:"pointer",transition:"all .15s"}}>
            <span style={{fontSize:"20px"}}>{s.icon}</span>
            <span style={{fontSize:"14px",fontWeight:current===s.id?700:500,color:current===s.id?s.color:"#334155"}}>
              {isEN?s.label:s.labelFR}
            </span>
            {current===s.id&&<span style={{marginLeft:"auto",color:s.color,fontWeight:700}}>✓</span>}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ── Job Detail ───────────────────────────────────────────────────────────────
const JobDetail = ({job, onBack, tracking, onUpdateStatus, onApply}) => {
  const [ltr, setLtr] = useState("");
  const [ldg, setLdg] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("info");
  const [showPicker, setShowPicker] = useState(false);
  const isEN = job.lang === "en";
  const applied = tracking?.status && tracking.status !== "none";

  const adapt = async () => {
    setLdg(true); setErr(""); setLtr(""); setTab("lettre");
    try { setLtr(await genLettre(job)); }
    catch(e) { setErr(e.message); }
    setLdg(false);
  };

  return <div style={{flex:1,display:"flex",flexDirection:"column",overflowY:"auto"}}>
    {showPicker&&<StatusPicker current={tracking?.status||"none"} isEN={isEN} onSelect={s=>{onUpdateStatus(job.id,s);setShowPicker(false);}} onClose={()=>setShowPicker(false)}/>}

    {/* Header */}
    <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"12px 16px",display:"flex",alignItems:"center",gap:"12px",position:"sticky",top:0,zIndex:10}}>
      <button onClick={onBack} style={{background:"none",border:"none",fontSize:"22px",color:"#2563eb",cursor:"pointer"}}>‹</button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.title}</div>
        <div style={{fontSize:"11px",color:"#64748b",display:"flex",alignItems:"center",gap:"6px"}}>
          {job.company}
          {job.lang==="en"&&<span style={{background:"#1e3a5f",color:"#fff",borderRadius:"4px",padding:"0 5px",fontSize:"10px",fontWeight:700}}>🇬🇧 EN</span>}
        </div>
      </div>
      {/* Statut rapide */}
      <button onClick={()=>setShowPicker(true)} style={{background:"none",border:"none",cursor:"pointer",flexShrink:0}}>
        <StatusPill statusId={tracking?.status||"none"} isEN={isEN} small/>
      </button>
    </div>

    {/* Onglets */}
    <div style={{background:"#fff",display:"flex",borderBottom:"1px solid #e2e8f0"}}>
      {[["📋 "+(isEN?"Job":"Annonce"),"info"],["✍ "+(isEN?"Letter":"Lettre"),"lettre"]].map(([l,id])=>(
        <button key={id} onClick={()=>setTab(id)}
          style={{flex:1,padding:"11px 8px",background:"none",border:"none",fontSize:"13px",fontWeight:tab===id?700:400,color:tab===id?"#2563eb":"#94a3b8",borderBottom:`2px solid ${tab===id?"#2563eb":"transparent"}`,cursor:"pointer"}}>
          {l}
        </button>
      ))}
    </div>

    <div style={{flex:1,padding:"16px",background:"#f1f5f9"}}>
      {tab==="info"&&<>
        {/* Statut candidature */}
        <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"14px",marginBottom:"12px",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"10px"}}>
          <div>
            <div style={{fontSize:"11px",color:"#94a3b8",marginBottom:"5px"}}>{isEN?"APPLICATION STATUS":"STATUT CANDIDATURE"}</div>
            <StatusPill statusId={tracking?.status||"none"} isEN={isEN}/>
          </div>
          <button onClick={()=>setShowPicker(true)}
            style={{background:"#eff6ff",border:"1px solid #bfdbfe",color:"#2563eb",padding:"8px 14px",borderRadius:"9px",fontSize:"12px",fontWeight:600,cursor:"pointer",flexShrink:0}}>
            ✏️ {isEN?"Update":"Modifier"}
          </button>
        </div>

        <div style={{background:"#fff",borderRadius:"14px",padding:"16px",marginBottom:"12px",display:"flex",gap:"14px",alignItems:"center",border:"1px solid #e2e8f0"}}>
          <Ring s={job.score} sz={56}/>
          <div>
            <div style={{fontSize:"17px",fontWeight:700,color:"#0f172a",marginBottom:"4px"}}>{job.company}</div>
            <div style={{fontSize:"13px",color:"#64748b"}}>📍 {job.location}</div>
            <div style={{marginTop:"6px",display:"flex",gap:"6px",flexWrap:"wrap"}}>
              <span style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"5px",padding:"2px 9px",fontSize:"12px",color:"#16a34a",fontFamily:"monospace"}}>💰 {job.salary}</span>
              {job.lang==="en"&&<span style={{background:"#1e3a5f",color:"#fff",borderRadius:"5px",padding:"2px 9px",fontSize:"11px",fontWeight:700}}>🇬🇧 EN</span>}
              {job.easyApply&&<span style={{background:"#e8f0fe",borderRadius:"5px",padding:"2px 9px",fontSize:"12px",color:LI,fontWeight:600,display:"flex",alignItems:"center",gap:"4px"}}><LiIcon sz={10}/>Easy Apply ⚡</span>}
            </div>
          </div>
        </div>

        <div style={{background:"#fff",borderRadius:"14px",padding:"16px",marginBottom:"12px",border:"1px solid #e2e8f0"}}>
          <p style={{fontSize:"14px",color:"#334155",lineHeight:1.8,margin:0}}>{job.desc}</p>
        </div>
        <div style={{display:"flex",gap:"7px",flexWrap:"wrap",marginBottom:"12px"}}>
          {job.tags.map(t=><span key={t} style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"6px",padding:"5px 11px",fontSize:"12px",color:"#2563eb"}}>{t}</span>)}
        </div>
        <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"10px",padding:"12px",marginBottom:"14px"}}>
          <span style={{fontSize:"13px",color:"#16a34a"}}>{job.note}</span>
        </div>
        <button onClick={()=>window.open(job.url,"_blank")}
          style={{width:"100%",background:job.linkedin?LI:"#475569",color:"#fff",border:"none",padding:"13px",borderRadius:"12px",fontSize:"14px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"10px"}}>
          {job.linkedin?<LiIcon sz={16} color="#fff"/>:"🔗"} {isEN?"View job posting ↗":"Voir l'annonce ↗"}
        </button>
        <button onClick={adapt}
          style={{width:"100%",background:"#2563eb",color:"#fff",border:"none",padding:"13px",borderRadius:"12px",fontSize:"14px",fontWeight:700,cursor:"pointer"}}>
          ✍ {isEN?"Generate cover letter (EN)":"Générer la lettre (FR)"}
        </button>
      </>}

      {tab==="lettre"&&<>
        {!ltr&&!ldg&&!err&&(
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"32px",textAlign:"center",marginBottom:"12px"}}>
            <div style={{fontSize:"36px",marginBottom:"10px"}}>✍️</div>
            <div style={{fontSize:"15px",color:"#1e40af",fontWeight:600,marginBottom:"6px"}}>{isEN?"Generate cover letter":"Générer la lettre"}</div>
            <div style={{fontSize:"13px",color:"#64748b",marginBottom:"16px"}}>{isEN?"Claude will write a tailored cover letter in English":"Claude va rédiger une lettre personnalisée en français"}</div>
            <button onClick={adapt} style={{background:"#2563eb",color:"#fff",border:"none",padding:"12px 24px",borderRadius:"10px",fontSize:"14px",fontWeight:700,cursor:"pointer"}}>
              ✨ {isEN?"Generate":"Générer"}
            </button>
          </div>
        )}
        {ldg&&(
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"40px",textAlign:"center",marginBottom:"12px"}}>
            <div style={{width:"36px",height:"36px",border:"3px solid #e2e8f0",borderTop:"3px solid #2563eb",borderRadius:"50%",animation:"sp .8s linear infinite",margin:"0 auto 14px"}}/>
            <div style={{fontSize:"14px",color:"#64748b"}}>{isEN?"Claude is writing your letter...":"Claude rédige votre lettre..."}</div>
          </div>
        )}
        {err&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"12px",padding:"14px",marginBottom:"12px",fontSize:"13px",color:"#dc2626"}}>{err}</div>}
        {ltr&&(
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"16px",marginBottom:"12px"}}>
            <div style={{fontSize:"11px",color:"#94a3b8",letterSpacing:".1em",marginBottom:"12px",fontFamily:"monospace"}}>
              {isEN?"COVER LETTER (EN) — CLAUDE AI":"LETTRE (FR) — CLAUDE IA"}
            </div>
            <p style={{fontSize:"13.5px",color:"#334155",lineHeight:1.85,margin:0,whiteSpace:"pre-wrap"}}>{ltr}</p>
          </div>
        )}
        {ltr&&!ldg&&(
          <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
            <button onClick={()=>{onUpdateStatus(job.id,"sent");onApply(job.id);}}
              style={{width:"100%",background:job.linkedin?LI:"#16a34a",color:"#fff",border:"none",padding:"14px",borderRadius:"12px",fontSize:"14px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
              {job.linkedin&&<LiIcon sz={14} color="#fff"/>}
              {isEN?"✅ Mark as Sent":"✅ Marquer comme Envoyée"}
            </button>
            <button onClick={adapt}
              style={{width:"100%",background:"#f8fafc",border:"1px solid #e2e8f0",color:"#64748b",padding:"12px",borderRadius:"12px",fontSize:"13px",cursor:"pointer"}}>
              🔄 {isEN?"Regenerate":"Régénérer"}
            </button>
          </div>
        )}
      </>}
    </div>
  </div>;
};

// ── Tracker — Toutes mes candidatures ───────────────────────────────────────
const Tracker = ({tracking, jobs, onUpdateStatus, onAddManual, onDeleteManual, isEN}) => {
  const [showAdd, setShowAdd] = useState(false);
  const [showPicker, setShowPicker] = useState(null); // jobId
  const [form, setForm] = useState({title:"",company:"",location:"",salary:"",source:"",url:"",notes:""});

  // Fusionner offres intégrées avec tracking + candidatures manuelles
  const integrated = Object.entries(tracking)
    .filter(([id]) => !String(id).startsWith("manual_"))
    .map(([id, t]) => {
      const job = jobs.find(j=>j.id===Number(id));
      if (!job) return null;
      return {...job, tracking:t};
    }).filter(Boolean);

  const manual = Object.entries(tracking)
    .filter(([id]) => String(id).startsWith("manual_"))
    .map(([id, t]) => ({id, ...t}));

  const all = [...integrated, ...manual].sort((a,b) => {
    const order = {offer:0,interview:1,waiting:2,sent:3,rejected:4,none:5};
    return (order[a.tracking?.status||"none"]||5) - (order[b.tracking?.status||"none"]||5);
  });

  const counts = STATUSES.reduce((acc,s)=>{
    acc[s.id] = all.filter(a=>(a.tracking?.status||"none")===s.id).length;
    return acc;
  },{});

  const saveManual = () => {
    if (!form.title||!form.company) return;
    onAddManual({...form, status:"sent", date:new Date().toLocaleDateString("fr-FR")});
    setForm({title:"",company:"",location:"",salary:"",source:"",url:"",notes:""});
    setShowAdd(false);
  };

  return <div style={{padding:"16px 16px 100px"}}>
    {showPicker&&<StatusPicker current={tracking[showPicker]?.status||"none"} isEN={isEN} onSelect={s=>{onUpdateStatus(showPicker,s);setShowPicker(null);}} onClose={()=>setShowPicker(null)}/>}

    <div style={{fontSize:"18px",fontWeight:800,color:"#0f172a",marginBottom:"16px"}}>
      📊 {isEN?"My Applications":"Mes Candidatures"}
    </div>

    {/* Stats */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"7px",marginBottom:"16px"}}>
      {[
        {s:STATUSES.find(s=>s.id==="sent"),    v:counts.sent||0},
        {s:STATUSES.find(s=>s.id==="waiting"), v:counts.waiting||0},
        {s:STATUSES.find(s=>s.id==="interview"),v:counts.interview||0},
        {s:STATUSES.find(s=>s.id==="offer"),   v:counts.offer||0},
        {s:STATUSES.find(s=>s.id==="rejected"),v:counts.rejected||0},
        {s:{icon:"📋",color:"#2563eb",bg:"#eff6ff"},v:all.length,label:isEN?"Total":"Total"},
      ].map((item,i)=><div key={i} style={{background:item.s.bg,border:`1px solid ${item.s.color}33`,borderRadius:"11px",padding:"10px 8px",textAlign:"center"}}>
        <div style={{fontSize:"20px"}}>{item.s.icon}</div>
        <div style={{fontSize:"22px",fontWeight:800,color:item.s.color,lineHeight:1.1}}>{item.v}</div>
        <div style={{fontSize:"10px",color:"#94a3b8",marginTop:"2px"}}>{item.label||isEN?item.s?.label:item.s?.labelFR}</div>
      </div>)}
    </div>

    {/* Bouton ajouter */}
    <button onClick={()=>setShowAdd(!showAdd)}
      style={{width:"100%",background:showAdd?"#f1f5f9":"#2563eb",color:showAdd?"#64748b":"#fff",border:showAdd?"1px solid #e2e8f0":"none",padding:"13px",borderRadius:"12px",fontSize:"14px",fontWeight:700,cursor:"pointer",marginBottom:"12px",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
      {showAdd?"✕ Annuler":"➕ "+(isEN?"Add manual application":"Ajouter une candidature manuelle")}
    </button>

    {/* Formulaire ajout manuel */}
    {showAdd&&(
      <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"16px",marginBottom:"14px"}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"12px"}}>
          📝 {isEN?"New application":"Nouvelle candidature"}
        </div>
        {[
          ["title",    isEN?"Job title *":"Intitulé du poste *", true],
          ["company",  isEN?"Company *":"Entreprise *",          true],
          ["location", isEN?"Location":"Lieu",                    false],
          ["salary",   isEN?"Salary":"Salaire",                   false],
          ["source",   isEN?"Source (LinkedIn, email…)":"Source (LinkedIn, email…)", false],
          ["url",      isEN?"Job URL":"Lien de l'offre",          false],
          ["notes",    isEN?"Notes":"Notes",                       false],
        ].map(([k,lb,req])=>(
          <div key={k} style={{marginBottom:"10px"}}>
            <div style={{fontSize:"11px",color:"#94a3b8",marginBottom:"4px"}}>{lb}</div>
            <input value={form[k]} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}
              style={{width:"100%",padding:"10px 12px",borderRadius:"9px",border:`1.5px solid ${req&&!form[k]?"#fecaca":"#e2e8f0"}`,fontSize:"14px",color:"#0f172a",boxSizing:"border-box",outline:"none",background:"#f8fafc"}}/>
          </div>
        ))}
        <button onClick={saveManual} disabled={!form.title||!form.company}
          style={{width:"100%",background:!form.title||!form.company?"#e2e8f0":"#16a34a",color:!form.title||!form.company?"#94a3b8":"#fff",border:"none",padding:"13px",borderRadius:"10px",fontSize:"14px",fontWeight:700,cursor:!form.title||!form.company?"default":"pointer"}}>
          ✅ {isEN?"Save application":"Enregistrer"}
        </button>
      </div>
    )}

    {/* Liste candidatures */}
    {all.length===0
      ? <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"40px",textAlign:"center",color:"#94a3b8",fontSize:"14px"}}>
          {isEN?"No applications yet.\nApply to a job or add a manual one above.":"Aucune candidature pour l'instant.\nPostulez à une offre ou ajoutez-en une manuellement."}
        </div>
      : <div style={{display:"flex",flexDirection:"column",gap:"9px"}}>
          {all.map(item=>{
            const isManual = String(item.id).startsWith("manual_");
            const st = tracking[item.id]?.status || item.tracking?.status || "none";
            return (
              <div key={item.id} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"13px",padding:"13px 14px"}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:"10px"}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {item.title}
                    </div>
                    <div style={{fontSize:"12px",color:"#64748b",marginBottom:"6px",display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
                      🏢 {item.company}
                      {item.location&&<span>· 📍 {item.location}</span>}
                      {item.lang==="en"&&<span style={{background:"#1e3a5f",color:"#fff",borderRadius:"4px",padding:"0 5px",fontSize:"10px",fontWeight:700}}>🇬🇧</span>}
                      {isManual&&<span style={{background:"#f1f5f9",border:"1px solid #e2e8f0",borderRadius:"4px",padding:"0 6px",fontSize:"10px",color:"#64748b"}}>Manuel</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:"7px",flexWrap:"wrap"}}>
                      <StatusPill statusId={st} isEN={isEN} small/>
                      {tracking[item.id]?.date&&<span style={{fontSize:"10px",color:"#94a3b8"}}>{tracking[item.id].date}</span>}
                      {item.notes&&<span style={{fontSize:"10px",color:"#64748b",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"120px"}}>{item.notes}</span>}
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:"6px",flexShrink:0}}>
                    <button onClick={()=>setShowPicker(item.id)}
                      style={{background:"#eff6ff",border:"1px solid #bfdbfe",color:"#2563eb",padding:"6px 10px",borderRadius:"8px",fontSize:"11px",fontWeight:600,cursor:"pointer"}}>
                      ✏️
                    </button>
                    {isManual&&(
                      <button onClick={()=>onDeleteManual(item.id)}
                        style={{background:"#fef2f2",border:"1px solid #fecaca",color:"#dc2626",padding:"6px 10px",borderRadius:"8px",fontSize:"11px",cursor:"pointer"}}>
                        🗑
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
    }
  </div>;
};

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dash");
  const [jobs] = useState(ALL_JOBS);
  const [sel, setSel] = useState(null);
  const [isEN, setIsEN] = useState(false);
  const [filt, setFilt] = useState("all"); // all | fr | en | li | romandie
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [srvOk, setSrvOk] = useState(null);

  // tracking : { jobId: { status, date, notes } }
  const [tracking, setTracking] = useState({});

  useEffect(()=>{
    fetch(`${API}/status`).then(r=>r.json()).then(d=>setSrvOk(d.ok)).catch(()=>setSrvOk(false));
  },[]);

  const updateStatus = (jobId, status) => {
    setTracking(p=>({...p,[jobId]:{...p[jobId],status,date:new Date().toLocaleDateString("fr-FR")}}));
  };

  const addManual = (data) => {
    const id = "manual_"+Date.now();
    setTracking(p=>({...p,[id]:{...data}}));
  };

  const deleteManual = (id) => {
    setTracking(p=>{const n={...p};delete n[id];return n;});
  };

  const applyJob = (jobId) => updateStatus(jobId, "sent");

  const scan = async () => {
    setScanning(true); setScanDone(false);
    await sleep(3500);
    setScanning(false); setScanDone(true);
  };

  const frJobs = jobs.filter(j=>j.lang==="fr");
  const enJobs = jobs.filter(j=>j.lang==="en");
  const liJobs = jobs.filter(j=>j.linkedin);
  const romandieJobs = jobs.filter(j=>j.region==="romandie");
  const appliedCount = Object.values(tracking).filter(t=>t.status&&t.status!=="none").length;

  const shown = jobs.filter(j=>
    filt==="romandie"?j.region==="romandie":
    filt==="fr"?j.lang==="fr":
    filt==="en"?j.lang==="en":
    filt==="li"?j.linkedin:true
  );

  const TABS = [
    {id:"dash",  ic:"⬡",  lb:isEN?"Home":"Accueil"},
    {id:"jobs",  ic:"🇨🇭", lb:isEN?"Jobs":"Offres"},
    {id:"tracker",ic:"📊", lb:isEN?"Tracker":"Suivi"},
    {id:"profil",ic:"👤", lb:isEN?"Profile":"Profil"},
  ];

  // Job detail
  if (sel) {
    const job = jobs.find(j=>j.id===sel);
    if (job) return (
      <div style={{display:"flex",flexDirection:"column",height:"100dvh",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
        <style>{`@keyframes sp{to{transform:rotate(360deg)}}*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}body{margin:0;overscroll-behavior:none}`}</style>
        <JobDetail job={job} onBack={()=>setSel(null)} tracking={tracking[job.id]} isEN={isEN}
          onUpdateStatus={updateStatus} onApply={applyJob}/>
      </div>
    );
  }

  return (
    <div style={{display:"flex",flexDirection:"column",height:"100dvh",background:"#f1f5f9",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        body{margin:0;overscroll-behavior:none}
        @keyframes sp{to{transform:rotate(360deg)}}
        @keyframes pu{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes fd{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fd{animation:fd .28s ease forwards}
        .card{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:14px 16px;box-shadow:0 1px 4px rgba(0,0,0,.04);transition:transform .15s}
        .card:active{transform:scale(.985)}
      `}</style>

      <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>

        {/* ── ACCUEIL ── */}
        {tab==="dash"&&<div className="fd" style={{padding:"20px 16px 100px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"20px"}}>
            <div style={{width:"36px",height:"36px",background:"linear-gradient(135deg,#2563eb,#0ea5e9)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>⚙</div>
            <div>
              <div style={{fontSize:"18px",fontWeight:800,color:"#0f172a"}}>JOBAGENT 🇨🇭</div>
              <div style={{fontSize:"11px",color:"#64748b"}}>{isEN?"Hello Rami 👋":"Bonjour Rami 👋"}</div>
            </div>
            <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"8px"}}>
              <button onClick={()=>setIsEN(e=>!e)}
                style={{background:isEN?"#1e3a5f":"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"20px",padding:"5px 12px",fontSize:"12px",fontWeight:700,color:isEN?"#fff":"#2563eb",cursor:"pointer"}}>
                {isEN?"🇬🇧 EN → FR":"🇫🇷 FR → EN"}
              </button>
              <div style={{width:"34px",height:"34px",borderRadius:"50%",background:"linear-gradient(135deg,#2563eb,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color:"#fff"}}>RT</div>
            </div>
          </div>

          {/* Stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"16px"}}>
            {[
              {lb:isEN?"Romandie":"Romandie",  v:romandieJobs.length, c:"#16a34a", bg:"#f0fdf4", sub:"VD · GE · FR · NE · VS 🏔"},
              {lb:isEN?"Total jobs":"Total offres", v:jobs.length,       c:"#2563eb", bg:"#eff6ff", sub:"FR + EN 🇫🇷🇬🇧"},
              {lb:isEN?"Applications":"Suivies",v:appliedCount,  c:"#16a34a", bg:"#f0fdf4", sub:isEN?"In tracker":"Dans le suivi"},
              {lb:"LinkedIn",                   v:liJobs.length, c:"#0a66c2", bg:"#e8f0fe", sub:"Easy Apply ⚡"},
            ].map(s=><div key={s.lb} className="card" style={{background:s.bg,border:`1px solid ${s.c}22`,padding:"14px"}}>
              <div style={{fontSize:"26px",fontWeight:800,color:s.c}}>{s.v}</div>
              <div style={{fontSize:"13px",color:"#334155",fontWeight:600}}>{s.lb}</div>
              <div style={{fontSize:"11px",color:"#94a3b8",marginTop:"2px"}}>{s.sub}</div>
            </div>)}
          </div>

          {/* Tracker rapide */}
          <div className="card" style={{marginBottom:"12px",cursor:"pointer"}} onClick={()=>setTab("tracker")}>
            <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
              <span style={{fontSize:"28px"}}>📊</span>
              <div style={{flex:1}}>
                <div style={{fontSize:"14px",fontWeight:700,color:"#0f172a"}}>{isEN?"Application tracker":"Suivi des candidatures"}</div>
                <div style={{fontSize:"12px",color:"#64748b",marginTop:"2px"}}>{appliedCount} {isEN?"tracked · add manual applications":"suivies · ajoutez vos candidatures manuelles"}</div>
              </div>
              <span style={{color:"#94a3b8",fontSize:"20px"}}>›</span>
            </div>
          </div>

          {/* Statut IA */}
          <div className="card" style={{marginBottom:"12px",display:"flex",alignItems:"center",gap:"12px"}}>
            <div style={{width:"34px",height:"34px",borderRadius:"10px",background:srvOk===null?"#f1f5f9":srvOk?"#f0fdf4":"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <div style={{width:"10px",height:"10px",borderRadius:"50%",background:srvOk===null?"#94a3b8":srvOk?"#16a34a":"#ef4444",animation:srvOk===null?"pu 1s infinite":"none"}}/>
            </div>
            <div>
              <div style={{fontSize:"13px",fontWeight:600,color:"#0f172a"}}>{srvOk===null?"Connexion...":srvOk?(isEN?"AI Server connected":"Serveur IA connecté"):(isEN?"AI Server offline":"Serveur hors ligne")}</div>
              <div style={{fontSize:"11px",color:"#64748b"}}>{srvOk?(isEN?"FR + EN letters available":"Lettres FR + EN disponibles"):(isEN?"Check connection":"Vérifiez la connexion")}</div>
            </div>
          </div>

          {/* Scan */}
          <div className="card">
            <div style={{fontSize:"13px",fontWeight:600,color:"#0f172a",marginBottom:"4px"}}>🔍 {isEN?"Scan jobs":"Scan des offres"}</div>
            <div style={{fontSize:"12px",color:"#64748b",marginBottom:"10px"}}><LiIcon sz={11}/> LinkedIn FR+EN · jobup.ch · Indeed CH · sbb.ch</div>
            <button onClick={scan} disabled={scanning}
              style={{width:"100%",background:scanning?"#e2e8f0":scanDone?"#f0fdf4":"#2563eb",color:scanning?"#94a3b8":scanDone?"#16a34a":"#fff",border:scanDone?"1px solid #bbf7d0":"none",padding:"12px",borderRadius:"10px",fontSize:"13px",fontWeight:600,cursor:scanning?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
              {scanning?<><div style={{width:"16px",height:"16px",border:"2px solid #cbd5e1",borderTop:"2px solid #64748b",borderRadius:"50%",animation:"sp .8s linear infinite"}}/>{isEN?"Scanning...":"Scan en cours..."}</>:scanDone?`✅ 12 ${isEN?"jobs found":"offres trouvées"}`:`▶ ${isEN?"Scan now":"Scanner"}`}
            </button>
          </div>
        </div>}

        {/* ── OFFRES ── */}
        {tab==="jobs"&&<div className="fd" style={{padding:"16px 16px 100px"}}>
          <div style={{marginBottom:"14px"}}>
            <div style={{fontSize:"18px",fontWeight:800,color:"#0f172a",marginBottom:"10px"}}>
              {isEN?"Switzerland Jobs":"Offres Suisse"} · <span style={{color:"#2563eb"}}>{shown.length}</span>
              {filt==="romandie"&&<span style={{marginLeft:"6px",fontSize:"13px",color:"#16a34a",fontWeight:500}}>🏔 Vaud · Genève · Romandie</span>}
            </div>
            <div style={{display:"flex",gap:"7px",overflowX:"auto",paddingBottom:"4px"}}>
              {[
                ["all",       isEN?"All ":"Toutes ",     null,      jobs.length],
                ["romandie",  "🏔 Romandie",             "#16a34a", jobs.filter(j=>j.region==="romandie").length],
                ["fr",        "🇫🇷 FR",                 null,      jobs.filter(j=>j.lang==="fr").length],
                ["en",        "🇬🇧 EN",                 null,      jobs.filter(j=>j.lang==="en").length],
                ["li",        "LinkedIn",                LI,        jobs.filter(j=>j.linkedin).length],
              ].map(([f,l,c,cnt])=>(
                <button key={f} onClick={()=>setFilt(f)}
                  style={{padding:"7px 12px",borderRadius:"20px",border:`1px solid ${filt===f?c||"#2563eb":"#e2e8f0"}`,background:filt===f?f==="en"?"#dbeafe":f==="li"?"#e8f0fe":f==="romandie"?"#f0fdf4":"#eff6ff":"#fff",color:filt===f?c||"#2563eb":"#64748b",fontSize:"12px",fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:"4px"}}>
                  {l}<span style={{background:filt===f?"rgba(0,0,0,.12)":"#e2e8f0",borderRadius:"10px",padding:"0 5px",fontSize:"11px"}}>{cnt}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
            {shown.map(job=>{
              const st = tracking[job.id]?.status||"none";
              const stObj = STATUSES.find(s=>s.id===st)||STATUSES[0];
              return (
                <div key={job.id} className="card" onClick={()=>setSel(job.id)} style={{cursor:"pointer",border:`1px solid ${st!=="none"?stObj.color+"44":job.lang==="en"?"#93c5fd":job.linkedin?"#bfdbfe":"#e2e8f0"}`}}>
                  <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
                    <Ring s={job.score}/>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:"13.5px",fontWeight:700,color:"#0f172a",marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.title}</div>
                      <div style={{fontSize:"12px",color:"#64748b",marginBottom:"5px"}}>🏢 {job.company}</div>
                      <div style={{display:"flex",gap:"5px",flexWrap:"wrap",alignItems:"center"}}>
                        <span style={{background:"#f0fdf4",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",color:"#16a34a",fontFamily:"monospace"}}>💰 {job.salary}</span>
                        {job.lang==="en"&&<span style={{background:"#1e3a5f",color:"#fff",borderRadius:"4px",padding:"0px 6px",fontSize:"10px",fontWeight:700}}>🇬🇧 EN</span>}
                        {job.region==="other"&&<span style={{background:"#fef3c7",border:"1px solid #fcd34d",borderRadius:"4px",padding:"0px 6px",fontSize:"10px",color:"#92400e",fontWeight:600}}>⚠️ Hors Romandie</span>}
                        {job.region==="romandie"?
                          <span style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"4px",padding:"0px 6px",fontSize:"10px",fontWeight:700,color:"#16a34a"}}>🏔 Romandie</span>:
                          <span style={{background:"#fef9c3",border:"1px solid #fde68a",borderRadius:"4px",padding:"0px 6px",fontSize:"10px",fontWeight:600,color:"#92400e"}}>🇩🇪 Hors Romandie</span>
                        }
                        {job.easyApply&&<span style={{background:"#e8f0fe",borderRadius:"4px",padding:"2px 6px",fontSize:"10px",color:LI,display:"flex",alignItems:"center",gap:"3px",fontWeight:600}}><LiIcon sz={8}/>⚡</span>}
                        {st!=="none"&&<StatusPill statusId={st} isEN={isEN} small/>}
                      </div>
                    </div>
                    <div style={{color:"#94a3b8",fontSize:"18px",flexShrink:0,marginTop:"8px"}}>›</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>}

        {/* ── TRACKER ── */}
        {tab==="tracker"&&<div className="fd">
          <Tracker tracking={tracking} jobs={jobs} isEN={isEN}
            onUpdateStatus={updateStatus} onAddManual={addManual} onDeleteManual={deleteManual}/>
        </div>}

        {/* ── PROFIL ── */}
        {tab==="profil"&&<div className="fd" style={{padding:"16px 16px 100px"}}>
          <div style={{fontSize:"18px",fontWeight:800,color:"#0f172a",marginBottom:"16px"}}>👤 {isEN?"Profile":"Profil"}</div>
          <div className="card" style={{marginBottom:"12px"}}>
            <div style={{fontSize:"12px",color:"#94a3b8",marginBottom:"10px"}}>{isEN?"LANGUAGE":"LANGUE"}</div>
            <div style={{display:"flex",gap:"8px"}}>
              {[["fr","🇫🇷 Français"],["en","🇬🇧 English"]].map(([l,lb])=>(
                <button key={l} onClick={()=>setIsEN(l==="en")}
                  style={{flex:1,padding:"11px",borderRadius:"10px",border:`2px solid ${(isEN?l==="en":l==="fr")?"#2563eb":"#e2e8f0"}`,background:(isEN?l==="en":l==="fr")?"#eff6ff":"#fff",color:(isEN?l==="en":l==="fr")?"#2563eb":"#64748b",fontSize:"13px",fontWeight:(isEN?l==="en":l==="fr")?700:400,cursor:"pointer"}}>
                  {lb}
                </button>
              ))}
            </div>
          </div>
          <div style={{background:"linear-gradient(135deg,#2563eb,#0ea5e9)",borderRadius:"16px",padding:"20px",marginBottom:"12px",textAlign:"center"}}>
            <div style={{width:"56px",height:"56px",borderRadius:"50%",background:"rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"20px",fontWeight:800,color:"#fff",margin:"0 auto 10px"}}>RT</div>
            <div style={{fontSize:"17px",fontWeight:800,color:"#fff"}}>Rami Tlili</div>
            <div style={{fontSize:"12px",color:"rgba(255,255,255,.8)",marginTop:"3px"}}>{isEN?"Technical Project Manager · Railway":"Chef de Projet Technique · Ferroviaire"}</div>
            <div style={{fontSize:"11px",color:"rgba(255,255,255,.65)",marginTop:"2px"}}>Lille → Switzerland 🇨🇭</div>
          </div>
          {[
            ["💼",isEN?"Experience":"Expérience","8 ans — ALSTOM, WABTEC-FAIVELEY"],
            ["🚆",isEN?"Key projects":"Projets","MF19 · MI20 · RER D & E"],
            ["🔧","Tools / Outils","CATIA · CREO · IBM DOORS · SAP · Teamcenter"],
            ["🌡","HVAC/CVC","Railway HVAC specialist · MI20"],
            ["🎓",isEN?"Education":"Formation","MSc Mechanical · Univ. Franche-Comté 2016"],
            ["🌍",isEN?"Languages":"Langues","Français · English · العربية"],
            ["📄",isEN?"Swiss Permit":"Permis","B — French EU citizen"],
            ["💰",isEN?"Target":"Cible","≥ 100 000 CHF / an"],
          ].map(([ic,k,v])=><div key={k} className="card" style={{marginBottom:"8px",display:"flex",gap:"12px",alignItems:"center"}}>
            <span style={{fontSize:"20px",flexShrink:0}}>{ic}</span>
            <div><div style={{fontSize:"11px",color:"#94a3b8"}}>{k}</div><div style={{fontSize:"13px",color:"#334155",fontWeight:500}}>{v}</div></div>
          </div>)}
        </div>}
      </div>

      {/* Nav bottom */}
      <div style={{position:"sticky",bottom:0,background:"rgba(255,255,255,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid #e2e8f0",display:"flex",paddingBottom:"env(safe-area-inset-bottom)",zIndex:50}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            style={{flex:1,padding:"10px 4px 8px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"3px",position:"relative"}}>
            <span style={{fontSize:"22px",lineHeight:1}}>{t.ic}</span>
            <span style={{fontSize:"10px",fontWeight:tab===t.id?700:400,color:tab===t.id?"#2563eb":"#94a3b8"}}>{t.lb}</span>
            {tab===t.id&&<div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#2563eb"}}/>}
            {t.id==="tracker"&&appliedCount>0&&<div style={{position:"absolute",top:"6px",right:"calc(50% - 18px)",background:"#dc2626",color:"#fff",borderRadius:"10px",fontSize:"9px",fontWeight:700,padding:"1px 5px",minWidth:"16px",textAlign:"center"}}>{appliedCount}</div>}
          </button>
        ))}
      </div>
    </div>
  );
}
