/* ---------- helpers ---------- */
const $=id=>document.getElementById(id);
async function apiPost(url,headers,body,timeoutMs){
 const ctrl=new AbortController();const timer=setTimeout(()=>ctrl.abort(),timeoutMs||55000);
 let res;
 try{res=await fetch(url,{method:'POST',headers,body:JSON.stringify(body),signal:ctrl.signal})}
 catch(e){clearTimeout(timer);if(e.name==='AbortError')throw new Error('This is taking too long. Try a shorter request, or try again.');throw new Error('Could not reach the server. Check your connection and try again.')}
 clearTimeout(timer);
 let data=null;try{data=await res.json()}catch(e){}
 if(!data)throw new Error(res.ok?'The server sent back something unexpected. Try again.':'The server took too long or had an error ('+res.status+'). Try again.');
 if(!res.ok)throw new Error(data.error||('Error '+res.status+'. Try again.'));
 return data;
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const mem={};
const ls={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return k in mem?mem[k]:d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){mem[k]=v}}};
const P={
 home:"M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",book:"M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3zM8 8h7",
 code:"M8 7l-5 5 5 5M16 7l5 5-5 5",term:"M4 5h16v14H4zM8 10l3 2-3 2M13 15h4",cal:"M4 6h16v14H4zM4 10h16M8 3v4M16 3v4",
 quiz:"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4",chart:"M5 20V10M12 20V4M19 20v-7",
 gear:"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2",
 search:"M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5",sun:"M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19",
 bell:"M6 17v-6a6 6 0 0 1 12 0v6l2 2H4zM10 21h4",menu:"M4 6h16M4 12h16M4 18h16",send:"M4 12l16-8-6 16-3-7z",
 spark:"M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z",wifi:"M2 9a15 15 0 0 1 20 0M5 13a10 10 0 0 1 14 0M8.5 16.5a5 5 0 0 1 7 0M12 20h.01",
 shield:"M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",key:"M14 10a4 4 0 1 0-3 3.9L11 15h2v2h2v2h3v-3z",fish:"M3 12c4-6 12-6 18 0-6 6-14 6-18 0zM16 12h.01",
 plus:"M12 5v14M5 12h14",chat:"M4 5h16v11H9l-5 4z",clip:"M20 11l-8 8a5 5 0 0 1-7-7l8-8a3.5 3.5 0 0 1 5 5l-8 8a2 2 0 0 1-3-3l7-7",
 lock:"M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",mic:"M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
 img:"M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M9 9h.01",trash:"M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",bookmark:"M6 3h12v18l-6-4-6 4z",copy:"M9 9h11v11H9zM5 15V4h11",
 history:"M4 12a8 8 0 1 0 3-6M4 4v4h4M12 8v5l3 2",star:"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
 formula:"M18 4H6l7 8-7 8h12",exam:"M6 3h12v18H6zM9 8h6M9 12h6M9 16h4",logout:"M10 4H5v16h5M15 8l4 4-4 4M19 12H9",play:"M7 4l13 8-13 8z",info:"M12 8h.01M11 12h1v5h1M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"};
function icons(s){(s||document).querySelectorAll('[data-ic]').forEach(e=>{if(!e.firstChild)e.innerHTML='<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path d="'+P[e.dataset.ic]+'"/></svg>'})}
const LOGO='<span class="lg-mark" role="img" aria-label="Ace_X AI logo"></span>';
document.querySelectorAll('[data-logo]').forEach(e=>e.outerHTML=LOGO);
icons();
function toast(t){const e=$('toast');e.textContent=t;e.hidden=false;clearTimeout(toast.t);toast.t=setTimeout(()=>e.hidden=true,2600)}
const dstr=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const pct=(a,b)=>Math.max(0,Math.min(100,Math.round(a/b*100)));
function ago(t){const s=(Date.now()-t)/1000;if(s<60)return 'just now';if(s<3600)return Math.floor(s/60)+'m ago';if(s<86400)return Math.floor(s/3600)+'h ago';return Math.floor(s/86400)+'d ago'}

/* ---------- state ---------- */
let accounts=ls.get('acex-accounts',{});
let session=ls.get('acex-session',null);
let chats=ls.get('acex-chats',[]), saved=ls.get('acex-saved',[]), planData=ls.get('acex-plan',{}), quizHist=ls.get('acex-quizzes',[]), acts=ls.get('acex-acts',[]);
let stats=ls.get('acex-stats',{quizzes:0,questions:0,streak:0,lastDay:'',today:{d:'',chats:0,quizzes:0,qs:0}});
let prefs=ls.get('acex-prefs',{font:'sans',size:'medium',lang:'en-US'});
let adminOn=false, adminTok=null, curChat=null;
const me=()=>session&&accounts[session]?accounts[session]:null;
const hasPro=()=>!!adminTok||!!(me()&&me().proToken&&me().proUntil>Date.now());
const proTok=()=>adminTok||((me()&&me().proToken&&me().proUntil>Date.now())?me().proToken:'');
const AH=()=>({'Content-Type':'application/json','x-pro-token':proTok()});
const first=n=>{n=(n||'Student').trim().split(/\s+/)[0];return n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()};
/* Daily quiz allowance. Free users get a flat amount; each Pro plan adds a bonus on top, bigger for longer plans.
   Tune the numbers here any time — nothing else needs to change. */
