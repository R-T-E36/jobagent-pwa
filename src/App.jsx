import { useState, useRef, useEffect } from "react";

// URL du serveur — à remplacer par votre URL Render après déploiement
const API = process.env.REACT_APP_API_URL || "https://jobagent-api.onrender.com";

const LI = "#0a66c2";

const JOBS = [
  { id:1, title:"Ingénieur Mécanique Senior – Ferroviaire", company:"MATISA SA", location:"Crissier, VD", salary:"105–120k CHF", score:97, tags:["Ferroviaire","CATIA","Change Request"], desc:"Conception mécanique machines ferroviaires haute technologie. CATIA, Change Requests, coordination multi-sites.", url:"https://www.matisa.ch/carrieres", source:"jobup.ch", linkedin:false, easyApply:false, note:"🏆 Match parfait — ferroviaire + CATIA + 8 ans", status:null },
  { id:2, title:"Chef de Projet Technique – Rail", company:"Stadler Rail", location:"Biel/Bienne, BE", salary:"110–130k CHF", score:93, tags:["Chef de projet","Ferroviaire","Management"], desc:"Pilotage projets matériel roulant ferroviaire. Management pluridisciplinaire, coordination internationale.", url:"https://www.linkedin.com/jobs/search/?keywords=stadler+rail+chef+projet", source:"LinkedIn", linkedin:true, easyApply:true, note:"⭐ Votre exp. ALSTOM multi-sites = atout majeur", status:null },
  { id:3, title:"Ingénieur Système CVC/HVAC", company:"Amstein+Walthert", location:"Lausanne, VD", salary:"102–118k CHF", score:88, tags:["HVAC","CVC","Ingénierie"], desc:"Systèmes HVAC complexes pour projets industriels Romandie. Cahiers des charges, suivi fournisseurs.", url:"https://www.linkedin.com/jobs/search/?keywords=ingenieur+hvac+lausanne", source:"LinkedIn", linkedin:true, easyApply:false, note:"Spécialité CVC ferroviaire MI20 très valorisée", status:null },
  { id:4, title:"Chef de Projet Infrastructures", company:"CFF", location:"Lausanne, VD", salary:"108–125k CHF", score:85, tags:["Ferroviaire","CFF","Infrastructure"], desc:"Gestion projets infrastructure ferroviaire réseau national suisse.", url:"https://www.sbb.ch/fr/a-propos-des-cff/emplois.html", source:"sbb.ch", linkedin:false, easyApply:false, note:"CFF = sécurité emploi + 2e pilier avantageux", status:null },
  { id:5, title:"Ingénieur Conception Mécanique", company:"RUAG MRO Switzerland", location:"Emmen / VD", salary:"100–115k CHF", score:81, tags:["Mécanique","CATIA","Teamcenter"], desc:"Conception mécanique avancée transport et défense. CATIA V5/V6, Teamcenter, Windchill.", url:"https://www.linkedin.com/jobs/search/?keywords=ruag+ingenieur+mecanique", source:"LinkedIn", linkedin:true, easyApply:true, note:"Vos outils (CATIA, Teamcenter) = match direct", status:null },
  { id:6, title:"Chef de Projet – Énergie & Industrie", company:"Lombardi SA", location:"Lausanne, VD", salary:"100–118k CHF", score:77, tags:["Gestion projet","Ingénierie"], desc:"Pilotage projets ingénierie industrielle complexes. Management équipe, coordination fournisseurs.", url:"https://ch.indeed.com/emplois?q=lombardi+chef+de+projet", source:"Indeed CH", linkedin:false, easyApply:false, note:"Bon match management, secteur élargi", status:null },
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

// Génération de lettre via serveur
const genLettre = async (job) => {
  const prompt = `Tu es expert en recrutement suisse. Lettre de motivation professionnelle en français, style suisse romand, max 220 mots.

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

Instructions : "Madame, Monsieur," · valorise les 8 ans ALSTOM · mentionne déménagement Suisse Romande · style suisse direct · termine par formule de politesse + "Rami Tlili"`;

  const token = process.env.REACT_APP_SECRET || "";
  const res = await fetch(`${API}/generate-letter`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-JobAgent-Token": token
    },
    body: JSON.stringify({ prompt })
  });
  const d = await res.json();
  if (d.ok) return d.letter;
  throw new Error(d.error);
};

