/* उद्यम Track — presentation layer; uses the existing /api contract. */
const money = value => '₹' + Number(value || 0).toLocaleString('en-IN');
const number = value => Number(value || 0).toLocaleString('en-IN');
const palette = ['#315d4b', '#bc733f', '#847093', '#ba5b62', '#658a91', '#a99c52'];
const sections = [
 {id:'dashboard', label:'Impact Overview', icon:'Dashboard', group:'OVERVIEW', subtitle:'A clearer view of skills, livelihoods and lasting progress.'},
 {id:'trainees', label:'Learner Directory', icon:'Trainees', group:'', subtitle:'Every learner. Every milestone. One connected record.'},
 {id:'onboarding', label:'Enrolment Desk', icon:'Onboarding', group:'OPERATIONS', subtitle:'Start a verified, consent-based learning journey.'},
 {id:'bot', label:'Outreach Studio', icon:'Bot', group:'', subtitle:'Keep the conversation going beyond certification.'},
 {id:'employers', label:'Employer Connect', icon:'Employer', group:'', subtitle:'Verify opportunities and strengthen placement confidence.'},
 {id:'self_employment', label:'Enterprise Pathways', icon:'SelfEmployment', group:'', subtitle:'Recognise the livelihoods created through self-employment.'},
 {id:'ai_predictor', label:'Insights Lab', icon:'AI', group:'INTELLIGENCE', subtitle:'Understand risk factors and identify timely interventions.'},
 {id:'compliance', label:'Trust & Consent', icon:'Compliance', group:'', subtitle:'Review consent records, audit events and data integrity.'},
 {id:'reports', label:'Evidence Centre', icon:'Reports', group:'', subtitle:'Turn outcome records into evidence for decisions.'}
];
async function readResponse(response) {
 if (!response.ok) {
  const body = await response.json().catch(() => ({}));
  throw new Error(typeof body.detail === 'string' ? body.detail : 'Request failed ('+response.status+')');
 }
 return response.json();
}
const getJSON = (path, signal) => fetch(API_BASE + path, {signal}).then(readResponse);
function Icon({name, ...props}) { const C=Icons[name] || Icons.Dashboard; return <span {...props}><C /></span>; }
function Sparkline({values, color='#22766e'}) {
 const nums=values.map(v=>Number(v)||0), max=Math.max(...nums,1), min=Math.min(...nums,0);
 const points=nums.map((v,i)=>`${i*104/Math.max(nums.length-1,1)+3},${31-(v-min)/(max-min||1)*26}`).join(' ');
 return <svg className="sparkline" viewBox="0 0 110 36" role="img" aria-label={'Wages: '+nums.map(money).join(', ')}><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round"/>{nums.map((v,i)=><circle key={i} cx={i*104/Math.max(nums.length-1,1)+3} cy={31-(v-min)/(max-min||1)*26} r="2.5" fill={color}/>)}</svg>;
}
function App() {
 const [activeTab,setActiveTab]=useState('dashboard');
 const [role,setRole]=useState('Admin');
 const [menuOpen,setMenuOpen]=useState(false);
 const [stats,setStats]=useState(null), [trainees,setTrainees]=useState([]);
 const [totalTrainees,setTotalTrainees]=useState(0), [currentPage,setCurrentPage]=useState(1), [totalPages,setTotalPages]=useState(1);
 const [filters,setFilters]=useState({course:'All',provider:'All',district:'All',status:'All',remedialOnly:false,search:''});
 const [selectedTrainee,setSelectedTrainee]=useState(null), [toasts,setToasts]=useState([]);
 const [failure,setFailure]=useState(''), [busy,setBusy]=useState(false), [revision,setRevision]=useState(0);
 const [query,setQuery]=useState('');
 const showToast=(message,type='success')=>{const id=Date.now()+Math.random(); setToasts(v=>[...v,{id,message,type}]);setTimeout(()=>setToasts(v=>v.filter(t=>t.id!==id)),4500);};
 const navigate=id=>{setActiveTab(id);setMenuOpen(false);window.scrollTo({top:0,behavior:'smooth'});};
 const refresh=()=>setRevision(n=>n+1);
 const changeFilters=value=>{setCurrentPage(1);setFilters(value);};
 useEffect(()=>{
  const controller=new AbortController();setBusy(true);setFailure('');
  const params=new URLSearchParams();
  ['course','provider','district'].forEach(k=>{if(filters[k]!=='All')params.set(k,filters[k]);});
  getJSON('/outcomes/dashboard-stats?'+params,controller.signal).then(setStats).catch(e=>{if(e.name!=='AbortError')setFailure(e.message);}).finally(()=>{if(!controller.signal.aborted)setBusy(false);});
  return ()=>controller.abort();
 },[filters.course,filters.provider,filters.district,revision]);
 useEffect(()=>{
  const controller=new AbortController(), params=new URLSearchParams({page:currentPage,page_size:12});
  ['course','provider','district','status'].forEach(k=>{if(filters[k]!=='All')params.set(k,filters[k]);});
  if(filters.search)params.set('search',filters.search);
  if(filters.remedialOnly)params.set('remedial_only','true');
  getJSON('/trainees?'+params,controller.signal).then(d=>{setTrainees(d.items||[]);setTotalTrainees(d.total||0);setTotalPages(d.total_pages||1);}).catch(e=>{if(e.name!=='AbortError')setFailure(e.message);});
  return ()=>controller.abort();
 },[filters,currentPage,revision]);
 const selectTrainee=async t=>{try{setSelectedTrainee(await getJSON('/trainees/'+encodeURIComponent(typeof t==='string'?t:t.id)));}catch(e){showToast(e.message,'error');}};
 const page=sections.find(s=>s.id===activeTab);
 return <div className="portal">
  {menuOpen&&<button aria-label="Close menu" className="sidebar-scrim" onClick={()=>setMenuOpen(false)}/>}
  <aside className={'portal-sidebar '+(menuOpen?'is-open':'')}>
   <div className="republic"><img src="/static/assets/satyamev-jayate.jpg" alt="National Emblem of India, Satyamev Jayate"/><strong>भारत सरकार</strong><span>Government of India</span></div>
   <nav aria-label="Main navigation">{sections.map(s=><React.Fragment key={s.id}>{s.group&&<div className="nav-group">{s.group}</div>}<button aria-current={activeTab===s.id?'page':undefined} onClick={()=>navigate(s.id)} className={'portal-nav '+(activeTab===s.id?'selected':'')}><Icon name={s.icon}/><span>{s.label}</span>{activeTab===s.id&&<i/>}</button></React.Fragment>)}</nav>
   <div className="sidebar-bottom"><span className="mini-tricolour"/><strong>Measure impact.</strong><span>Not just participation.</span><small>Government evaluator prototype</small></div>
  </aside>
  <div className="portal-body">
   <div className="national-strip"><i/><i/><i/></div>
   <header className="portal-header">
    <button className="menu-toggle" onClick={()=>setMenuOpen(v=>!v)} aria-label="Toggle navigation">☰</button>
    <button className="brand" onClick={()=>navigate('dashboard')}><img src="/static/assets/udyam-logo.jpeg" alt="उद्यम Track project logo"/><span><strong>उद्यम <b>Track</b></strong><small>From Training Records to Livelihood Intelligence</small></span></button>
    <form className="global-search" onSubmit={e=>{e.preventDefault();changeFilters(v=>({...v,search:query}));navigate('trainees');}}><Icon name="Search"/><input aria-label="Search learners" placeholder="Search learners, IDs or employers…" value={query} onChange={e=>setQuery(e.target.value)}/><button type="submit" aria-label="Search">↗</button></form>
    <div className="profile"><span className="profile-avatar">{role==='Admin'?'A':role==='Training Provider'?'P':'E'}</span><label><small>DEMO PERSPECTIVE</small><select aria-label="View perspective" value={role} onChange={e=>{setRole(e.target.value);showToast('Perspective: '+e.target.value+' (demo)');}}><option>Admin</option><option>Training Provider</option><option>Employer</option></select></label></div>
   </header>
   <main className={'portal-main page-'+activeTab}>
    <div className="breadcrumb">उद्यम Track <span>/</span> {page.label}<span className="sync-state"><i className={failure?'offline':''}/>{failure?'Connection issue':busy?'Refreshing…':'Connected to outcome data'}</span></div>
    {failure&&<div className="error-banner" role="alert">{failure}<button onClick={refresh}>Retry connection</button></div>}
    {activeTab!=='dashboard'&&<div className="page-heading"><div><div className="eyebrow">OUTCOME MONITORING PORTAL</div><h1>{page.label}</h1><p>{page.subtitle}</p></div><button className="quiet-button" onClick={refresh}>↻ Refresh data</button></div>}
    {activeTab==='dashboard'&&<ImpactDashboard stats={stats} filters={filters} setFilters={changeFilters} navigate={navigate} refresh={refresh} revision={revision}/>}
    {activeTab==='trainees'&&<TraineesView trainees={trainees} totalTrainees={totalTrainees} currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} filters={filters} setFilters={changeFilters} onSelectTrainee={selectTrainee} showToast={showToast} refreshTrainees={refresh}/>}
    {activeTab==='onboarding'&&<OnboardingWizardView showToast={showToast} onSuccess={()=>{refresh();navigate('trainees');}}/>}
    {activeTab==='bot'&&<BotSimulatorView trainees={trainees} showToast={showToast} refreshData={refresh}/>}
    {activeTab==='employers'&&<EmployersView showToast={showToast}/>}
    {activeTab==='self_employment'&&<SelfEmploymentView showToast={showToast}/>}
    {activeTab==='ai_predictor'&&<AIPredictorView showToast={showToast}/>}
    {activeTab==='compliance'&&<ComplianceView showToast={showToast}/>}
    {activeTab==='reports'&&<ReportsView stats={stats} showToast={showToast}/>}
    <footer className="portal-footer"><div><strong>उद्यम Track</strong><span>From Training Records to Livelihood Intelligence</span><small>Government evaluator prototype · Demonstration data</small></div><div className="team-credit"><span>Presented by Team Manthan</span><img src="/static/assets/team-manthan.png" alt="MANTHAN"/></div><a href="/docs" target="_blank" rel="noreferrer">API documentation ↗</a></footer>
   </main>
  </div>
  {selectedTrainee&&<TraineeDetailModal trainee={selectedTrainee} onClose={()=>setSelectedTrainee(null)} showToast={showToast} onUpdate={()=>{refresh();selectTrainee(selectedTrainee);}}/>}
  <div className="portal-toasts" role="status">{toasts.map(t=><div key={t.id} className={'toast '+t.type}>{t.message}</div>)}</div>
 </div>;
}
function ImpactDashboard({stats,filters,setFilters,navigate,refresh,revision}) {
 const [data,setData]=useState(null), [error,setError]=useState(''), [journey,setJourney]=useState(0);
 useEffect(()=>{
  const ctrl=new AbortController();setError('');
  Promise.all(['course-placement','wage-progression','status-breakdown','district-distribution','attrition-breakdown'].map(p=>getJSON('/outcomes/'+p,ctrl.signal))).then(([courses,wages,status,districts,attrition])=>setData({courses,wages,status,districts,attrition})).catch(e=>{if(e.name!=='AbortError')setError(e.message);});
  return ()=>ctrl.abort();
 },[revision]);
 const s=stats, scope=filters.course!=='All'||filters.provider!=='All'||filters.district!=='All';
 const milestones=s?[
  {label:'Training',value:number(s.total_trainees),unit:'learners evaluated',description:'The starting point: consent-based learner records linked to training, course and provider information.',action:'Explore learner records',target:'trainees',icon:'Trainees'},
  {label:'Employment',value:number(s.placed_count+s.self_employed_count),unit:'earning livelihoods',description:`${number(s.placed_count)} wage-employed learners and ${number(s.self_employed_count)} self-employed learners in the selected cohort.`,action:'Explore enterprise pathways',target:'self_employment',icon:'Employer'},
  {label:'Retention',value:s.retention_rate_pct+'%',unit:'retained across the cohort',description:'The share of all evaluated learner records marked as retained by the backend, including its existing denominator.',action:'View learner timelines',target:'trainees',icon:'Compliance'},
  {label:'Wage growth',value:(s.wage_growth_pct>=0?'+':'')+s.wage_growth_pct+'%',unit:'average wage progression',description:`${money(s.avg_baseline_wage)} baseline → ${money(s.avg_current_wage)} current average wage for earning learners with a recorded baseline.`,action:'Open evidence centre',target:'reports',icon:'TrendingUp'}
 ]:[];
 return <div className="impact-dashboard">
  <section className="hero"><div className="hero-copy"><div className="hero-kicker"><span className="mini-tricolour"/> OUTCOMES THAT MATTER</div><h1>Udyam Bharat,<br/><em>Prabal Bharat.</em></h1><p>Real outcomes. Real opportunities. Lasting impact.</p><div className="system-caption">AI-Powered Longitudinal Outcome &amp; Omnichannel Impact Measurement System</div><blockquote>“Every skill is a beginning. Every livelihood is progress.”<cite>THE उद्यम TRACK VISION</cite></blockquote></div><DashboardCarousel/></section>
  <div className="cohort-toolbar"><span><Icon name="Compliance"/> Cohort lens</span><select aria-label="Dashboard course" value={filters.course} onChange={e=>setFilters(v=>({...v,course:e.target.value}))}><option value="All">All courses</option>{['Electrician','Welder','Data Entry Operator','Retail Associate','Healthcare Assistant'].map(v=><option key={v}>{v}</option>)}</select><select aria-label="Dashboard district" value={filters.district} onChange={e=>setFilters(v=>({...v,district:e.target.value}))}><option value="All">All districts</option>{['Hyderabad','Visakhapatnam','Vijayawada','Guntur','Warangal'].map(v=><option key={v}>{v}</option>)}</select><select aria-label="Dashboard provider" value={filters.provider} onChange={e=>setFilters(v=>({...v,provider:e.target.value}))}><option value="All">All providers</option>{['National Skill Training Institute (NSTI)','Apex Vocational Academy','Pradhan Mantri Kaushal Kendra (PMKK)','Telangana Skill Development Mission (TSDM)','Andhra Pradesh State Skill Development (APSSDC)'].map(v=><option key={v}>{v}</option>)}</select><button className="quiet-button" onClick={()=>{setFilters(v=>({...v,course:'All',district:'All',provider:'All'}));refresh();}}>↻ Reset</button></div>
  {!s?<div className="loading-panel">Connecting to your outcome records…</div>:<>
   <section className="metric-strip" aria-label="Key outcome indicators">
    <Metric label="Learners evaluated" value={number(s.total_trainees)} note="Selected cohort" icon="Trainees" color="violet"/>
    <Metric label="Wage placement" value={s.placed_pct+'%'} note={number(s.placed_count)+' learners placed'} icon="Employer" color="teal"/>
    <Metric label="Retention rate" value={s.retention_rate_pct+'%'} note="Share of all evaluated learners" icon="Compliance" color="amber"/>
    <Metric label="Wage progression" value={(s.wage_growth_pct>=0?'+':'')+s.wage_growth_pct+'%'} note={money(s.avg_baseline_wage)+' → '+money(s.avg_current_wage)} icon="TrendingUp" color="rose"/>
   </section>
   <section className="journey-card"><div className="journey-main"><div className="card-top"><div><div className="eyebrow">FROM PARTICIPATION TO PROGRESS</div><h2>The Livelihood Journey</h2></div><span className="small-tag">INTERACTIVE VIEW</span></div><div className="journey-stages" role="tablist" aria-label="Livelihood stages">{milestones.map((m,i)=><button key={m.label} role="tab" aria-selected={journey===i} className={journey===i?'active':''} onClick={()=>setJourney(i)}><span className="stage-number">0{i+1}</span><strong>{m.label}</strong><small>{m.value}</small></button>)}</div><p className="journey-caption">One connected story, from a first skill to a sustained livelihood.</p></div><div className="journey-detail" role="tabpanel"><Icon name={milestones[journey].icon}/><strong>{milestones[journey].value}</strong><span>{milestones[journey].unit}</span><p>{milestones[journey].description}</p><button onClick={()=>navigate(milestones[journey].target)}>{milestones[journey].action} ↗</button></div></section>
  </>}
  {error&&<div className="error-banner">{error}<button onClick={refresh}>Retry charts</button></div>}
  {data&&<><div className="section-label"><h2>Outcome intelligence</h2><span>Charts show all cohorts{scope?' · KPI cards above reflect your filters':''}</span></div>
   <div className="chart-row"><section className="panel wage-panel"><PanelTitle title="Income, over time" subtitle="Average wages at recorded follow-up milestones" tag="M0 → M12"/><WageChart timeline={data.wages.overall_timeline}/><div className="chart-foot"><span className="legend-dot teal"/>Average monthly income <span>All earning learners with a baseline</span></div></section><section className="panel distribution-panel"><PanelTitle title="Pathways to livelihood" subtitle="Employment status across your complete dataset"/><StatusDonut rows={data.status}/></section></div>
   <div className="chart-row secondary"><section className="panel"><PanelTitle title="Skills that open doors" subtitle="Earning outcomes by course · wage + self-employment" tag="COURSE VIEW"/><div className="course-bars">{data.courses.map((c,i)=><div className="course-row" key={c.course}><div><strong>{c.course}</strong><span>{c.placement_rate}%</span></div><div className="bar-track"><i style={{width:c.placement_rate+'%',background:palette[i%palette.length]}}/></div><small>{number(c.total)} learners <span>Avg. {money(c.avg_wage)}/mo</span></small></div>)}</div></section><section className="panel"><PanelTitle title="District pulse" subtitle="Earning outcomes in the backend's recorded districts" tag="REGIONAL VIEW"/><div className="district-list">{data.districts.map((d,i)=><button key={d.district} onClick={()=>{setFilters(v=>({...v,district:d.district}));navigate('trainees');}}><span className="district-rank">0{i+1}</span><div><strong>{d.district}</strong><small>{number(d.total)} learners · {money(d.avg_wage)} avg. wage</small><div className="bar-track"><i style={{width:d.placement_rate+'%',background:palette[i%palette.length]}}/></div></div><b>{d.placement_rate}%<small>earning</small></b></button>)}</div></section></div>
   <div className="chart-row final-row"><section className="panel"><PanelTitle title="Listen. Understand. Intervene." subtitle="Reported reasons for attrition"/><div className="reason-grid">{data.attrition.length?data.attrition.map((a,i)=><div key={a.reason}><i style={{background:palette[i%palette.length]}}/><span>{a.reason}</span><strong>{a.count}</strong></div>):<p>No attrition reasons recorded.</p>}</div></section><section className="action-card"><Icon name="Shield"/><div className="eyebrow">TURN EVIDENCE INTO ACTION</div><h2>{s?number(s.remedial_count):'—'} learners.<br/>A chance to change their story.</h2><p>Review flagged cases and plan the next support step.</p><button onClick={()=>{setFilters(v=>({...v,remedialOnly:true}));navigate('trainees');}}>Open intervention queue <span>↗</span></button></section></div>
  </>}
 </div>;
}
function ReportsView({showToast}) {
 const [report,setReport]=useState(null),[error,setError]=useState(''),[downloading,setDownloading]=useState(false);
 useEffect(()=>{const controller=new AbortController();getJSON('/reports/cohort-summary',controller.signal).then(setReport).catch(e=>{if(e.name!=='AbortError')setError(e.message);});return()=>controller.abort();},[]);
 const download=async()=>{
  setDownloading(true);
  try{const res=await fetch(API_BASE+'/reports/export-csv');if(!res.ok)throw Error('Export failed');const url=URL.createObjectURL(await res.blob());const a=document.createElement('a');a.href=url;a.download='Udyam_Track_Outcomes.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);showToast('Outcome records exported.');}
  catch(e){showToast(e.message,'error');}finally{setDownloading(false);}
 };
 return <div className="space-y-5">
  <div className="report-actions no-print"><div><strong>Evidence, ready to share.</strong><p>A current summary generated from your backend records.</p></div><button className="quiet-button" disabled={downloading} onClick={download}>{downloading?'Preparing…':'↓ Export all records'}</button><button className="primary-button" disabled={!report} onClick={()=>window.print()}>Print / Save as PDF</button></div>
  {error&&<div className="error-banner">{error}</div>}
  {!report&&!error&&<div className="loading-panel">Preparing the cohort summary…</div>}
  {report&&<article className="report-page print-container"><header><img src="/static/assets/udyam-logo.jpeg" alt="उद्यम Track"/><div><div className="eyebrow">उद्यम TRACK · EVALUATOR PREVIEW</div><h2>Longitudinal Outcome Summary</h2><p>{report.cohort} · {report.generated_at}</p></div></header><div className="report-metrics">{[['Evaluated learners',number(report.summary.total_evaluated)],['Earning livelihoods',report.summary.overall_placement_rate],['Wage employment',report.summary.wage_employment_share],['Self-employment',report.summary.self_employment_share]].map(([label,val])=><div key={label}><small>{label}</small><strong>{val}</strong></div>)}</div><h3>Income & opportunity</h3><div className="report-facts"><div><span>Average entry wage</span><strong>{report.summary.avg_entry_wage}</strong></div><div><span>Average 12-month wage</span><strong>{report.summary.avg_12m_wage}</strong></div><div><span>Net wage progression</span><strong>{report.summary.net_wage_progression}</strong></div><div><span>Seeking employment</span><strong>{report.summary.unemployment_share}</strong></div><div><span>Remedial interventions flagged</span><strong>{number(report.summary.remedial_intervention_count)}</strong></div></div><aside>Measure impact, not just participation.</aside><p className="report-note">Source: cohort summary API · Full dataset, independent of dashboard filters. Earning livelihoods combines wage employment and self-employment. This is a project demonstration report, not an issued government certificate.</p></article>}
 </div>;
}
function DashboardCarousel() {
 const slides=[{src:'skills-banner.png',alt:'Training, experience and knowledge build skills',title:'The foundation of opportunity',subtitle:'Learning today. Livelihoods tomorrow.'},{src:'skill-india.jpg',alt:'Directorate General of Training, Skill India and Ministry of Skill Development and Entrepreneurship',title:'Skills for a stronger India',subtitle:'Training → Employment → Lasting progress'},{src:'kaushal.jpg',alt:'Kaushalyam Balam skill development emblem',title:'कौशल्यम् बलम्',subtitle:'Skill is strength.'}];
 const [index,setIndex]=useState(0),[paused,setPaused]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches),[hover,setHover]=useState(false);
 useEffect(()=>{if(paused||hover)return;const timer=setInterval(()=>setIndex(i=>(i+1)%slides.length),3000);return()=>clearInterval(timer);},[paused,hover]);
 return <section className="hero-gallery" aria-label="Skill development highlights" aria-roledescription="carousel" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onFocusCapture={()=>setHover(true)} onBlurCapture={e=>{if(!e.currentTarget.contains(e.relatedTarget))setHover(false);}}><div className="gallery-images">{slides.map((s,i)=><img key={s.src} src={'/static/assets/'+s.src} alt={s.alt} aria-hidden={i!==index} className={(i===index?'visible ':'')+(i===0?'cover':'contain')}/>)}</div><div className="gallery-caption"><div><small>SKILLING / {String(index+1).padStart(2,'0')}</small><h2>{slides[index].title}</h2><p>{slides[index].subtitle}</p></div><div className="gallery-controls"><button onClick={()=>setIndex(i=>(i+slides.length-1)%slides.length)} aria-label="Previous slide">←</button><button onClick={()=>setPaused(v=>!v)} aria-label={paused?'Play slideshow':'Pause slideshow'}>{paused?'▶':'Ⅱ'}</button><button onClick={()=>setIndex(i=>(i+1)%slides.length)} aria-label="Next slide">→</button></div></div><div className="gallery-dots">{slides.map((s,i)=><button key={s.src} aria-label={'Show slide '+(i+1)} aria-pressed={index===i} onClick={()=>setIndex(i)}/>)}</div></section>;
}
function Metric({label,value,note,icon,color}) {return <article className={'metric-card '+color}><span className="metric-icon"><Icon name={icon}/></span><div><span>{label}</span><strong>{value}</strong><small>{note}</small></div></article>;}
function PanelTitle({title,subtitle,tag}) {return <div className="panel-title"><div><h2>{title}</h2><p>{subtitle}</p></div>{tag&&<span className="small-tag">{tag}</span>}</div>;}
function WageChart({timeline=[]}) {
 if(!timeline.length)return <p className="empty-state">No wage observations yet.</p>;
 const max=Math.max(...timeline.map(t=>t.average_wage),1)*1.2;
 const x=i=>65+i*500/Math.max(timeline.length-1,1), y=v=>205-v/max*165;
 const points=timeline.map((t,i)=>x(i)+','+y(t.average_wage)).join(' ');
 return <svg className="wage-chart" viewBox="0 0 610 265" role="img" aria-label="Average wage progression"><defs><linearGradient id="wageFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#2e8c85" stopOpacity=".2"/><stop offset="100%" stopColor="#2e8c85" stopOpacity=".01"/></linearGradient></defs>{[0,1,2,3].map(i=><g key={i}><line x1="65" x2="565" y1={205-i*55} y2={205-i*55} stroke="#dee8eb" strokeDasharray="3 5"/><text x="49" y={209-i*55} textAnchor="end">{Math.round(max*i/3/1000)}k</text></g>)}<polygon points={'65,205 '+points+' 565,205'} fill="url(#wageFill)"/><polyline points={points} fill="none" stroke="#22766e" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/>{timeline.map((t,i)=><g key={t.short}><circle cx={x(i)} cy={y(t.average_wage)} r="5" stroke="#22766e" strokeWidth="2.5" fill="#fff"/><text x={x(i)} y={y(t.average_wage)-15} textAnchor="middle" className="value-label">{money(t.average_wage)}</text><text x={x(i)} y="235" textAnchor="middle">{t.short==='M0'?'Baseline':t.short}</text><title>{t.milestone}: {money(t.average_wage)}, sample {t.sample_size}</title></g>)}</svg>;
}
function StatusDonut({rows=[]}) {
 const total=rows.reduce((n,r)=>n+r.value,0);
 let offset=0;
 return <div className="donut-layout"><svg viewBox="0 0 200 200" role="img" aria-label="Employment status distribution"><circle cx="100" cy="100" r="73" fill="none" stroke="#ecf0f2" strokeWidth="23"/>{rows.map((r,i)=>{const p=total?r.value/total*100:0, start=offset;offset+=p;return <circle key={r.name} cx="100" cy="100" r="73" pathLength="100" fill="none" stroke={palette[i]} strokeWidth="23" strokeDasharray={Math.max(p-1.4,0)+' '+(100-Math.max(p-1.4,0))} strokeDashoffset={-start} transform="rotate(-90 100 100)"><title>{r.name}: {r.value}</title></circle>;})}<text x="100" y="100" textAnchor="middle" className="donut-number">{number(total)}</text><text x="100" y="121" textAnchor="middle" className="donut-caption">LEARNERS</text></svg><div className="donut-legend">{rows.map((r,i)=><div key={r.name}><i style={{background:palette[i]}}/><span>{r.name.replace('Wage Employed (Placed)','Wage employed').replace('Self-Employed / Enterprise','Self-employed').replace('Unemployed / Seeking','Seeking work')}</span><strong>{r.percentage}%</strong></div>)}</div></div>;
}
ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