const FREE_DAILY_QUIZZES=15;
const PLAN_BONUS={w1:10,w2:20,w3:30,m1:40,m5:50,y1:60};
function dailyQuizLimit(){
 if(adminOn)return Infinity;
 const u=me();if(!u)return FREE_DAILY_QUIZZES;
 if(hasPro()&&u.planId&&PLAN_BONUS[u.planId]!=null)return FREE_DAILY_QUIZZES+PLAN_BONUS[u.planId];
 return FREE_DAILY_QUIZZES;
}
function quizzesUsedToday(){rollDay();return stats.today.quizzes||0}
function quizzesLeftToday(){const left=dailyQuizLimit()-quizzesUsedToday();return left===Infinity?Infinity:Math.max(0,left)}
function persist(){ls.set('acex-accounts',accounts);ls.set('acex-chats',chats);ls.set('acex-saved',saved);ls.set('acex-plan',planData);ls.set('acex-quizzes',quizHist);ls.set('acex-acts',acts);ls.set('acex-stats',stats);ls.set('acex-prefs',prefs)}
function log(t){acts.unshift({t,at:Date.now()});acts=acts.slice(0,20);persist()}
function rollDay(){const t=dstr(new Date());if(stats.today.d!==t){stats.today={d:t,chats:0,quizzes:0,qs:0};
  const y=new Date();y.setDate(y.getDate()-1);stats.streak=stats.lastDay===dstr(y)?stats.streak+1:1;stats.lastDay=t;persist()}}

/* ---------- theme + prefs ---------- */
const root=document.documentElement;
function curTheme(){return root.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'glass':'light')}
function setTheme(t){root.dataset.theme=t;ls.set('acex-theme',t);$('thLight').classList.toggle('on',t==='light');$('thGlass').classList.toggle('on',t==='glass')}
setTheme(ls.get('acex-theme',null)||curTheme());
$('themeBtn').onclick=()=>setTheme(curTheme()==='light'?'glass':'light');
document.querySelectorAll('[data-th]').forEach(b=>b.onclick=()=>setTheme(b.dataset.th));
function applyPrefs(){
 root.style.setProperty('--ans-font',{sans:'Inter,system-ui,-apple-system,"Segoe UI",sans-serif',serif:'"Source Serif 4",Georgia,"Times New Roman",serif',easy:'"Atkinson Hyperlegible",Inter,system-ui,sans-serif',mono:'var(--mono)'}[prefs.font]||'Inter,system-ui,sans-serif');
 root.style.setProperty('--ans-size',{small:'14px',medium:'15.5px',large:'17.5px'}[prefs.size]);
 $('sFont').value=prefs.font;$('sSize').value=prefs.size;$('sLang').value=prefs.lang}
['sFont:font','sSize:size','sLang:lang'].forEach(p=>{const[id,k]=p.split(':');$(id).onchange=()=>{prefs[k]=$(id).value;persist();applyPrefs()}});

/* ---------- auth ---------- */
let mode='login';
async function hash(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return btoa(unescape(encodeURIComponent(s)))}}
function setMode(m){mode=m;$('tabLogin').classList.toggle('on',m==='login');$('tabSignup').classList.toggle('on',m==='signup');$('nameRow').hidden=m!=='signup';$('aGo').textContent=m==='login'?'Log in':'Create account';$('aErr').textContent='';$('aPass').autocomplete=m==='login'?'current-password':'new-password'}
$('tabLogin').onclick=()=>setMode('login');$('tabSignup').onclick=()=>setMode('signup');
async function authGo(){
 const email=$('aEmail').value.trim().toLowerCase(),pass=$('aPass').value,name=$('aName').value.trim(),err=$('aErr');
 if(!/^\S+@\S+\.\S+$/.test(email)){err.textContent='Enter a valid email address.';return}
 if(pass.length<8){err.textContent='Password must be at least 8 characters.';return}
 const h=await hash(pass);
 if(mode==='signup'){
  if(!name){err.textContent='Enter your name.';return}
  if(accounts[email]){err.textContent='An account with this email already exists. Log in instead.';return}
  accounts[email]={name,role:'Student',plan:'free',pw:h};persist();
 }else{
  if(!accounts[email]||accounts[email].pw!==h){err.textContent='Wrong email or password.';return}
 }
 session=email;ls.set('acex-session',email);$('aPass').value='';enterApp();
}
$('aGo').onclick=authGo;
['aEmail','aPass','aName'].forEach(id=>$(id).addEventListener('keydown',e=>{if(e.key==='Enter')authGo()}));
function enterApp(){$('auth').hidden=true;$('app').hidden=false;rollDay();refreshUser();go('home');handlePayReturn()}
function logout(){session=null;adminOn=false;adminTok=null;ls.set('acex-session',null);$('app').hidden=true;$('auth').hidden=false;setMode('login');$('aEmail').value=''}
$('logout').onclick=logout;

function refreshUser(){
 const u=me();if(!u)return;const n=first(u.name);
 ['sAv','tAv'].forEach(i=>$(i).textContent=n.charAt(0));$('sName').textContent=u.name;$('tName').textContent=n;$('tRole').textContent=u.role;$('hello').textContent=n;
 $('sPlan').textContent=hasPro()?'Pro plan':'Free plan';$('sUp').hidden=hasPro();
 $('sName2').value=u.name;$('sRole').value=u.role;
 $('planLine').textContent=hasPro()?((u.proUntil>Date.now())?'You are on Pro until '+new Date(u.proUntil).toLocaleDateString()+'.':'Pro access through admin.'):'You are on the Free plan. Terminal, Code Lab, Formula Hub, Exam Practice and Image Studio are Pro features.';
 $('proSub').textContent=hasPro()?'Pro is active. Buy more time any time.':'Unlock every feature.';
 applyLocks();$('admStats').textContent='Registered accounts on this device: '+Object.keys(accounts).length;
}
$('saveProf').onclick=()=>{const u=me();u.name=$('sName2').value.trim()||u.name;u.role=$('sRole').value;persist();refreshUser();renderHome();toast('Saved')};
document.querySelectorAll('[data-plan]').forEach(b=>b.onclick=async()=>{
 b.disabled=true;const old=b.textContent;b.textContent='Opening Paystack...';
 try{const r=await fetch('/api/pay/init',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:b.dataset.plan,email:session,baseToken:proTok()})});
  const d=await r.json();if(!r.ok||!d.url)throw new Error(d.error||'Could not start the payment');location.href=d.url}
 catch(e){toast(e.message||'Could not start the payment');b.disabled=false;b.textContent=old}});