// ── Écran Offre détaillée ────────────────────────────────────────────────────
const JobDetail = ({ job, onBack, applied, onApply }) => {
  const [ltr, setLtr] = useState("");
  const [ldg, setLdg] = useState(false);
  const [err, setErr] = useState("");
  const [tab, setTab] = useState("info");

  const adapt = async () => {
    setLdg(true); setErr(""); setLtr(""); setTab("lettre");
    try { setLtr(await genLettre(job)); }
    catch(e) { setErr("Erreur : " + e.message); }
    setLdg(false);
  };

  return <div style={{flex:1,display:"flex",flexDirection:"column",background:"#f1f5f9",overflowY:"auto"}}>
    {/* Header */}
    <div style={{background:"#fff",borderBottom:"1px solid #e2e8f0",padding:"12px 16px",display:"flex",alignItems:"center",gap:"12px",position:"sticky",top:0,zIndex:10}}>
      <button onClick={onBack} style={{background:"none",border:"none",fontSize:"22px",color:"#2563eb",cursor:"pointer",padding:"4px"}}>‹</button>
      <div style={{flex:1,minWidth:0}}>
        <div style={{fontSize:"13px",fontWeight:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.title}</div>
        <div style={{fontSize:"11px",color:"#64748b"}}>{job.company}</div>
      </div>
      {applied && <span style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"6px",padding:"3px 8px",fontSize:"11px",color:"#16a34a",fontWeight:600,flexShrink:0}}>✓ Postulé</span>}
    </div>

    {/* Onglets */}
    <div style={{background:"#fff",display:"flex",borderBottom:"1px solid #e2e8f0"}}>
      {[["info","📋 Annonce"],["lettre","✍ Lettre"]].map(([t,l])=>(
        <button key={t} onClick={()=>setTab(t)}
          style={{flex:1,padding:"11px 8px",background:"none",border:"none",fontSize:"13px",fontWeight:tab===t?700:400,color:tab===t?"#2563eb":"#94a3b8",borderBottom:`2px solid ${tab===t?"#2563eb":"transparent"}`,cursor:"pointer"}}>
          {l}
        </button>
      ))}
    </div>

    {/* Contenu */}
    <div style={{flex:1,padding:"16px"}}>
      {tab==="info" && <>
        {/* Score + info */}
        <div style={{background:"#fff",borderRadius:"14px",padding:"16px",marginBottom:"12px",display:"flex",gap:"14px",alignItems:"center",border:"1px solid #e2e8f0",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
          <Ring s={job.score} sz={56}/>
          <div>
            <div style={{fontSize:"18px",fontWeight:700,color:"#0f172a",marginBottom:"4px"}}>{job.company}</div>
            <div style={{fontSize:"13px",color:"#64748b"}}>📍 {job.location}</div>
            <div style={{marginTop:"6px",display:"flex",gap:"6px",flexWrap:"wrap"}}>
              <span style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"5px",padding:"2px 9px",fontSize:"12px",color:"#16a34a",fontFamily:"monospace"}}>💰 {job.salary}</span>
              {job.easyApply && <span style={{background:"#e8f0fe",border:"1px solid #bfdbfe",borderRadius:"5px",padding:"2px 9px",fontSize:"12px",color:LI,fontWeight:600,display:"flex",alignItems:"center",gap:"4px"}}><LiIcon sz={10}/>Easy Apply ⚡</span>}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{background:"#fff",borderRadius:"14px",padding:"16px",marginBottom:"12px",border:"1px solid #e2e8f0"}}>
          <div style={{fontSize:"11px",color:"#94a3b8",letterSpacing:".1em",marginBottom:"10px",fontFamily:"monospace"}}>DESCRIPTION</div>
          <p style={{fontSize:"14px",color:"#334155",lineHeight:1.8,margin:0}}>{job.desc}</p>
        </div>

        {/* Tags */}
        <div style={{display:"flex",gap:"7px",flexWrap:"wrap",marginBottom:"12px"}}>
          {job.tags.map(t=><span key={t} style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"6px",padding:"5px 11px",fontSize:"12px",color:"#2563eb"}}>{t}</span>)}
        </div>

        {/* Note */}
        <div style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"10px",padding:"12px",marginBottom:"16px"}}>
          <span style={{fontSize:"13px",color:"#16a34a"}}>{job.note}</span>
        </div>

        {/* Bouton annonce */}
        <button onClick={()=>window.open(job.url,"_blank")}
          style={{width:"100%",background:job.linkedin?LI:"#475569",color:"#fff",border:"none",padding:"14px",borderRadius:"12px",fontSize:"14px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"10px"}}>
          {job.linkedin?<LiIcon sz={16} color="#fff"/>:"🔗"} Voir l'annonce ↗
        </button>
      </>}

      {tab==="lettre" && <>
        {!ltr && !ldg && !err && (
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:"14px",padding:"24px",textAlign:"center",marginBottom:"12px"}}>
            <div style={{fontSize:"36px",marginBottom:"10px"}}>✍️</div>
            <div style={{fontSize:"15px",color:"#1e40af",fontWeight:600,marginBottom:"6px"}}>Générer la lettre</div>
            <div style={{fontSize:"13px",color:"#64748b"}}>Claude IA va rédiger une lettre personnalisée pour {job.company}</div>
          </div>
        )}

        {ldg && (
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"40px",textAlign:"center",marginBottom:"12px"}}>
            <div style={{width:"36px",height:"36px",border:"3px solid #e2e8f0",borderTop:"3px solid #2563eb",borderRadius:"50%",animation:"sp .8s linear infinite",margin:"0 auto 14px"}}/>
            <div style={{fontSize:"14px",color:"#64748b"}}>Claude rédige votre lettre...</div>
          </div>
        )}

        {err && <div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:"12px",padding:"14px",marginBottom:"12px",fontSize:"13px",color:"#dc2626"}}>{err}</div>}

        {ltr && (
          <div style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:"14px",padding:"16px",marginBottom:"12px",boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
            <div style={{fontSize:"11px",color:"#94a3b8",letterSpacing:".1em",marginBottom:"12px",fontFamily:"monospace"}}>LETTRE GÉNÉRÉE PAR CLAUDE IA</div>
            <p style={{fontSize:"13.5px",color:"#334155",lineHeight:1.85,margin:0,whiteSpace:"pre-wrap"}}>{ltr}</p>
          </div>
        )}

        {/* Bouton générer / postuler */}
        {!ldg && (
          <button onClick={ltr ? (applied ? undefined : onApply) : adapt}
            disabled={applied}
            style={{width:"100%",background:applied?"#16a34a":ltr?job.linkedin?LI:"#16a34a":"#2563eb",color:"#fff",border:"none",padding:"15px",borderRadius:"12px",fontSize:"15px",fontWeight:700,cursor:applied?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px",marginBottom:"10px",opacity:applied?.85:1}}>
            {applied ? "✅ Candidature enregistrée" : ltr ? (job.linkedin ? <><LiIcon sz={16} color="#fff"/>Postuler sur LinkedIn ↗</> : "✅ Confirmer & Postuler") : "✨ Générer la lettre"}
          </button>
        )}

        {ltr && !applied && (
          <button onClick={adapt}
            style={{width:"100%",background:"#f8fafc",border:"1px solid #e2e8f0",color:"#64748b",padding:"12px",borderRadius:"12px",fontSize:"13px",cursor:"pointer"}}>
            🔄 Régénérer la lettre
          </button>
        )}
      </>}
    </div>
  </div>;
};

