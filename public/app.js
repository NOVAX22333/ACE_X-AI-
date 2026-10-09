/* ---------- helpers ---------- */
const $=id=>document.getElementById(id);
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
 formula:"M18 4H6l7 8-7 8h12",exam:"M6 3h12v18H6zM9 8h6M9 12h6M9 16h4",logout:"M10 4H5v16h5M15 8l4 4-4 4M19 12H9",play:"M7 4l13 8-13 8z"};
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
let adminOn=false, curChat=null;
const me=()=>session&&accounts[session]?accounts[session]:null;
const hasPro=()=>adminOn||(me()&&me().plan==='pro'&&(!me().proUntil||me().proUntil>Date.now()));
const first=n=>{n=(n||'Student').trim().split(/\s+/)[0];return n.charAt(0).toUpperCase()+n.slice(1).toLowerCase()};
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
 root.style.setProperty('--ans-font',{sans:'var(--font)',serif:'Georgia,"Times New Roman",serif',mono:'var(--mono)'}[prefs.font]);
 root.style.setProperty('--ans-size',{small:'13px',medium:'14.5px',large:'16.5px'}[prefs.size]);
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
function enterApp(){$('auth').hidden=true;$('app').hidden=false;rollDay();refreshUser();go('home')}
function logout(){session=null;adminOn=false;ls.set('acex-session',null);$('app').hidden=true;$('auth').hidden=false;setMode('login');$('aEmail').value=''}
$('logout').onclick=logout;

function refreshUser(){
 const u=me();if(!u)return;const n=first(u.name);
 ['sAv','tAv'].forEach(i=>$(i).textContent=n.charAt(0));$('sName').textContent=u.name;$('tName').textContent=n;$('tRole').textContent=u.role;$('hello').textContent=n;
 $('sPlan').textContent=hasPro()?'Pro plan':'Free plan';$('sUp').hidden=hasPro();
 $('sName2').value=u.name;$('sRole').value=u.role;
 $('planLine').textContent=hasPro()?(adminOn&&u.plan!=='pro'?'Pro access through admin.':'You are on Pro'+(u.proUntil?' until '+new Date(u.proUntil).toLocaleDateString():'')+'.'):'You are on the Free plan. Terminal, Code Lab, Formula Hub, Exam Practice and Image Studio are Pro features.';
 $('proSub').textContent=hasPro()?'Pro is active. Buy more time any time.':'Unlock every feature.';
 applyLocks();$('admStats').textContent='Registered accounts on this device: '+Object.keys(accounts).length;
}
$('saveProf').onclick=()=>{const u=me();u.name=$('sName2').value.trim()||u.name;u.role=$('sRole').value;persist();refreshUser();renderHome();toast('Saved')};
document.querySelectorAll('[data-days]').forEach(b=>b.onclick=()=>{const u=me();const base=(u.plan==='pro'&&u.proUntil&&u.proUntil>Date.now())?u.proUntil:Date.now();u.plan='pro';u.proUntil=base+(+b.dataset.days)*864e5;persist();refreshUser();toast('Pro active (demo)')});

/* admin (demo only: move this check to your server) */
const ADMIN_CODE='change-this-code';
$('admGo').onclick=()=>{if($('admCode').value===ADMIN_CODE){adminOn=true;$('admCode').value='';showAdmin();refreshUser();toast('Admin unlocked')}else toast('Wrong admin code')};
function showAdmin(){$('adminLocked').hidden=adminOn;$('adminOpen').hidden=!adminOn}
$('admLock').onclick=()=>{adminOn=false;showAdmin();refreshUser()};
$('admPro').onclick=()=>{const u=me();u.plan=u.plan==='pro'?'free':'pro';delete u.proUntil;persist();refreshUser();toast('Plan: '+u.plan)};
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
 if(k==='home')renderHome();if(k==='history')renderHistory();if(k==='saved')renderSaved();if(k==='quizzes')renderQuizHist();
 if(k==='planner')renderCal();if(k==='progress')renderProgress();if(k==='settings')showAdmin();
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
function addActions(d,text){const a=document.createElement('div');a.className='acts';a.innerHTML='<button data-a="s"><i data-ic="bookmark"></i>Save</button><button data-a="c"><i data-ic="copy"></i>Copy</button>';icons(a);
 a.querySelector('[data-a=s]').onclick=()=>{saved.unshift({id:Date.now(),text,at:Date.now()});persist();toast('Saved')};
 a.querySelector('[data-a=c]').onclick=()=>{try{navigator.clipboard.writeText(text);toast('Copied')}catch(e){toast('Copy not available')}};d.appendChild(a)}
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
 fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})})
  .then(r=>r.json()).then(d=>{const r=d.reply||d.error||'No reply.';ai.textContent=r;addActions(ai,r);curChat.m.push({r:'ai',t:r});persist();msgs.scrollTop=msgs.scrollHeight})
  .catch(()=>{ai.textContent='Could not reach the server. Check your connection and try again.'});
 persist();
}
function openChat(c){curChat=c;msgs.innerHTML='';c.m.forEach(m=>{const d=bubble(m.r,m.t,(m.f||[]).map(n=>({name:n,type:''})));if(m.r==='ai')addActions(d,m.t)});go('chat')}
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