async function handlePayReturn(){
 const q=new URLSearchParams(location.search);let ref=q.get('reference')||q.get('trxref');
 if(ref){history.replaceState(null,'',location.pathname);if(!me()){ls.set('acex-pendingref',ref);return}}
 else ref=ls.get('acex-pendingref',null);
 if(!ref||!me())return;ls.set('acex-pendingref',null);toast('Confirming your payment...');
 try{const r=await fetch('/api/pay/verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({reference:ref})});const d=await r.json();
  if(!r.ok)throw new Error(d.error||'Payment was not confirmed');
  const u=me();u.proToken=d.token;u.proUntil=d.until;u.planId=d.planId||b.dataset.plan;persist();refreshUser();go('pro');toast('Pro is active until '+new Date(d.until).toLocaleDateString())}
 catch(e){toast(e.message||'Payment was not confirmed')}}

/* admin: the code is checked on the server */
$('admGo').onclick=async()=>{const c=$('admCode').value;if(!c)return;
 try{const r=await fetch('/api/admin/unlock',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({code:c})});const d=await r.json();
  if(!r.ok)throw new Error(d.error||'Wrong admin code');adminTok=d.token;adminOn=true;$('admCode').value='';showAdmin();refreshUser();toast('Admin unlocked')}
 catch(e){toast(e.message||'Wrong admin code')}};
function showAdmin(){$('adminLocked').hidden=adminOn;$('adminOpen').hidden=!adminOn}
$('admLock').onclick=()=>{adminOn=false;adminTok=null;showAdmin();refreshUser()};
$('clearChats').onclick=()=>{if(confirm('Delete all your chats?')){chats=[];curChat=null;persist();renderHistory();newChat();toast('Chats cleared')}};

/* ---------- nav + views ---------- */
const items=[["home","home","Dashboard",""],["chat","chat","Tutor Chat","Solve, explain, create"],["history","history","Chat History",""],["saved","bookmark","Saved Items",""],["quizzes","quiz","Quizzes",""],["code","code","Code Lab","",1],["terminal","term","Terminal","Command line + Cyber tools",1],["formulas","formula","Formula Hub","",1],["exam","exam","Exam Practice","",1],["image","img","Image Studio","",1],["planner","cal","Planner",""],["progress","chart","Learning Progress",""],["settings","gear","Settings",""]];
const nav=$('nav');
items.forEach(([k,ic,t,s,pro])=>{const a=document.createElement('a');a.tabIndex=0;a.dataset.nav=k;
 a.innerHTML='<i data-ic="'+ic+'"></i><div class="t"><b>'+t+(pro?' <span class="badge">PRO</span>':'')+'</b>'+(s?'<small>'+s+'</small>':'')+'</div>';
 nav.appendChild(a);icons(a);a.onclick=()=>go(k);a.onkeydown=e=>{if(e.key==='Enter')go(k)}});
const side=$('side'),scrim=$('scrim');
function applyLocks(){document.querySelectorAll('.view[data-pro]').forEach(v=>{const open=hasPro();v.querySelector('[data-content]').hidden=!open;const l=v.querySelector('[data-lock]');l.hidden=open;
 if(!open&&!l.firstChild){l.innerHTML='<i data-ic="lock"></i><h2>Pro feature</h2><p>Upgrade to Pro to use this feature.</p><button class="btn" data-go="pro"><i data-ic="star"></i>See Pro plan</button>';icons(l)}})}
function go(k){
 if(!me())return;
 document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id==='v-'+k));
 nav.querySelectorAll('a').forEach(a=>a.classList.toggle('on',a.dataset.nav===k));
 closeSide();window.scrollTo(0,0);document.body.classList.toggle('nowm',k==='terminal');
 if(k==='home')renderHome();if(k==='history')renderHistory();if(k==='saved')renderSaved();if(k==='quizzes'){renderQuizHist();renderQuota()}
 if(k==='planner')renderCal();if(k==='formulas')renderFormulas();if(k==='progress')renderProgress();if(k==='settings')showAdmin();
 if(k==='chat')setTimeout(()=>cin.focus(),60);
}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)go(g.dataset.go)});
function closeSide(){side.classList.remove('show');scrim.classList.remove('show')}
$('menuBtn').onclick=()=>{side.classList.add('show');scrim.classList.add('show')};scrim.onclick=closeSide;
addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('q').focus()}if(e.key==='Escape')closeSide()});
$('today').textContent=new Date().toLocaleDateString('en-GB',{weekday:'short',day:'numeric',month:'short',year:'numeric'});

/* ---------- home + progress ---------- */
function ringHTML(l,p,s){return '<div><div class="lbl">'+l+'</div><div class="ring" style="--p:'+p+'"><span>'+p+'%</span></div><small>'+s+'</small></div>'}
function ringsHTML(){return ringHTML('Quizzes',pct(stats.quizzes,50),stats.quizzes+'/50')+ringHTML('Questions',pct(stats.questions,200),stats.questions+'/200')+ringHTML('Chats',pct(chats.length,25),chats.length+'/25')+
 '<div><div class="lbl">Streak</div><div class="flame">&#128293;</div><small><b>'+stats.streak+' day'+(stats.streak===1?'':'s')+'</b></small></div>'}
function renderHome(){
 if(!me())return;rollDay();$('rings').innerHTML=ringsHTML();
 const t=stats.today,g=[['Tutor chats',t.chats,2],['Quizzes',t.quizzes,2],['Questions',t.qs,10]];
 const all=Math.round(g.reduce((a,x)=>a+Math.min(1,x[1]/x[2]),0)/g.length*100);
 $('bigRing').style.setProperty('--p',all);$('bigRing').innerHTML='<span>'+all+'%<small>Overall</small></span>';
 $('checks').innerHTML=g.map(x=>'<div class="check">'+x[0]+'<small>'+Math.min(x[1],x[2])+'/'+x[2]+'</small><div class="bar"><i style="width:'+pct(x[1],x[2])+'%"></i></div></div>').join('');
 const list=planData[dstr(new Date())]||[];
 $('homePlan').innerHTML=list.length?list.slice(0,5).map(s=>'<label><input type="checkbox" data-id="'+s.id+'"'+(s.done?' checked':'')+'><b>'+esc(s.t)+'</b><small>'+esc(s.s)+'</small></label>').join(''):'<div class="empty-note">Nothing planned today. <a class="link" data-go="planner">Add a session</a></div>';
 $('homePlan').querySelectorAll('input').forEach(i=>i.onchange=()=>{const s=list.find(x=>x.id==i.dataset.id);s.done=i.checked;persist()});
}
function renderProgress(){$('rings2').innerHTML=ringsHTML();
 $('actList').innerHTML=acts.length?acts.map(a=>'<div class="item"><i data-ic="check"></i><div class="grow" style="cursor:default">'+esc(a.t)+'</div><small>'+ago(a.at)+'</small></div>').join(''):'<div class="empty-note">No activity yet. Start a chat or take a quiz.</div>';icons($('actList'))}