// ── App principal ────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("dash");
  const [jobs, setJobs] = useState(JOBS);
  const [sel, setSel] = useState(null);
  const [applied, setApplied] = useState(0);
  const [srvOk, setSrvOk] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanDone, setScanDone] = useState(false);
  const [filt, setFilt] = useState("all");

  useEffect(() => {
    fetch(`${API}/status`).then(r=>r.json()).then(d=>setSrvOk(d.ok)).catch(()=>setSrvOk(false));
  }, []);

  const scan = async () => {
    setScanning(true); setScanDone(false);
    await sleep(3500);
    setScanning(false); setScanDone(true);
  };

  const applyJob = (jobId) => {
    setJobs(p => p.map(j => j.id === jobId ? { ...j, status: "applied" } : j));
    setApplied(a => a + 1);
    setSel(null);
  };

  const liCount = jobs.filter(j => j.linkedin).length;
  const eaCount = jobs.filter(j => j.easyApply).length;
  const shown = jobs.filter(j =>
    filt === "li" ? j.linkedin :
    filt === "applied" ? j.status === "applied" : true
  );

  const TABS = [
    { id:"dash", ic:"⬡", lb:"Accueil" },
    { id:"jobs", ic:"🇨🇭", lb:"Offres" },
    { id:"linkedin", ic:"💼", lb:"LinkedIn" },
    { id:"profil", ic:"👤", lb:"Profil" },
  ];

  // Si une offre est sélectionnée, afficher son détail
  if (sel) {
    const job = jobs.find(j => j.id === sel);
    if (job) return <div style={{display:"flex",flexDirection:"column",height:"100dvh",background:"#f1f5f9"}}>
      <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
      <JobDetail job={job} onBack={()=>setSel(null)} applied={!!job.status} onApply={()=>{ if(job.linkedin){window.open(job.url,"_blank");} applyJob(job.id); }}/>
    </div>;
  }

  return <div style={{display:"flex",flexDirection:"column",height:"100dvh",background:"#f1f5f9",fontFamily:"'DM Sans',-apple-system,sans-serif"}}>
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

    {/* Barre de statut IA */}
    {srvOk === false && <div style={{background:"#fef2f2",borderBottom:"1px solid #fecaca",padding:"8px 16px",fontSize:"12px",color:"#dc2626",textAlign:"center"}}>
      ⚠️ Serveur IA hors ligne — Les lettres ne peuvent pas être générées
    </div>}

    {/* Contenu principal */}
    <div style={{flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>

      {/* ── ACCUEIL ── */}
      {tab==="dash"&&<div className="fd" style={{padding:"20px 16px 100px"}}>
        <div style={{marginBottom:"20px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"6px"}}>
            <div style={{width:"36px",height:"36px",background:"linear-gradient(135deg,#2563eb,#0ea5e9)",borderRadius:"10px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"18px"}}>⚙</div>
            <div>
              <div style={{fontFamily:"system-ui",fontSize:"18px",fontWeight:800,color:"#0f172a",letterSpacing:".03em"}}>JOBAGENT 🇨🇭</div>
              <div style={{fontSize:"11px",color:"#64748b"}}>Bonjour Rami 👋</div>
            </div>
            <div style={{marginLeft:"auto",width:"38px",height:"38px",borderRadius:"50%",background:"linear-gradient(135deg,#2563eb,#0ea5e9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color:"#fff"}}>RT</div>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px",marginBottom:"18px"}}>
          {[
            {lb:"Offres",v:6,c:"#2563eb",bg:"#eff6ff",sub:"Suisse Romande"},
            {lb:"LinkedIn",v:liCount,c:LI,bg:"#e8f0fe",sub:`${eaCount} Easy Apply ⚡`},
            {lb:"Postulées",v:applied,c:"#16a34a",bg:"#f0fdf4",sub:"Candidatures"},
            {lb:"Cible",v:"100k+",c:"#d97706",bg:"#fffbeb",sub:"CHF / an"},
          ].map(s=><div key={s.lb} className="card" style={{background:s.bg,border:`1px solid ${s.c}22`,padding:"14px"}}>
            <div style={{fontFamily:"system-ui",fontSize:"26px",fontWeight:800,color:s.c}}>{s.v}</div>
            <div style={{fontSize:"13px",color:"#334155",fontWeight:600}}>{s.lb}</div>
            <div style={{fontSize:"11px",color:"#94a3b8",marginTop:"2px"}}>{s.sub}</div>
          </div>)}
        </div>

        {/* Statut IA */}
        <div className="card" style={{marginBottom:"14px",display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{width:"36px",height:"36px",borderRadius:"10px",background:srvOk===null?"#f1f5f9":srvOk?"#f0fdf4":"#fef2f2",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <div style={{width:"10px",height:"10px",borderRadius:"50%",background:srvOk===null?"#94a3b8":srvOk?"#16a34a":"#ef4444",animation:srvOk===null?"pu 1s infinite":"none"}}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:"13px",fontWeight:600,color:"#0f172a"}}>{srvOk===null?"Connexion...":srvOk?"Serveur IA connecté":"Serveur IA hors ligne"}</div>
            <div style={{fontSize:"11px",color:"#64748b"}}>{srvOk?"Génération lettres disponible":"Vérifiez votre connexion internet"}</div>
          </div>
        </div>

        {/* Scanner */}
        <div className="card" style={{marginBottom:"14px"}}>
          <div style={{fontSize:"13px",fontWeight:600,color:"#0f172a",marginBottom:"4px"}}>🔍 Scan des offres</div>
          <div style={{fontSize:"12px",color:"#64748b",marginBottom:"12px",display:"flex",alignItems:"center",gap:"5px"}}><LiIcon sz={11}/>LinkedIn · jobup.ch · Indeed CH · sbb.ch</div>
          <button onClick={scan} disabled={scanning}
            style={{width:"100%",background:scanning?"#e2e8f0":scanDone?"#f0fdf4":"#2563eb",color:scanning?"#94a3b8":scanDone?"#16a34a":"#fff",border:scanDone?"1px solid #bbf7d0":"none",padding:"12px",borderRadius:"10px",fontSize:"13px",fontWeight:600,cursor:scanning?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
            {scanning?<><div style={{width:"16px",height:"16px",border:"2px solid #cbd5e1",borderTop:"2px solid #64748b",borderRadius:"50%",animation:"sp .8s linear infinite"}}/> Scan en cours...</>:scanDone?"✅ 6 offres à jour":"▶ Scanner maintenant"}
          </button>
        </div>

        {/* Guide */}
        <div className="card">
          <div style={{fontSize:"13px",fontWeight:600,color:"#0f172a",marginBottom:"12px"}}>📋 Comment postuler</div>
          {[["1","Offres","Choisissez une offre"],["2","Adapter","Claude génère la lettre"],["3","Postuler","Confirmez l'envoi"]].map(([n,t,d])=><div key={n} style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"10px"}}>
            <div style={{width:"26px",height:"26px",background:"#2563eb",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"#fff",flexShrink:0}}>{n}</div>
            <div><div style={{fontSize:"13px",fontWeight:600,color:"#0f172a"}}>{t}</div><div style={{fontSize:"11.5px",color:"#64748b"}}>{d}</div></div>
          </div>)}
        </div>
      </div>}

      {/* ── OFFRES ── */}
      {tab==="jobs"&&<div className="fd" style={{padding:"16px 16px 100px"}}>
        <div style={{marginBottom:"14px"}}>
          <div style={{fontSize:"18px",fontWeight:800,color:"#0f172a",marginBottom:"10px"}}>🇨🇭 Offres Romandie</div>
          <div style={{display:"flex",gap:"7px",overflowX:"auto",paddingBottom:"4px"}}>
            {[["all","Toutes"],["li","LinkedIn"],["applied","Postulées"]].map(([f,l])=><button key={f} onClick={()=>setFilt(f)}
              style={{padding:"7px 14px",borderRadius:"20px",border:`1px solid ${filt===f?f==="li"?LI:"#2563eb":"#e2e8f0"}`,background:filt===f?f==="li"?"#e8f0fe":"#eff6ff":"#fff",color:filt===f?f==="li"?LI:"#2563eb":"#64748b",fontSize:"13px",fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",display:"flex",alignItems:"center",gap:"5px"}}>
              {f==="li"&&<LiIcon sz={11} color={filt===f?LI:"#64748b"}/>}{l}
            </button>)}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
          {shown.map(job=><div key={job.id} className="card" onClick={()=>setSel(job.id)} style={{cursor:"pointer",border:`1px solid ${job.status?"#bbf7d0":job.linkedin?"#bfdbfe":"#e2e8f0"}`}}>
            <div style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
              <Ring s={job.score}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"13.5px",fontWeight:700,color:"#0f172a",marginBottom:"2px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.title}</div>
                <div style={{fontSize:"12px",color:"#64748b",marginBottom:"5px"}}>🏢 {job.company}</div>
                <div style={{display:"flex",gap:"6px",flexWrap:"wrap",alignItems:"center"}}>
                  <span style={{background:"#f0fdf4",border:"1px solid #bbf7d0",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",color:"#16a34a",fontFamily:"monospace"}}>💰 {job.salary}</span>
                  {job.linkedin&&<span style={{background:"#e8f0fe",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",color:LI,display:"flex",alignItems:"center",gap:"3px",fontWeight:600}}><LiIcon sz={9}/>LI{job.easyApply?" ⚡":""}</span>}
                  {job.status&&<span style={{background:"#f0fdf4",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",color:"#16a34a",fontWeight:600}}>✓ Postulé</span>}
                </div>
              </div>
              <div style={{color:"#94a3b8",fontSize:"18px",flexShrink:0,marginTop:"8px"}}>›</div>
            </div>
          </div>)}
        </div>
      </div>}

      {/* ── LINKEDIN ── */}
      {tab==="linkedin"&&<div className="fd" style={{padding:"16px 16px 100px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px",marginBottom:"20px"}}>
          <div style={{width:"44px",height:"44px",background:LI,borderRadius:"12px",display:"flex",alignItems:"center",justifyContent:"center"}}><LiIcon sz={24} color="#fff"/></div>
          <div>
            <div style={{fontSize:"18px",fontWeight:800,color:"#0f172a"}}>Stratégie LinkedIn</div>
            <div style={{fontSize:"12px",color:"#64748b"}}>{liCount} offres · {eaCount} Easy Apply ⚡</div>
          </div>
        </div>

        {/* Offres LinkedIn */}
        <div style={{marginBottom:"16px"}}>
          <div style={{fontSize:"11px",color:"#94a3b8",letterSpacing:".12em",marginBottom:"10px",fontFamily:"monospace"}}>OFFRES LINKEDIN</div>
          {jobs.filter(j=>j.linkedin).map(job=><div key={job.id} className="card" onClick={()=>setSel(job.id)} style={{cursor:"pointer",marginBottom:"8px",border:"1px solid #bfdbfe"}}>
            <div style={{display:"flex",gap:"10px",alignItems:"center"}}>
              <Ring s={job.score} sz={40}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:"13px",fontWeight:700,color:"#0f172a",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{job.title}</div>
                <div style={{fontSize:"11.5px",color:"#64748b"}}>{job.company} · {job.location}</div>
              </div>
              {job.easyApply&&<span style={{background:"#e8f0fe",borderRadius:"6px",padding:"3px 8px",fontSize:"11px",color:LI,fontWeight:700,flexShrink:0}}>⚡EA</span>}
              <div style={{color:"#94a3b8",fontSize:"18px",flexShrink:0}}>›</div>
            </div>
          </div>)}
        </div>

        {/* Conseils */}
        {[
          {ic:"🎯",t:"Optimisez votre profil",c:"#eff6ff",b:"#bfdbfe",pts:["Titre : 'Chef de Projet Ferroviaire | Open to Switzerland'","Mentionnez MF19, MI20, HVAC, CATIA dans votre résumé","Changez votre localisation en 'Suisse'"]},
          {ic:"⚡",t:"Easy Apply — Comment ça marche",c:"#e8f0fe",b:"#bfdbfe",pts:["Cliquez 'Easy Apply' sur l'offre LinkedIn","Votre profil se pré-remplit automatiquement","Ajoutez la lettre générée dans la section dédiée","Postulez en moins de 2 minutes"]},
          {ic:"📨",t:"Approcher les recruteurs",c:"#f0fdf4",b:"#bbf7d0",pts:["Cherchez 'Recruteur ingénieur Romandie'","Suivez MATISA, Stadler, RUAG, CFF sur LinkedIn","Message court + votre objectif Suisse"]},
        ].map(s=><div key={s.t} style={{background:s.c,border:`1px solid ${s.b}`,borderRadius:"14px",padding:"14px",marginBottom:"10px"}}>
          <div style={{fontSize:"20px",marginBottom:"7px"}}>{s.ic}</div>
          <div style={{fontSize:"13px",fontWeight:700,color:"#0f172a",marginBottom:"10px"}}>{s.t}</div>
          {s.pts.map((p,i)=><div key={i} style={{display:"flex",gap:"7px",marginBottom:"6px",fontSize:"12.5px",color:"#334155",lineHeight:1.5}}>
            <span style={{color:"#2563eb",flexShrink:0}}>→</span>{p}
          </div>)}
        </div>)}

        <button onClick={()=>window.open("https://www.linkedin.com/jobs/search/?keywords=ing%C3%A9nieur+ferroviaire+chef+de+projet&location=Suisse+Romande&f_TPR=r604800","_blank")}
          style={{width:"100%",background:LI,color:"#fff",border:"none",padding:"15px",borderRadius:"12px",fontSize:"14px",fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}>
          <LiIcon sz={16} color="#fff"/> Ouvrir LinkedIn Jobs ↗
        </button>
      </div>}

      {/* ── PROFIL ── */}
      {tab==="profil"&&<div className="fd" style={{padding:"16px 16px 100px"}}>
        <div style={{fontSize:"18px",fontWeight:800,color:"#0f172a",marginBottom:"20px"}}>👤 Mon Profil</div>
        <div style={{background:"linear-gradient(135deg,#2563eb,#0ea5e9)",borderRadius:"16px",padding:"20px",marginBottom:"16px",textAlign:"center"}}>
          <div style={{width:"60px",height:"60px",borderRadius:"50%",background:"rgba(255,255,255,.25)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",fontWeight:800,color:"#fff",margin:"0 auto 12px"}}>RT</div>
          <div style={{fontSize:"18px",fontWeight:800,color:"#fff"}}>Rami Tlili</div>
          <div style={{fontSize:"13px",color:"rgba(255,255,255,.8)",marginTop:"3px"}}>Chef de Projet Technique Ferroviaire</div>
          <div style={{fontSize:"12px",color:"rgba(255,255,255,.7)",marginTop:"2px"}}>Lille → Suisse Romande 🇨🇭</div>
        </div>
        {[
          ["💼","Expérience","8 ans — ALSTOM, WABTEC-FAIVELEY"],
          ["🚆","Projets","MF19 (métro Paris) · MI20 (RER B)"],
          ["🔧","Outils","CATIA · PTC CREO · IBM DOORS · SAP"],
          ["🌡","Spécialité","HVAC/CVC ferroviaire"],
          ["🎓","Formation","Master Mécanique · Univ. Franche-Comté"],
          ["🌍","Langues","Français · Anglais · Arabe"],
          ["📄","Permis Suisse","B — Ressortissant français (UE)"],
          ["💰","Salaire cible","≥ 100 000 CHF / an"],
          ["📧","Email","tlili_rami@hotmail.com"],
        ].map(([ic,k,v])=><div key={k} className="card" style={{marginBottom:"8px",display:"flex",gap:"12px",alignItems:"center"}}>
          <span style={{fontSize:"20px",flexShrink:0}}>{ic}</span>
          <div>
            <div style={{fontSize:"11px",color:"#94a3b8"}}>{k}</div>
            <div style={{fontSize:"13px",color:"#334155",fontWeight:500}}>{v}</div>
          </div>
        </div>)}
      </div>}
    </div>

    {/* ── Barre de navigation bottom iOS ── */}
    <div style={{position:"sticky",bottom:0,background:"rgba(255,255,255,.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderTop:"1px solid #e2e8f0",display:"flex",paddingBottom:"env(safe-area-inset-bottom)",zIndex:50}}>
      {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)}
        style={{flex:1,padding:"10px 4px 8px",background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:"3px"}}>
        <span style={{fontSize:"22px",lineHeight:1}}>{t.ic}</span>
        <span style={{fontSize:"10px",fontWeight:tab===t.id?700:400,color:tab===t.id?"#2563eb":"#94a3b8",letterSpacing:".01em"}}>{t.lb}</span>
        {tab===t.id&&<div style={{width:"4px",height:"4px",borderRadius:"50%",background:"#2563eb",marginTop:"1px"}}/>}
      </button>)}
    </div>
  </div>;
}