/* ---------- quizzes ---------- */
const BANK=[["What is 7 \u00d7 8?",["54","56","58","64"],1],["Which gas do plants absorb for photosynthesis?",["Oxygen","Nitrogen","Carbon dioxide","Hydrogen"],2],["Solve: 2x + 6 = 14. What is x?",["3","4","5","6"],1],["What is the SI unit of force?",["Joule","Newton","Watt","Pascal"],1],["In Python, which keyword defines a function?","func def function lambda".split(" "),1],["What is the chemical symbol for sodium?",["So","Sd","Na","N"],2],["sin\u00b2\u03b8 + cos\u00b2\u03b8 equals?",["0","1","2","tan \u03b8"],1],["Which particle has a negative charge?",["Proton","Neutron","Electron","Nucleus"],2],["What does HTML stand for?",["Hyper Text Markup Language","High Tech Modern Language","Hyper Transfer Markup Link","Home Tool Markup Language"],0],["The powerhouse of the cell is the...",["Nucleus","Ribosome","Mitochondrion","Vacuole"],2],["What is 3\u00b2 + 4\u00b2?",["12","25","49","7"],1],["Speed is distance divided by...",["Mass","Time","Force","Energy"],1]];
let qz=null;
function renderQuizHist(){$('qzHist').innerHTML=quizHist.length?quizHist.map(q=>'<div class="item"><i data-ic="quiz"></i><div class="grow" style="cursor:default"><b>'+esc(q.topic)+'</b><small>'+q.d+'</small></div><b>'+q.score+'/'+q.n+'</b></div>').join(''):'<div class="empty-note">You have not taken a quiz yet. Generate one to get started.</div>';icons($('qzHist'))}
function startQuiz(topic,n,secs){
 const qs=BANK.slice().sort(()=>Math.random()-.5).slice(0,Math.min(n,BANK.length));
 qz={topic:topic||'General knowledge',qs,i:0,score:0,secs,t:0,tm:null,done:false};go('quizzes');$('quizSetup').hidden=true;$('quizRun').hidden=false;showQ()}
function showQ(){
 clearInterval(qz.tm);const q=qz.qs[qz.i],box=$('quizRun');qz.done=false;
 box.innerHTML='<div class="head"><h3>'+esc(qz.topic)+'</h3><span class="pill">'+(qz.i+1)+' / '+qz.qs.length+'</span></div><div class="qbar"><i style="width:'+(qz.i/qz.qs.length*100)+'%"></i></div>'+
  (qz.secs?'<div class="muted" id="qTimer" style="margin-bottom:8px"></div>':'')+'<h2 style="font-size:18px;line-height:1.35">'+esc(q[0])+'</h2><div id="qOpts"></div><div class="row" style="margin-top:14px"><button class="btn ghost sm" id="qQuit">Quit</button><button class="btn sm" id="qNext" hidden>Next</button></div>';
 q[1].forEach((o,i)=>{const b=document.createElement('button');b.className='q-opt';b.textContent=o;b.onclick=()=>pick(i);$('qOpts').appendChild(b)});
 $('qQuit').onclick=endQuiz;$('qNext').onclick=()=>{qz.i++;qz.i<qz.qs.length?showQ():finishQuiz()};
 if(qz.secs){qz.t=qz.secs;const tick=()=>{$('qTimer').textContent='Time left: '+qz.t+'s';if(qz.t<=0){clearInterval(qz.tm);pick(-1)}qz.t--};tick();qz.tm=setInterval(tick,1000)}
}
function pick(i){if(qz.done)return;qz.done=true;clearInterval(qz.tm);const q=qz.qs[qz.i];if(i===q[2])qz.score++;
 [...$('qOpts').children].forEach((b,j)=>{b.disabled=true;if(j===q[2])b.classList.add('ok');else if(j===i)b.classList.add('bad')});
 $('qNext').hidden=false;$('qNext').textContent=qz.i+1<qz.qs.length?'Next':'See score'}