P.check="M5 12l4 4 10-10";

/* ---------- chat ---------- */
const msgs=$('msgs'),cin=$('cin'),filesEl=$('files');
let pending=[];
function newChat(){curChat=null;pending=[];renderFiles();showEmpty();cin.value='';cin.style.height='44px'}
function showEmpty(){
 msgs.innerHTML='<div class="empty" id="empty"><div class="lg-full chatlogo" role="img" aria-label="Ace_X AI logo"></div><h2 class="sr">Ace_X AI</h2><p>Your coding and study assistant. Ask me anything.</p><div class="sugs">'+
 [['Summarise text','Summarise this text:\n\n'],['Write code','Write code that '],['Fix my code','Fix my code:\n\n'],['Solve a problem','Solve this problem step by step:\n\n'],['WASSCE study plan','Make me a 4-week WASSCE study plan for ']].map((s,i)=>'<button data-p="'+i+'">'+s[0]+'</button>').join('')+'</div></div>';
 const pre=['Summarise this text:\n\n','Write code that ','Fix my code:\n\n','Solve this problem step by step:\n\n','Make me a 4-week WASSCE study plan for '];
 msgs.querySelectorAll('.sugs button').forEach(b=>b.onclick=()=>{cin.value=pre[b.dataset.p];cin.dispatchEvent(new Event('input'));cin.focus()});
}
function bubble(role,text,files){
 const e=$('empty');if(e)e.remove();const d=document.createElement('div');d.className='m '+(role==='me'?'me':'ai');
 (files||[]).forEach(f=>{if(f.url&&f.type.startsWith('image/')){const im=document.createElement('img');im.src=f.url;im.alt=f.name;d.appendChild(im)}else{const s=document.createElement('div');s.className='fname';s.textContent='\ud83d\udcc4 '+f.name;d.appendChild(s)}});
 if(text)d.appendChild(document.createTextNode(text));msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d}
function addActions(d,text){const a=document.createElement('div');a.className='acts';a.innerHTML='<button data-a="s"><i data-ic="bookmark"></i>Save</button><button data-a="c"><i data-ic="copy"></i>Copy</button><button data-a="v"><i data-ic="spark"></i>Double-check</button>';icons(a);
 a.querySelector('[data-a=s]').onclick=()=>{saved.unshift({id:Date.now(),text,at:Date.now()});persist();toast('Saved')};
 a.querySelector('[data-a=c]').onclick=()=>{try{navigator.clipboard.writeText(text);toast('Copied')}catch(e){toast('Copy not available')}};a.querySelector('[data-a=v]').onclick=()=>doubleCheck(text);d.appendChild(a)}
async function doubleCheck(text){
 if(!hasPro()){toast('Double-check is a Pro feature');go('pro');return}
 let q='';if(curChat){const k=curChat.m.findIndex(m=>m.r==='ai'&&m.t===text);for(let i=(k<0?curChat.m.length:k)-1;i>=0;i--){if(curChat.m[i].r==='me'){q=curChat.m[i].t;break}}}
 const box=bubble('ai','Double-checking...');
 try{const x=await apiPost('/api/chat',AH(),{mode:'verify',messages:[{role:'user',content:'Question:\n'+q+'\n\nAnswer to check:\n'+text}]},55000);renderAnswer(box,x.reply)}
 catch(e){box.textContent=e.message||'Could not reach the server. Try again.'}
 msgs.scrollTop=msgs.scrollHeight}
function renderFiles(){filesEl.innerHTML='';pending.forEach((f,i)=>{const t=document.createElement('div');t.className='thumb';
 if(f.type.startsWith('image/')){const im=document.createElement('img');im.src=f.url;im.alt=f.name;t.appendChild(im)}else t.textContent=f.name;
 const x=document.createElement('button');x.textContent='\u00d7';x.setAttribute('aria-label','Remove '+f.name);x.onclick=()=>{pending.splice(i,1);renderFiles()};t.appendChild(x);filesEl.appendChild(t)})}
function addFiles(l){[...l].forEach(f=>{if(pending.length<5)pending.push({name:f.name||'pasted-image.png',type:f.type||'',url:URL.createObjectURL(f),file:f})});renderFiles()}
$('attach').onclick=()=>$('fileIn').click();$('imgBtn').onclick=()=>$('imgIn').click();
['fileIn','imgIn'].forEach(id=>$(id).onchange=()=>{addFiles($(id).files);$(id).value=''});
const pg=$('chatpage');
['dragenter','dragover'].forEach(v=>pg.addEventListener(v,e=>{e.preventDefault();pg.classList.add('dropping')}));
['dragleave','drop'].forEach(v=>pg.addEventListener(v,e=>{e.preventDefault();pg.classList.remove('dropping')}));
pg.addEventListener('drop',e=>addFiles(e.dataTransfer.files));
cin.addEventListener('paste',e=>{const f=[...(e.clipboardData?e.clipboardData.files:[])];if(f.length){e.preventDefault();addFiles(f)}});
cin.addEventListener('input',()=>{cin.style.height='44px';cin.style.height=Math.min(cin.scrollHeight,140)+'px'});
cin.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg()}});
$('send').onclick=sendMsg;$('newChat').onclick=newChat;
function sendMsg(){
 const text=cin.value.trim();if(!text&&!pending.length)return;
 if(!curChat){curChat={id:Date.now(),title:(text||pending[0].name).slice(0,48),at:Date.now(),m:[]};chats.unshift(curChat);stats.today.chats++;log('Started chat: '+curChat.title)}
 const fs=pending.slice();bubble('me',text,fs);curChat.m.push({r:'me',t:text,f:fs.map(f=>f.name)});
 pending=[];renderFiles();cin.value='';cin.style.height='44px';
 const ai=bubble('ai','Thinking...');
 const history=curChat.m.map(m=>({role:m.r==='me'?'user':'assistant',content:m.t||'(attachment)'}));
 apiPost('/api/chat',AH(),{messages:history},55000)
  .then(d=>{const r=d.reply;renderAnswer(ai,r);addActions(ai,r);curChat.m.push({r:'ai',t:r});persist();msgs.scrollTop=msgs.scrollHeight})
  .catch(e=>{ai.textContent=e.message||'Could not reach the server. Check your connection and try again.'});
 persist();
}
function openChat(c){curChat=c;msgs.innerHTML='';c.m.forEach(m=>{const d=bubble(m.r,m.t,(m.f||[]).map(n=>({name:n,type:''})));if(m.r==='ai'){renderAnswer(d,m.t);addActions(d,m.t)}});go('chat')}
$('q').addEventListener('keydown',e=>{if(e.key==='Enter'&&$('q').value.trim()){newChat();go('chat');cin.value=$('q').value;$('q').value='';sendMsg()}});

/* voice */
const SR=window.SpeechRecognition||window.webkitSpeechRecognition;let rec=null;
$('mic').onclick=()=>{
 if(!SR){toast('Voice input is not supported in this browser');return}
 if(rec){rec.stop();return}
 rec=new SR();rec.lang=prefs.lang;rec.interimResults=false;$('mic').classList.add('rec');
 rec.onresult=e=>{cin.value=(cin.value+' '+e.results[0][0].transcript).trim();cin.dispatchEvent(new Event('input'))};
 rec.onend=()=>{rec=null;$('mic').classList.remove('rec')};rec.onerror=()=>{rec=null;$('mic').classList.remove('rec')};rec.start();
};

/* history + saved */
function renderHistory(){const l=$('histList');
 l.innerHTML=chats.length?'':'<div class="card empty-note">No chats yet. Start one in Tutor Chat.</div>';
 chats.forEach(c=>{const d=document.createElement('div');d.className='item';d.innerHTML='<i data-ic="chat"></i><div class="grow"><b>'+esc(c.title)+'</b><small>'+new Date(c.at).toLocaleDateString()+' &middot; '+c.m.length+' messages</small></div><button class="btn ghost sm" aria-label="Delete chat"><i data-ic="trash"></i></button>';
  icons(d);d.querySelector('.grow').onclick=()=>openChat(c);d.querySelector('button').onclick=()=>{chats=chats.filter(x=>x!==c);if(curChat===c)newChat();persist();renderHistory()};l.appendChild(d)})}
function renderSaved(){const l=$('savedList');
 l.innerHTML=saved.length?'':'<div class="card empty-note">Nothing saved yet. Tap Save under an answer in Tutor Chat.</div>';
 saved.forEach(s=>{const d=document.createElement('div');d.className='item';d.innerHTML='<i data-ic="bookmark"></i><div class="grow" style="cursor:default"><div class="txt">'+esc(s.text)+'</div><small>'+ago(s.at)+'</small></div><button class="btn ghost sm" aria-label="Remove"><i data-ic="trash"></i></button>';
  icons(d);d.querySelector('button').onclick=()=>{saved=saved.filter(x=>x!==s);persist();renderSaved()};l.appendChild(d)})}

/* ---------- quizzes (written by AI for your exact topic) ---------- */
let qz=null;
const inl=h=>String(h).replace(/<\/?p>/g,'');
function renderQuizHist(){$('qzHist').innerHTML=quizHist.length?quizHist.map(q=>'<div class="item"><i data-ic="quiz"></i><div class="grow" style="cursor:default"><b>'+esc(q.topic)+'</b><small>'+q.d+'</small></div><b>'+q.score+'/'+q.n+'</b></div>').join(''):'<div class="empty-note">You have not taken a quiz yet. Generate one to get started.</div>';icons($('qzHist'))}
async function startQuiz(o){
 const btn=o.exam?$('exGo'):$('qzGo');const old=btn.innerHTML;btn.disabled=true;btn.textContent='Building your quiz...';
 try{
  const d=await apiPost('/api/quiz',AH(),{topic:o.topic,level:o.level,n:o.n,exam:o.exam||'',subject:o.subject||''},55000);
  if(!d.questions)throw new Error('Could not build the quiz. Try again.');
  qz={topic:d.title,level:d.level,qs:d.questions,i:0,score:0,secs:o.secs,t:0,tm:null,done:false,picks:[],exam:!!o.exam};
  go('quizzes');$('quizSetup').hidden=true;$('quizRun').hidden=false;showQ();
 }catch(e){toast(e.message||'Could not build the quiz')}
 btn.disabled=false;btn.innerHTML=old}