function finishQuiz(){
 const n=qz.qs.length;stats.quizzes++;stats.questions+=n;stats.today.quizzes++;stats.today.qs+=n;
 quizHist.unshift({topic:qz.topic,score:qz.score,n,d:new Date().toLocaleDateString()});log('Completed quiz: '+qz.topic+' ('+qz.score+'/'+n+')');persist();
 $('quizRun').innerHTML='<div class="stackv" style="align-items:center;text-align:center"><div class="muted">Your score</div><div class="scorebig">'+qz.score+' / '+n+'</div><p class="muted">'+(qz.score>=n*.7?'Great work!':'Keep practising. You will get there.')+'</p><button class="btn" id="qDone">Back to quizzes</button></div>';
 $('qDone').onclick=endQuiz}
function endQuiz(){if(qz)clearInterval(qz.tm);qz=null;$('quizRun').hidden=true;$('quizSetup').hidden=false;renderQuizHist()}
$('qzGo').onclick=()=>startQuiz($('qzTopic').value.trim(),+$('qzN').value,+$('qzSecs').value||0);
$('exGo').onclick=()=>startQuiz($('exExam').value+' '+$('exSub').value,10,0);

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
const FORM=[["Quadratic formula","x = (\u2212b \u00b1 \u221a(b\u00b2 \u2212 4ac)) / 2a","Mathematics"],["Pythagoras","a\u00b2 + b\u00b2 = c\u00b2","Mathematics"],["Area of a circle","A = \u03c0r\u00b2","Mathematics"],["Trig identity","sin\u00b2\u03b8 + cos\u00b2\u03b8 = 1","Mathematics"],["Sum of an AP","S\u2099 = n/2 (2a + (n \u2212 1)d)","Mathematics"],["Speed","v = d / t","Physics"],["Newton's second law","F = ma","Physics"],["Kinetic energy","KE = \u00bd mv\u00b2","Physics"],["Ohm's law","V = IR","Physics"],["Density","\u03c1 = m / V","Physics"],["Moles","n = m / M","Chemistry"],["Ideal gas law","PV = nRT","Chemistry"]];
function renderFormulas(){const s=$('fSearch').value.toLowerCase();$('fGrid').innerHTML=FORM.filter(f=>(f[0]+f[2]+f[1]).toLowerCase().includes(s)).map(f=>'<div class="formula"><b>'+f[0]+'</b><div class="math">'+esc(f[1])+'</div><small>'+f[2]+'</small></div>').join('')||'<div class="empty-note">No formulas found.</div>'}
$('fSearch').oninput=renderFormulas;renderFormulas();

/* ---------- image studio ---------- */
$('imGo').onclick=()=>{const p=$('imPrompt').value.trim();if(!p){toast('Describe your image first');return}const o=$('imOut');o.style.display='block';o.textContent='Image generation needs the backend (an image model API). Your prompt was: '+p}

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

/* ---------- terminal tabs ---------- */
const T=['<span class="p">ace_x@localhost:~$</span> neofetch\n  OS:     Ace_X AI\n  Shell:  zsh\n  Uptime: 2h 34m\n  Memory: 1.2G / 8G\n<span class="p">ace_x@localhost:~$</span> <span class="caret"></span>',
 '<span class="p">ace_x@localhost:~$</span> tools --list\n  nmap        port scanner\n  hashcat     hash recovery\n  wireshark   packet analyzer\n  metasploit  exploit framework\n<span class="p">ace_x@localhost:~$</span> <span class="caret"></span>',
 '<span class="p">ace_x@localhost:~$</span> ls scripts/\n  hello.py   quiz_gen.py   notes_sync.sh\n<span class="p">ace_x@localhost:~$</span> <span class="caret"></span>'];
$('termBox').innerHTML=T[0];
document.querySelectorAll('#tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#tabs button').forEach(x=>x.classList.remove('on'));b.classList.add('on');$('termBox').innerHTML=T[b.dataset.t]});

/* ---------- boot ---------- */
applyPrefs();showEmpty();setMode('login');
if(me())enterApp();