function showQ(){
 clearInterval(qz.tm);const q=qz.qs[qz.i],box=$('quizRun');qz.done=false;
 box.innerHTML='<div class="head"><h3>'+esc(qz.topic)+' <span class="pill">'+esc(qz.level)+'</span></h3><span class="pill">'+(qz.i+1)+' / '+qz.qs.length+'</span></div><div class="qbar"><i style="width:'+(qz.i/qz.qs.length*100)+'%"></i></div>'+
  (qz.secs?'<div class="muted" id="qTimer" style="margin-bottom:8px"></div>':'')+'<div class="qtext" id="qText"></div><div id="qOpts"></div><div id="qWhy"></div><div class="row" style="margin-top:14px"><button class="btn ghost sm" id="qQuit">Quit</button><button class="btn sm" id="qNext" hidden>Next</button></div>';
 $('qText').innerHTML=mdToHtml(q.q);
 q.options.forEach((o,i)=>{const b=document.createElement('button');b.className='q-opt';b.innerHTML='<b>'+'ABCD'[i]+'.</b> '+inl(mdToHtml(o));b.onclick=()=>pick(i);$('qOpts').appendChild(b)});
 $('qQuit').onclick=endQuiz;$('qNext').onclick=()=>{qz.i++;qz.i<qz.qs.length?showQ():finishQuiz()};
 if(qz.secs){qz.t=qz.secs;const tick=()=>{if(qz.t<=0){clearInterval(qz.tm);$('qTimer').textContent="Time's up!";$('qTimer').style.color='#e5484d';pick(-1);return}$('qTimer').textContent='Time left: '+qz.t+'s';qz.t--};tick();qz.tm=setInterval(tick,1000)}
}
function pick(i){if(qz.done)return;qz.done=true;clearInterval(qz.tm);const q=qz.qs[qz.i];qz.picks[qz.i]=i;if(i===q.answer)qz.score++;
 [...$('qOpts').children].forEach((b,j)=>{b.disabled=true;if(j===q.answer)b.classList.add('ok');else if(j===i)b.classList.add('bad')});
 $('qWhy').innerHTML=hasPro()?'<div class="why">'+mdToHtml('**Why:** '+(q.explanation||'')+(qz.exam&&q.marking?'\n\n**How it is marked:** '+q.marking:''))+'</div>':'<div class="why muted">Upgrade to Pro to see why each answer is right.</div>';
 $('qNext').hidden=false;$('qNext').textContent=qz.i+1<qz.qs.length?'Next':'See score'}
function finishQuiz(){
 const n=qz.qs.length;stats.quizzes++;stats.questions+=n;stats.today.quizzes++;stats.today.qs+=n;
 quizHist.unshift({topic:qz.topic+' ('+qz.level+')',score:qz.score,n,d:new Date().toLocaleDateString()});log('Completed quiz: '+qz.topic+' ('+qz.score+'/'+n+')');persist();renderQuota();
 const missed=qz.qs.map((q,k)=>({q,k})).filter(x=>qz.picks[x.k]!==x.q.answer);
 let rev='';
 if(missed.length){
  if(hasPro()){rev='<div class="rev"><h3 style="margin-bottom:8px">Explain my mistakes</h3>'+missed.map(x=>{const mine=qz.picks[x.k];return '<div class="why"><div class="qtext">'+mdToHtml(x.q.q)+'</div><div><b>Your answer:</b> '+(mine>=0?inl(mdToHtml(x.q.options[mine])):'no answer')+'</div><div><b>Correct answer:</b> '+inl(mdToHtml(x.q.options[x.q.answer]))+'</div>'+mdToHtml(x.q.explanation||'')+'</div>'}).join('')+'</div>'}
  else rev='<p class="muted">You missed '+missed.length+' question'+(missed.length>1?'s':'')+'. Upgrade to Pro to see an explanation for every mistake.</p>'}
 $('quizRun').innerHTML='<div class="stackv" style="align-items:center;text-align:center"><div class="muted">Your score</div><div class="scorebig">'+qz.score+' / '+n+'</div><p class="muted">'+(qz.score>=n*.7?'Great work!':'Keep practising. You will get there.')+'</p><button class="btn" id="qDone">Back to quizzes</button></div>'+rev;
 $('qDone').onclick=endQuiz}
function endQuiz(){if(qz)clearInterval(qz.tm);qz=null;$('quizRun').hidden=true;$('quizSetup').hidden=false;renderQuizHist()}
$('qzGo').onclick=()=>{
 const t=$('qzTopic').value.trim();if(!t){toast('Type a topic first');return}
 if(quizzesLeftToday()<=0){toast('You have used today\'s quizzes. '+(hasPro()?'More unlock tomorrow.':'Upgrade to Pro for more.'));if(!hasPro())go('pro');return}
 startQuiz({topic:t,level:$('qzDiff').value,n:+$('qzN').value,secs:+$('qzSecs').value||0})};
$('exGo').onclick=()=>{
 if(quizzesLeftToday()<=0){toast('You have used today\'s quizzes. '+(hasPro()?'More unlock tomorrow.':'Upgrade to Pro for more.'));if(!hasPro())go('pro');return}
 startQuiz({topic:$('exTopic').value.trim(),level:$('exLevel').value,n:+$('exN').value,secs:0,exam:$('exExam').value,subject:$('exSub').value})};
function renderQuota(){
 const left=quizzesLeftToday(),limit=dailyQuizLimit();
 const msg=limit===Infinity?'Unlimited quizzes today (admin).':left>0?left+' of '+limit+' quizzes left today.':'You have used all '+limit+' quizzes for today. Come back tomorrow'+(hasPro()?'':', or upgrade to Pro for more.')+'';
 const q=$('qzQuota');q.innerHTML='<div class="row" style="flex-wrap:nowrap;gap:10px;align-items:center"><i data-ic="quiz" style="color:var(--accent)"></i><div class="grow">'+esc(msg)+'</div>'+(hasPro()?'':'<button class="btn ghost sm" data-go="pro">Upgrade</button>')+'</div>';icons(q);
 $('exQuota').textContent=limit===Infinity?'Unlimited (admin).':left+' of '+limit+' quizzes left today.';
}

/* ---------- code lab ---------- */
let runFrame=null;
addEventListener('message',e=>{if(runFrame&&e.source===runFrame.contentWindow&&e.data&&e.data.acex){const o=$('codeOut');o.textContent+=(o.textContent?'\n':'')+e.data.t}});
$('runCode').onclick=()=>{
 const lang=$('codeLang').value,o=$('codeOut');
 if(lang!=='JavaScript'){o.textContent='Running '+lang+' needs the backend. Use "Fix with Ace_X" or "Explain" to work on it in Tutor Chat.';return}
 o.textContent='';if(runFrame)runFrame.remove();runFrame=document.createElement('iframe');runFrame.sandbox='allow-scripts';runFrame.style.display='none';
 const code=$('codeIn').value.replace(/<\/script/gi,'<\\/script');
 runFrame.srcdoc='<script>const s=t=>parent.postMessage({acex:1,t},"*");console.log=(...a)=>s(a.map(x=>typeof x==="object"?JSON.stringify(x):String(x)).join(" "));onerror=m=>s("Error: "+m);<\/script><script>'+code+'<\/script>';
 document.body.appendChild(runFrame);setTimeout(()=>{if(!o.textContent)o.textContent='(no output)'},800);log('Ran code in Code Lab');
};
function codeToChat(p){newChat();go('chat');cin.value=p+':\n```\n'+$('codeIn').value+'\n```';cin.dispatchEvent(new Event('input'))}
$('fixCode').onclick=()=>codeToChat('Fix my code');$('explCode').onclick=()=>codeToChat('Explain this code');

/* ---------- formulas ---------- */
const FORM=[["Quadratic formula","x=\\frac{-b\\pm\\sqrt{b^{2}-4ac}}{2a}","Mathematics"],["Pythagoras","a^{2}+b^{2}=c^{2}","Mathematics"],["Area of a circle","A=\\pi r^{2}","Mathematics"],["Trig identity","\\sin^{2}\\theta+\\cos^{2}\\theta=1","Mathematics"],["Sum of an AP","S_n=\\frac{n}{2}\\left(2a+(n-1)d\\right)","Mathematics"],["Speed","v=\\frac{d}{t}","Physics"],["Newton's second law","F=ma","Physics"],["Kinetic energy","KE=\\frac{1}{2}mv^{2}","Physics"],["Ohm's law","V=IR","Physics"],["Density","\\rho=\\frac{m}{V}","Physics"],["Moles","n=\\frac{m}{M}","Chemistry"],["Ideal gas law","PV=nRT","Chemistry"]];
const fCache={};
function renderFormulas(){const s=$('fSearch').value.toLowerCase();
 $('fGrid').innerHTML=FORM.filter(f=>(f[0]+f[2]).toLowerCase().includes(s)).map((f,i)=>'<button class="formula" data-q="'+esc(f[0])+'"><b>'+esc(f[0])+'</b><div class="math">'+texHTML(f[1],true)+'</div><small>'+f[2]+' &middot; tap to learn more</small></button>').join('');
 $('fGrid').querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>{$('fSearch').value=b.dataset.q;explainFormula(b.dataset.q)})}
async function explainFormula(q){
 q=(q||'').trim();if(!q){toast('Type a formula or law first');return}
 const o=$('fOut');o.hidden=false;o.classList.add('md');o.textContent='Working it out...';o.scrollIntoView({behavior:'smooth',block:'nearest'});
 if(fCache[q.toLowerCase()]){renderAnswer(o,fCache[q.toLowerCase()]);return}
 $('fGo').disabled=true;
 try{const d=await apiPost('/api/formula',AH(),{query:q},55000);fCache[q.toLowerCase()]=d.reply;renderAnswer(o,d.reply);log('Formula Hub: '+q.slice(0,40))}
 catch(e){o.textContent=e.message||'Could not reach the server. Try again.'}
 $('fGo').disabled=false}
$('fSearch').oninput=renderFormulas;
$('fSearch').addEventListener('keydown',e=>{if(e.key==='Enter')explainFormula($('fSearch').value)});
$('fGo').onclick=()=>explainFormula($('fSearch').value);
renderFormulas();

/* ---------- image studio ---------- */
$('imGo').onclick=async()=>{const p=$('imPrompt').value.trim();if(!p){toast('Describe your image first');return}
 const o=$('imOut');o.style.display='block';o.classList.remove('md');o.textContent='Drawing...';$('imGo').disabled=true;
 try{const d=await apiPost('/api/chat',AH(),{mode:'diagram',messages:[{role:'user',content:'Draw a clear, colourful, labelled diagram as one SVG for: '+p}]},55000);renderAnswer(o,d.reply);log('Image Studio: '+p.slice(0,40))}catch(e){o.textContent=e.message||'Could not reach the server. Try again.'}
 $('imGo').disabled=false};

/* ---------- planner ---------- */
let cy=new Date().getFullYear(),cm=new Date().getMonth(),sel=dstr(new Date());
function renderCal(){
 $('calTitle').textContent=new Date(cy,cm,1).toLocaleDateString('en-GB',{month:'long',year:'numeric'});
 let h='SMTWTFS'.split('').map(d=>'<div class="dh">'+d+'</div>').join('');const f=new Date(cy,cm,1).getDay(),n=new Date(cy,cm+1,0).getDate();
 for(let i=0;i<f;i++)h+='<div></div>';
 for(let d=1;d<=n;d++){const k=cy+'-'+String(cm+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
  h+='<button data-d="'+k+'" class="'+(k===dstr(new Date())?'today ':'')+(k===sel?'sel ':'')+((planData[k]||[]).length?'has':'')+'">'+d+'</button>'}
 $('calGrid').innerHTML=h;$('calGrid').querySelectorAll('button').forEach(b=>b.onclick=()=>{sel=b.dataset.d;renderCal()});
 const dt=new Date(sel+'T00:00:00');$('dayTitle').textContent=dt.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
 const l=planData[sel]||[];
 $('dayList').innerHTML=l.length?'':'<div class="empty-note">Nothing planned for this day yet.</div>';
 l.forEach(s=>{const d=document.createElement('div');d.className='item';d.innerHTML='<input type="checkbox" style="width:18px;height:18px;padding:0;accent-color:var(--accent)"'+(s.done?' checked':'')+'><div class="grow" style="cursor:default"><b'+(s.done?' style="text-decoration:line-through"':'')+'>'+esc(s.t)+'</b><small>'+esc(s.s)+'</small></div><button class="btn ghost sm" aria-label="Delete"><i data-ic="trash"></i></button>';
  icons(d);d.querySelector('input').onchange=e=>{s.done=e.target.checked;persist();renderCal()};d.querySelector('button').onclick=()=>{planData[sel]=l.filter(x=>x!==s);persist();renderCal()};$('dayList').appendChild(d)})}
$('calPrev').onclick=()=>{cm--;if(cm<0){cm=11;cy--}renderCal()};$('calNext').onclick=()=>{cm++;if(cm>11){cm=0;cy++}renderCal()};
$('plAdd').onclick=()=>{const t=$('plText').value.trim();if(!t){toast('Type a session first');return}(planData[sel]=planData[sel]||[]).push({id:Date.now(),t,s:$('plSub').value,done:false});$('plText').value='';log('Planned: '+t);persist();renderCal()};
$('plText').addEventListener('keydown',e=>{if(e.key==='Enter')$('plAdd').click()});

/* ---------- terminal simulator (offline, no real commands run) ---------- */
const TABS=['<span class="p">ace_x@localhost:~$</span> neofetch\n  OS:     Ace_X AI (simulator)\n  Shell:  zsh\n  Uptime: 2h 34m\n  Memory: 1.2G / 8G\n<span class="p">ace_x@localhost:~$</span> <span class="caret"></span>',
 '<span class="p">ace_x@localhost:~$</span> tools --list\n  nmap        port scanner\n  hashcat     hash recovery\n  wireshark   packet analyzer\n  metasploit  exploit framework\nAll output below is sample data for learning. Nothing here is a live scan.\n<span class="p">ace_x@localhost:~$</span> <span class="caret"></span>',
 '<span class="p">ace_x@localhost:~$</span> ls scripts/\n  hello.py   quiz_gen.py   notes_sync.sh\n<span class="p">ace_x@localhost:~$</span> <span class="caret"></span>'];
let termTab=0;
function setTermTab(i){termTab=i;document.querySelectorAll('#tabs button').forEach((x,j)=>x.classList.toggle('on',j===i));$('termBox').innerHTML=TABS[i]}
document.querySelectorAll('#tabs button').forEach((b,i)=>b.onclick=()=>setTermTab(i));
setTermTab(0);

const FS={'notes.txt':'Study notes go here.','todo.md':'- Revise kinetic theory\n- Practice quiz: Hard level\n- Try Formula Hub: sine rule','scripts':null,'projects':null};
const prompt=()=>'<span class="p">ace_x@localhost:~$</span> ';
function termPrint(line){const b=$('termBox');const car=b.querySelector('.caret');const row=document.createElement('div');row.textContent=line;if(car)b.insertBefore(row,car);else b.appendChild(row);b.scrollTop=b.scrollHeight}
function termEcho(cmd){const b=$('termBox');const car=b.querySelector('.caret');const row=document.createElement('div');row.innerHTML=prompt()+esc(cmd);if(car)b.insertBefore(row,car);else b.appendChild(row)}
const TOOL_OUT={
 nmap:a=>'Starting simulated Nmap scan on '+(a||'192.168.1.1')+'\nPORT     STATE  SERVICE\n22/tcp   open   ssh\n80/tcp   open   http\n443/tcp  open   https\n(This is sample data. No real scan was sent.)',
 metasploit:()=>'msf6 > use exploit/sample/demo\n[*] This is a simulated Metasploit console.\n[*] No real exploit or network traffic is used here.\nUse a legal lab such as TryHackMe or HackTheBox to practise for real.',
 hashcat:a=>'hashcat (simulated) starting...\nSession: demo\nHash.Mode: 0 (MD5)\nTarget: '+(a||'sample.hash')+'\nStatus: Simulated only, no real cracking takes place.',
 wireshark:()=>'Capturing on "Simulated Interface"\nNo. Time Source Destination Protocol Info\n1   0.000 10.0.0.2 10.0.0.1  TCP      sample packet\n2   0.004 10.0.0.1 10.0.0.2  TCP      sample packet\n(Example packets only. No real traffic is captured here.)'
};
function runTermCmd(raw){
 const cmd=raw.trim();if(!cmd)return;termEcho(cmd);const parts=cmd.split(/\s+/);const name=parts[0].toLowerCase();const arg=parts.slice(1).join(' ');
 if(name==='help')termPrint('Try: help, ls, cat <file>, whoami, date, clear, neofetch, nmap <target>, hashcat <file>, wireshark, metasploit, tools --list\\nThis terminal is a simulator for learning. It does not run real commands.');
 else if(name==='ls')termPrint(Object.keys(FS).join('   '));
 else if(name==='cat'){const f=FS[arg];termPrint(f===null?arg+': is a directory':f!==undefined?f:'cat: '+(arg||'')+': No such file')}
 else if(name==='whoami')termPrint(((me()&&me().name)||'student').toLowerCase().replace(/\s+/g,'_'));
 else if(name==='date')termPrint(new Date().toString());
 else if(name==='pwd')termPrint('/home/'+(((me()&&me().name)||'student').toLowerCase().replace(/\s+/g,'_')));
 else if(name==='clear'){$('termBox').innerHTML=prompt()+'<span class="caret"></span>';return}
 else if(['nmap','hashcat','wireshark','metasploit'].includes(name))termPrint(TOOL_OUT[name](arg));
 else if(name==='tools'&&arg.includes('--list'))termPrint(TABS[1].replace(/<[^>]+>/g,''));
 else termPrint(name+': command not found. Type help for a list of commands.');
 const b=$('termBox');const car=b.querySelector('.caret');if(car){const row=document.createElement('div');row.innerHTML=prompt();row.appendChild(car);b.appendChild(row)}b.scrollTop=b.scrollHeight;
}
function termRun(){const i=$('termIn');runTermCmd(i.value);i.value=''}
$('termRun').onclick=termRun;
$('termIn').addEventListener('keydown',e=>{if(e.key==='Enter')termRun()});
document.querySelectorAll('[data-tool]').forEach(b=>b.onclick=()=>runTermCmd(b.dataset.tool));

/* ---------- boot ---------- */
applyPrefs();showEmpty();setMode('login');
if(me())enterApp();else handlePayReturn();
