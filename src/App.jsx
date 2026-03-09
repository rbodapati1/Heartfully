import { useState, useEffect, useRef } from "react";
import { SpeedInsights } from '@vercel/speed-insights/react';

const LANGUAGES = [
  { id:"en", label:"English", flag:"🇬🇧", nativeName:"English" },
  { id:"es", label:"Spanish", flag:"🇪🇸", nativeName:"Español" },
  { id:"hi", label:"Hindi",   flag:"🇮🇳", nativeName:"हिन्दी"   },
  { id:"te", label:"Telugu",  flag:"🇮🇳", nativeName:"తెలుగు"  },
];
const LANG_INSTRUCTION = {
  en:"Write the message in English.",
  es:"Write the message entirely in Spanish (Español). Use natural, warm, native Spanish — not a translation.",
  hi:"Write the message entirely in Hindi (हिन्दी). Use natural Devanagari script, warm and native-sounding — not a translation.",
  te:"Write the message entirely in Telugu (తెలుగు). Use natural Telugu script, warm and native-sounding — not a translation.",
};
const TONES = [
  {id:"tender",label:"Tender",emoji:"🌸"},{id:"playful",label:"Playful",emoji:"😄"},
  {id:"nostalgic",label:"Nostalgic",emoji:"🌅"},{id:"funny",label:"Funny",emoji:"😂"},
  {id:"encouraging",label:"Encouraging",emoji:"💪"},{id:"poetic",label:"Poetic",emoji:"✨"},
  {id:"grateful",label:"Grateful",emoji:"🙏"},{id:"passionate",label:"Passionate",emoji:"🔥"},
];
const RC = {
  wife:       {emoji:"💍",label:"Wife",       color:"#c9746b",bg:"#fdf0ee",tone:"deeply romantic, tender, and devoted",                   ns:["my love","sweetheart","darling","babe","my heart"]},
  husband:    {emoji:"💍",label:"Husband",    color:"#6b8fc9",bg:"#eef3fd",tone:"deeply romantic, warm, and devoted",                     ns:["my love","babe","darling","honey","sweetheart"]},
  lover:      {emoji:"🌹",label:"Lover",      color:"#c96b6b",bg:"#fdeaea",tone:"passionate, intimate, and deeply felt",                  ns:["my love","darling","mi amor","beloved"]},
  girlfriend: {emoji:"💕",label:"Girlfriend", color:"#c96b9a",bg:"#fdf0f6",tone:"sweet, playful, romantic, and affectionate",             ns:["babe","love","beautiful","sunshine","sweetheart"]},
  boyfriend:  {emoji:"💙",label:"Boyfriend",  color:"#6b9ac9",bg:"#f0f6fd",tone:"warm, affectionate, and genuine",                        ns:["babe","love","handsome","my guy","honey"]},
  bestfriend: {emoji:"🌟",label:"Best Friend",color:"#c9a84c",bg:"#fdf8e8",tone:"joyful, loyal, and deeply familiar",                    ns:["bestie","my person","partner in crime","soul sister","brother"]},
  friend:     {emoji:"🤝",label:"Friend",     color:"#6bb08a",bg:"#f0fdf6",tone:"warm, genuine, and uplifting",                          ns:["friend","my dear","hey you"]},
  child:      {emoji:"🌱",label:"Child",      color:"#7ab06b",bg:"#f4fdf0",tone:"nurturing, encouraging, full of unconditional love",     ns:["my love","sweetheart","little one","my heart","sunshine"]},
  parent:     {emoji:"🏡",label:"Parent",     color:"#b09060",bg:"#fdf8f0",tone:"grateful, loving, honouring the parent-child bond",      ns:["Mom","Dad","Mama","Papa","my dear"]},
  sibling:    {emoji:"🌿",label:"Sibling",    color:"#60a8a8",bg:"#f0fdfd",tone:"familiar, warm, playfully affectionate",                ns:["sis","bro","twin","my sibling"]},
  grandparent:{emoji:"🕊️",label:"Grandparent",color:"#9a7ab0",bg:"#f8f0fd",tone:"reverent, grateful, warm for their wisdom and love",   ns:["Grandma","Grandpa","Nana","Pop-pop","Gran"]},
  mentor:     {emoji:"💡",label:"Mentor",     color:"#b08a40",bg:"#fdf8ef",tone:"respectful, grateful, acknowledging their profound impact",ns:["my mentor","my guide","my teacher"]},
};
const PLATFORMS = [
  {id:"sms",     label:"iMessage / SMS",icon:"💬",color:"#34c759",bg:"#edfaf2",needs:"phone", getUrl:(p,m)=>`sms:${encodeURIComponent(p.phone)}${/iPhone|iPad|Mac/.test(navigator.userAgent)?"&":"?"}body=${encodeURIComponent(m)}`},
  {id:"whatsapp",label:"WhatsApp",      icon:"🟢",color:"#25d366",bg:"#edfaf2",needs:"phone", getUrl:(p,m)=>`https://wa.me/${p.phone.replace(/\D/g,"")}?text=${encodeURIComponent(m)}`},
  {id:"telegram",label:"Telegram",      icon:"✈️",color:"#0088cc",bg:"#e8f4fb",needs:"phone", getUrl:(p,m)=>`tg://msg?to=${p.phone.replace(/\D/g,"")}&text=${encodeURIComponent(m)}`},
  {id:"signal",  label:"Signal",        icon:"🔵",color:"#3a76f0",bg:"#edf2fd",needs:"phone", getUrl:(p,m)=>`sgnl://send?phone=${p.phone.replace(/\D/g,"")}&message=${encodeURIComponent(m)}`},
  {id:"email",   label:"Email",         icon:"✉️",color:"#c9746b",bg:"#fdf0ee",needs:"email", getUrl:(p,m)=>`mailto:${encodeURIComponent(p.email)}?subject=${encodeURIComponent("Thinking of you")}&body=${encodeURIComponent(m)}`},
];
const THEMES = [
  {id:"warm",    name:"Warm Cream", bg1:"#fdf6ee",bg2:"#f5ebe0",bg3:"#ede0d4",surface:"rgba(255,255,255,0.78)",text:"#2d1f14",sub:"#8a6a50",muted:"#b09070",border:"#d4b8a8",accent:"#c9746b",dark:"#2d1f14",darkText:"#fdf6ee"},
  {id:"rose",    name:"Deep Rose",  bg1:"#fdf0f2",bg2:"#fae0e4",bg3:"#f5ccd4",surface:"rgba(255,255,255,0.82)",text:"#2d1020",sub:"#8a4055",muted:"#b07080",border:"#e0b0b8",accent:"#c94060",dark:"#3d1025",darkText:"#fdf0f2"},
  {id:"forest",  name:"Forest",     bg1:"#f0f7f0",bg2:"#dff0df",bg3:"#cce5cc",surface:"rgba(255,255,255,0.82)",text:"#142814",sub:"#406040",muted:"#709070",border:"#a8cca8",accent:"#3a8a3a",dark:"#1a3a1a",darkText:"#f0f7f0"},
  {id:"ocean",   name:"Ocean",      bg1:"#f0f6fd",bg2:"#ddeeff",bg3:"#c8e2f8",surface:"rgba(255,255,255,0.82)",text:"#0e1e38",sub:"#305878",muted:"#6090b8",border:"#a0c4e0",accent:"#2068c0",dark:"#0e2040",darkText:"#f0f6fd"},
  {id:"lavender",name:"Lavender",   bg1:"#f6f0fd",bg2:"#ecdeff",bg3:"#deccf8",surface:"rgba(255,255,255,0.82)",text:"#1e1030",sub:"#6040a0",muted:"#9070c0",border:"#c8aaee",accent:"#7040c0",dark:"#260e40",darkText:"#f6f0fd"},
  {id:"sunset",  name:"Sunset",     bg1:"#fdf6ee",bg2:"#fce8d0",bg3:"#f8d4b0",surface:"rgba(255,255,255,0.82)",text:"#301808",sub:"#905030",muted:"#c07040",border:"#e0b080",accent:"#d05820",dark:"#301808",darkText:"#fdf6ee"},
  {id:"midnight",name:"Midnight",   bg1:"#1a1a2e",bg2:"#16213e",bg3:"#0f3460",surface:"rgba(255,255,255,0.07)",text:"#e8e0f0",sub:"#a090c0",muted:"#706088",border:"#3a3060",accent:"#c070e8",dark:"#0a0a18",darkText:"#e8e0f0"},
  {id:"slate",   name:"Slate",      bg1:"#f2f4f6",bg2:"#e4e8ec",bg3:"#d4dce4",surface:"rgba(255,255,255,0.85)",text:"#1a2030",sub:"#4a5870",muted:"#7a8898",border:"#b8c4d0",accent:"#4060a8",dark:"#1a2030",darkText:"#f2f4f6"},
];
const DEFAULT_PEOPLE = [
  {id:"demo-1",name:"Sarah", relationship:"wife",       nickname:"my love",   phone:"",email:"",notes:"",language:"en",tones:[]},
  {id:"demo-2",name:"Marcus",relationship:"bestfriend", nickname:"bestie",    phone:"",email:"",notes:"",language:"en",tones:[]},
  {id:"demo-3",name:"Lily",  relationship:"child",      nickname:"little one",phone:"",email:"",notes:"",language:"en",tones:[]},
];
const FAQS = [
  {cat:"Privacy & Data", q:"Where is my data stored?",                     a:"Everything — names, nicknames, contact info, and personalization notes — is stored exclusively in your browser's local storage on your device. It never leaves your phone or computer."},
  {cat:"Privacy & Data", q:"Can the app read my contacts without permission?",a:"No. Contact linking only activates when you tap 'From Device' and your device shows a permission prompt."},
  {cat:"Privacy & Data", q:"Do you sell my data?",                         a:"No. We collect nothing and store nothing on our end. The product is architecturally designed so no personal data ever reaches us."},
  {cat:"AI & Messages",  q:"How are messages generated?",                   a:"Messages are generated using Claude, an AI by Anthropic. Your relationship type, nickname, personalization notes, tone prompts, free-text intent, and language are sent to Anthropic's API. No other personal data is included."},
  {cat:"AI & Messages",  q:"What is the free-text prompt field?",           a:"Before generating, you can type anything you want to convey — 'thank her for being there last week', 'something funny about our road trip', 'let him know I'm proud of his promotion'. The AI treats this as your direct intent."},
  {cat:"AI & Messages",  q:"How do tone chips and notes personalise messages?",a:"Tone chips (Playful, Nostalgic, Poetic, etc.) set the emotional register. Notes add specific context about the person. Together with your free-text prompt, the AI creates something that could only have come from you."},
  {cat:"AI & Messages",  q:"Which languages are supported?",               a:"English, Spanish (Español), Hindi (हिन्दी), and Telugu (తెలుగు). Select your language in the Personalise panel. Messages are natively composed — not translated."},
  {cat:"AI & Messages",  q:"Can I edit messages before sending?",           a:"Yes. Every message has an Edit button so you can personalise the wording. The AI draft is always a starting point."},
  {cat:"Security",       q:"Is the website secure?",                       a:"Yes. The site is served over HTTPS. Since no personal data is stored on our end, there is nothing sensitive to compromise on our infrastructure."},
  {cat:"Using the App",  q:"Do I need an account?",                        a:"No. No sign-up, no password, no email required. The app works immediately on any modern browser."},
  {cat:"Using the App",  q:"Can I add it to my phone's home screen?",      a:"Yes. On iPhone, tap Share in Safari → 'Add to Home Screen.' On Android, Chrome will prompt you. It opens full-screen like a native app."},
  {cat:"Using the App",  q:"Which messaging apps are supported?",          a:"iMessage & SMS, WhatsApp, Telegram, Signal, and Email. Add a phone number to unlock the first four; add an email to unlock Email."},
  {cat:"Using the App",  q:"How do I get the most personalised messages?", a:"Add a nickname, select tone chips, fill in notes about the person, type a free-text prompt for today's message, and choose a language. The more signals you give, the more the message sounds like it could only come from you."},
];
const isDark = h=>{const r=parseInt(h.slice(1,3),16),g=parseInt(h.slice(3,5),16),b=parseInt(h.slice(5,7),16);return(r*.299+g*.587+b*.114)<140};
const GlobalStyles=({theme})=>(<style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}:root{--bg1:${theme.bg1};--bg2:${theme.bg2};--bg3:${theme.bg3};--surface:${theme.surface};--text:${theme.text};--sub:${theme.sub};--muted:${theme.muted};--border:${theme.border};--accent:${theme.accent};--dark:${theme.dark};--darkText:${theme.darkText};--fd:'Playfair Display',Georgia,serif;--fb:'Lora',Georgia,serif;}html{scroll-behavior:smooth;}body{background:var(--bg1);font-family:var(--fb);color:var(--text);transition:background .4s,color .4s;}@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}@keyframes slideDown{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}@keyframes spin{to{transform:rotate(360deg);}}@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.45;}}@keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-8px);}}@keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(-10px);}to{opacity:1;transform:translateX(-50%) translateY(0);}}.btn{cursor:pointer;border:none;transition:all .2s;font-family:var(--fb);}.btn:hover{transform:translateY(-2px);opacity:.88;}.btn:active{transform:translateY(0);}.btn:disabled{opacity:.35;transform:none;cursor:not-allowed;}.pcard{transition:all .18s;cursor:pointer;}.pcard:hover{transform:translateY(-2px);}select{appearance:none;-webkit-appearance:none;font-family:var(--fb);}textarea,input{font-family:var(--fb);outline:none;}.chip{cursor:pointer;transition:all .14s;display:inline-block;}.chip:hover{opacity:.72;transform:translateY(-1px);}.plat-btn{cursor:pointer;border:none;transition:all .18s;font-family:var(--fb);}.plat-btn:hover{transform:translateY(-2px);box-shadow:0 4px 14px rgba(0,0,0,.1);}.plat-btn:disabled{opacity:.35;transform:none;cursor:not-allowed;}.share-card{transition:all .2s;}.share-card:hover{transform:translateY(-3px);}.nav-link{cursor:pointer;transition:all .18s;font-family:var(--fb);font-size:14px;background:none;border:none;color:var(--sub);letter-spacing:.5px;padding:6px 12px;border-radius:100px;}.nav-link:hover{color:var(--text);}.nav-link.active{color:var(--accent);}.faq-btn{width:100%;text-align:left;background:none;border:none;cursor:pointer;padding:17px 0;display:flex;justify-content:space-between;align-items:center;font-family:var(--fd);font-size:15px;color:var(--text);transition:color .18s;}.faq-btn:hover{color:var(--accent);}.tone-chip{cursor:pointer;border:none;transition:all .15s;font-family:var(--fb);display:inline-flex;align-items:center;gap:4px;border-radius:100px;padding:4px 11px;font-size:12px;}.tone-chip:hover{transform:translateY(-1px);}.lang-btn{cursor:pointer;border:none;transition:all .15s;font-family:var(--fb);display:flex;align-items:center;gap:5px;border-radius:10px;padding:7px 11px;font-size:13px;}.lang-btn:hover{transform:translateY(-1px);}::-webkit-scrollbar{width:4px;}::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px;}`}</style>);

function ThemePanel({theme,setTheme,onClose}){const[cc,setCc]=useState({bg1:theme.bg1,bg2:theme.bg2,bg3:theme.bg3,accent:theme.accent,text:theme.text});function applyCustom(){const d=isDark(cc.bg1);setTheme({id:"custom",name:"Custom",...cc,surface:d?"rgba(255,255,255,0.08)":"rgba(255,255,255,0.82)",sub:d?"#b0a0c0":"#8a6a50",muted:d?"#7a6888":"#b09070",border:d?"#4a3a5a":"#d4b8a8",dark:cc.bg1,darkText:d?"#f0f0f0":"#2d1f14"});}return(<div style={{position:"fixed",top:0,left:0,right:0,bottom:0,zIndex:500}} onClick={onClose}><div style={{position:"absolute",top:"62px",right:0,background:"var(--bg1)",border:"1px solid var(--border)",borderRadius:"18px 0 0 18px",padding:"24px",width:"min(340px,94vw)",maxHeight:"85vh",overflowY:"auto",boxShadow:"-6px 0 32px rgba(0,0,0,.14)",animation:"slideDown .22s ease"}} onClick={e=>e.stopPropagation()}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"18px"}}><div style={{fontFamily:"var(--fd)",fontSize:"17px",fontWeight:"600",color:"var(--text)"}}>🎨 Appearance</div><button className="btn" onClick={onClose} style={{background:"none",fontSize:"18px",color:"var(--muted)",padding:"2px 6px"}}>✕</button></div><div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"12px"}}>Presets</div><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"10px",marginBottom:"22px"}}>{THEMES.map(t=>(<div key={t.id} onClick={()=>setTheme(t)} style={{cursor:"pointer",textAlign:"center"}}><div style={{width:"50px",height:"50px",borderRadius:"14px",background:`linear-gradient(135deg,${t.bg1},${t.bg3})`,border:`2.5px solid ${theme.id===t.id?t.accent:"transparent"}`,margin:"0 auto 5px",boxShadow:theme.id===t.id?`0 4px 12px ${t.accent}55`:"0 2px 6px rgba(0,0,0,.07)",transition:"all .18s",display:"flex",alignItems:"flex-end",justifyContent:"flex-end",padding:"5px"}}><div style={{width:"12px",height:"12px",borderRadius:"50%",background:t.accent}}/></div><div style={{fontSize:"10px",color:theme.id===t.id?"var(--accent)":"var(--muted)",fontWeight:theme.id===t.id?"700":"400",lineHeight:1.3}}>{t.name}</div></div>))}</div><div style={{borderTop:"1px solid var(--border)",paddingTop:"18px"}}><div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"12px"}}>Custom</div>{[{key:"bg1",label:"Background 1"},{key:"bg2",label:"Background 2"},{key:"bg3",label:"Background 3"},{key:"accent",label:"Accent"},{key:"text",label:"Text"}].map(f=>(<div key={f.key} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"9px"}}><span style={{fontSize:"13px",color:"var(--text)"}}>{f.label}</span><div style={{display:"flex",alignItems:"center",gap:"7px"}}><div style={{width:"26px",height:"26px",borderRadius:"7px",background:cc[f.key],border:"1px solid var(--border)",cursor:"pointer",position:"relative",overflow:"hidden"}}><input type="color" value={cc[f.key]} onChange={e=>setCc(c=>({...c,[f.key]:e.target.value}))} style={{position:"absolute",top:"-4px",left:"-4px",width:"36px",height:"36px",border:"none",cursor:"pointer",opacity:0}}/><div style={{width:"100%",height:"100%",background:cc[f.key],pointerEvents:"none"}}/></div><span style={{fontSize:"11px",color:"var(--muted)",fontFamily:"monospace"}}>{cc[f.key]}</span></div></div>))}<button className="btn" onClick={applyCustom} style={{marginTop:"12px",width:"100%",background:"var(--accent)",color:"white",borderRadius:"11px",padding:"10px",fontSize:"13px"}}>Apply Custom Theme</button></div></div></div>);}

function PersonalizationPanel({person,config,onSave,onClose}){const[notes,setNotes]=useState(person.notes||"");const[tones,setTones]=useState(person.tones||[]);const[language,setLanguage]=useState(person.language||"en");const CHIPS=["We met in college","She loves hiking","Always makes me laugh","Recently got promoted","Dry sense of humour","Loves jazz","We share a love of cooking","Going through a tough time","Just had a baby","Celebrates small wins","Morning person","Dog lover","Long-distance","Known each other 10+ years","Very private person","Outdoorsy","Bookworm","Big family person"];function toggleTone(id){setTones(p=>p.includes(id)?p.filter(t=>t!==id):[...p,id]);}function addChip(c){setNotes(p=>p?`${p.trim()}, ${c.toLowerCase()}`:c);}return(<div style={{background:"var(--surface)",border:`1.5px solid ${config.color}44`,borderRadius:"18px",padding:"20px",animation:"slideDown .22s ease",backdropFilter:"blur(10px)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}><div style={{fontFamily:"var(--fd)",fontSize:"15px",fontWeight:"600",color:"var(--text)"}}>✨ Personalise for {person.name}</div><button className="btn" onClick={onClose} style={{background:"none",color:"var(--muted)",fontSize:"16px",padding:"2px 6px"}}>✕</button></div><div style={{marginBottom:"18px"}}><div style={{fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"9px"}}>🌐 Message Language</div><div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}>{LANGUAGES.map(lang=>(<button key={lang.id} className="lang-btn" onClick={()=>setLanguage(lang.id)} style={{background:language===lang.id?config.color:"rgba(255,255,255,0.7)",color:language===lang.id?"white":"var(--text)",border:`1.5px solid ${language===lang.id?config.color:"var(--border)"}`,boxShadow:language===lang.id?`0 3px 10px ${config.color}44`:"none"}}><span>{lang.flag}</span><span style={{fontWeight:language===lang.id?"600":"400"}}>{lang.nativeName}</span></button>))}</div><p style={{marginTop:"7px",fontSize:"11px",color:"var(--muted)",fontStyle:"italic"}}>Natively composed — not translated.</p></div><div style={{marginBottom:"18px"}}><div style={{fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"9px"}}>🎭 Tone — pick any that fit</div><div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{TONES.map(t=>(<button key={t.id} className="tone-chip" onClick={()=>toggleTone(t.id)} style={{background:tones.includes(t.id)?config.color:"rgba(255,255,255,0.75)",color:tones.includes(t.id)?"white":"var(--text)",border:`1.5px solid ${tones.includes(t.id)?config.color:"var(--border)"}`,boxShadow:tones.includes(t.id)?`0 3px 10px ${config.color}44`:"none"}}><span>{t.emoji}</span><span>{t.label}</span></button>))}</div><p style={{marginTop:"6px",fontSize:"11px",color:"var(--muted)",fontStyle:"italic"}}>Combine tones freely — e.g. Nostalgic + Funny creates something warmly bittersweet.</p></div><div style={{marginBottom:"16px"}}><div style={{fontSize:"11px",letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"4px"}}>📝 About {person.name}</div><p style={{fontSize:"12px",color:"var(--sub)",marginBottom:"8px",lineHeight:1.6}}>Personality, interests, shared memories, recent events, what you love about them. The more you add, the more personal every message becomes.</p><textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder={`e.g. "She always finds the silver lining. We met 15 years ago travelling. She just went through a difficult breakup and I want her to feel seen."`} style={{width:"100%",border:`1.5px solid ${config.color}44`,borderRadius:"12px",padding:"12px 14px",fontSize:"13px",lineHeight:1.8,background:"rgba(255,255,255,0.85)",color:"var(--text)",resize:"vertical",minHeight:"90px",boxSizing:"border-box"}}/><div style={{marginTop:"8px"}}><div style={{fontSize:"11px",color:"var(--muted)",marginBottom:"5px"}}>Quick add:</div><div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{CHIPS.map(c=>(<span key={c} className="chip" onClick={()=>addChip(c)} style={{background:`${config.color}12`,border:`1px solid ${config.color}30`,borderRadius:"100px",padding:"2px 9px",fontSize:"11px",color:"var(--text)"}}>{c}</span>))}</div></div></div><button className="btn" onClick={()=>onSave({notes,tones,language})} style={{width:"100%",background:config.color,color:"white",borderRadius:"12px",padding:"11px",fontSize:"13px",boxShadow:`0 4px 14px ${config.color}44`}}>Save & Regenerate ✦</button></div>);}

function Nav({page,setPage,theme,onThemeClick}){const[scrolled,setScrolled]=useState(false);useEffect(()=>{const fn=()=>setScrolled(window.scrollY>20);window.addEventListener("scroll",fn);return()=>window.removeEventListener("scroll",fn);},[]);return(<nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:scrolled?`${theme.bg1}f0`:"transparent",backdropFilter:scrolled?"blur(14px)":"none",borderBottom:scrolled?`1px solid ${theme.border}`:"none",transition:"all .3s",padding:"0 18px"}}><div style={{maxWidth:"1080px",margin:"0 auto",height:"60px",display:"flex",alignItems:"center",justifyContent:"space-between"}}><button onClick={()=>setPage("home")} className="btn" style={{background:"none",padding:0,display:"flex",alignItems:"center",gap:"8px"}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 52" width="210" height="52" style={{display:"block"}}>
  <defs>
    <filter id="nb" x="-20%" y="-20%" width="150%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" seed="11" result="noise"/>
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" xChannelSelector="R" yChannelSelector="G" result="d"/>
      <feComposite in="d" in2="SourceGraphic" operator="in"/>
    </filter>
  </defs>
  {/* "Heartfully" */}
  <text x="4" y="24" fontFamily="Georgia,'Times New Roman',serif" fontSize="22" fontWeight="700" letterSpacing="-0.3" fill="#3a2218">Heartfully</text>
  {/* swash */}
  <path d="M4,28 Q107,36 168,28" fill="none" stroke="#c8855a" strokeWidth="1" strokeLinecap="round" opacity="0.4"/>
  {/* Y */}
  <text x="4" y="48" fontFamily="Georgia,'Times New Roman',serif" fontSize="19" fontWeight="700" fontStyle="italic" fill="#c8364e">Y</text>
  {/* painted heart as 'o' — center ~(27,40), hw=8 */}
  <path d="M27,43.5 C27,39 20,39 20,43.5 C20,46.5 27,48 27,48 C27,48 34,46.5 34,43.5 C34,39 27,39 27,43.5Z" fill="#a02030" opacity="0.15" transform="translate(0.8,1)"/>
  <path d="M27,43.5 C27,39 20,39 20,43.5 C20,46.5 27,48 27,48 C27,48 34,46.5 34,43.5 C34,39 27,39 27,43.5Z" fill="#c8364e" filter="url(#nb)"/>
  <path d="M21,41 Q27,39 33,41" fill="none" stroke="#f07080" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/>
  {/* "urs" */}
  <text x="36" y="48" fontFamily="Georgia,'Times New Roman',serif" fontSize="19" fontWeight="700" fontStyle="italic" fill="#c8364e">urs</text>
</svg></button><div style={{display:"flex",alignItems:"center",gap:"1px"}}><button className={`nav-link${page==="home"?" active":""}`} onClick={()=>setPage("home")}>Home</button><button className={`nav-link${page==="app"?" active":""}`} onClick={()=>setPage("app")}>App</button><button className={`nav-link${page==="share"?" active":""}`} onClick={()=>setPage("share")}>Share</button><button className={`nav-link${page==="faq"?" active":""}`} onClick={()=>setPage("faq")}>FAQ</button><button className="btn" onClick={onThemeClick} style={{marginLeft:"4px",background:"var(--surface)",border:`1px solid ${theme.border}`,borderRadius:"100px",padding:"6px 12px",fontSize:"13px",color:"var(--text)"}}>🎨</button><button className="btn" onClick={()=>setPage("app")} style={{marginLeft:"6px",background:"var(--accent)",color:"white",borderRadius:"100px",padding:"7px 16px",fontSize:"13px",boxShadow:`0 4px 14px ${theme.accent}44`}}>Open App →</button></div></div></nav>);}

function LandingPage({setPage,theme}){const features=[{icon:"✨",title:"Tone & Mood Prompts",body:"Choose Playful, Nostalgic, Poetic, Funny, Encouraging — or a blend. The AI shapes the entire message around your chosen emotional register."},{icon:"📝",title:"Personal Context Notes",body:"Add details about the person — their personality, shared memories, what you want to say — and the message becomes something only you could send."},{icon:"💭",title:"Free-Text Intent",body:"Type exactly what you want to say today — 'thank her for being there last week', 'something funny about our road trip' — and the AI builds the message around it."},{icon:"🌐",title:"Four Languages",body:"Generate messages in English, Spanish, Hindi, or Telugu. Not translated — natively composed in each language with the warmth and idiom that fits."},{icon:"📲",title:"Send in One Tap",body:"Messages open directly in iMessage, WhatsApp, Telegram, Signal, or Email — pre-filled and ready."},{icon:"🔒",title:"Your Data Stays With You",body:"Everything is stored locally on your device. No account, no cloud, no server ever sees your personal information."}];return(<div style={{paddingTop:"60px"}}><section style={{minHeight:"90vh",display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",background:`linear-gradient(160deg,${theme.bg1} 0%,${theme.bg2} 60%,${theme.bg3} 100%)`}}><div style={{position:"absolute",top:"-10%",right:"-5%",width:"460px",height:"460px",borderRadius:"50%",background:`radial-gradient(circle,${theme.accent}18 0%,transparent 70%)`,pointerEvents:"none"}}/><div style={{maxWidth:"720px",margin:"0 auto",padding:"60px 22px",textAlign:"center",position:"relative",zIndex:1}}><div style={{display:"inline-flex",alignItems:"center",gap:"8px",background:`${theme.accent}12`,border:`1px solid ${theme.accent}30`,borderRadius:"100px",padding:"5px 16px",marginBottom:"26px",animation:"fadeUp .6s ease both"}}><span style={{fontSize:"11px",color:"var(--accent)",letterSpacing:"1.5px",textTransform:"uppercase"}}>Daily Thoughtfulness</span></div><h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(38px,7vw,70px)",fontWeight:"700",color:"var(--text)",lineHeight:1.06,marginBottom:"20px",animation:"fadeUp .6s .1s ease both",opacity:0}}>Tell them<br/><em style={{color:"var(--accent)",fontStyle:"italic"}}>you're thinking</em><br/>of them</h1><p style={{fontSize:"17px",color:"var(--sub)",lineHeight:1.8,marginBottom:"32px",maxWidth:"480px",margin:"0 auto 32px",animation:"fadeUp .6s .2s ease both",opacity:0}}>AI-crafted messages shaped by your words, your tone, and your language — sent directly through the apps you already use.</p><div style={{display:"flex",gap:"11px",justifyContent:"center",flexWrap:"wrap",animation:"fadeUp .6s .3s ease both",opacity:0}}><button className="btn" onClick={()=>setPage("app")} style={{background:"var(--accent)",color:"white",borderRadius:"100px",padding:"14px 34px",fontSize:"15px",boxShadow:`0 8px 28px ${theme.accent}44`}}>Start Heartfully ✦</button><button className="btn" onClick={()=>setPage("faq")} style={{background:"var(--surface)",color:"var(--text)",border:`1.5px solid ${theme.border}`,borderRadius:"100px",padding:"14px 26px",fontSize:"15px"}}>How it Works →</button></div><div style={{marginTop:"44px",display:"flex",justifyContent:"center",gap:"8px",flexWrap:"wrap",animation:"fadeUp .6s .4s ease both",opacity:0}}>{LANGUAGES.map(l=>(<div key={l.id} style={{display:"flex",alignItems:"center",gap:"5px",background:"var(--surface)",border:`1px solid ${theme.border}`,borderRadius:"100px",padding:"4px 13px",fontSize:"12px",color:"var(--sub)",backdropFilter:"blur(4px)"}}><span>{l.flag}</span><span>{l.nativeName}</span></div>))}{Object.entries(RC).slice(0,6).map(([k,v])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:"4px",background:"var(--surface)",border:`1px solid ${theme.border}`,borderRadius:"100px",padding:"4px 11px",fontSize:"12px",color:"var(--sub)",backdropFilter:"blur(4px)"}}><span>{v.emoji}</span><span>{v.label}</span></div>))}</div></div></section><section style={{padding:"80px 22px",background:`linear-gradient(160deg,${theme.bg1},${theme.bg2})`}}><div style={{maxWidth:"980px",margin:"0 auto"}}><div style={{textAlign:"center",marginBottom:"48px"}}><div style={{fontSize:"11px",letterSpacing:"3px",color:"var(--muted)",textTransform:"uppercase",marginBottom:"10px"}}>What Makes It Different</div><h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(24px,4vw,40px)",fontWeight:"600",color:"var(--text)"}}>Messages that actually sound like you</h2></div><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(276px,1fr))",gap:"16px"}}>{features.map((f,i)=>(<div key={i} style={{background:"var(--surface)",borderRadius:"20px",padding:"24px",border:`1px solid ${theme.border}`,backdropFilter:"blur(8px)"}}><div style={{fontSize:"25px",marginBottom:"11px"}}>{f.icon}</div><h3 style={{fontFamily:"var(--fd)",fontSize:"16px",fontWeight:"600",color:"var(--text)",marginBottom:"8px"}}>{f.title}</h3><p style={{fontSize:"13px",color:"var(--sub)",lineHeight:1.78}}>{f.body}</p></div>))}</div></div></section><section style={{padding:"80px 22px",textAlign:"center",background:`linear-gradient(160deg,${theme.bg2},${theme.bg3})`}}><div style={{fontSize:"34px",marginBottom:"16px",animation:"float 4s ease-in-out infinite"}}>💛</div><h2 style={{fontFamily:"var(--fd)",fontSize:"clamp(24px,4vw,44px)",fontWeight:"700",color:"var(--text)",marginBottom:"12px",lineHeight:1.1}}>The smallest acts of love,<br/>done daily, build the deepest bonds.</h2><p style={{color:"var(--sub)",fontSize:"15px",marginBottom:"28px"}}>Start your daily practice of thoughtfulness.</p><button className="btn" onClick={()=>setPage("app")} style={{background:"var(--accent)",color:"white",borderRadius:"100px",padding:"15px 38px",fontSize:"15px",boxShadow:`0 8px 28px ${theme.accent}44`}}>Open Heartfully ✦</button></section><footer style={{background:"var(--dark)",padding:"26px 22px",textAlign:"center"}}><div style={{display:"flex",justifyContent:"center",gap:"18px",alignItems:"center",marginBottom:"9px",flexWrap:"wrap"}}><a href="mailto:hello@heartfully.app?subject=Feedback%20%2F%20Bug%20Report&body=What%20happened%3A%0A%0AWhat%20I%20expected%3A%0A%0ADevice%20%2F%20browser%3A" style={{color:"rgba(255,255,255,0.35)",fontSize:"12px",textDecoration:"none",display:"flex",alignItems:"center",gap:"4px",transition:"color .2s"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.7)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}>💬 Send feedback</a></div><div style={{display:"flex",justifyContent:"center",marginBottom:"7px"}}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 52" width="140" height="35" style={{display:"block",opacity:0.85}}><defs><filter id="nf" x="-20%" y="-20%" width="150%" height="150%"><feTurbulence type="fractalNoise" baseFrequency="0.70" numOctaves="4" seed="11" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" xChannelSelector="R" yChannelSelector="G" result="d"/><feComposite in="d" in2="SourceGraphic" operator="in"/></filter></defs><text x="4" y="24" fontFamily="Georgia,'Times New Roman',serif" fontSize="22" fontWeight="700" letterSpacing="-0.3" fill="#f5e0c0">Heartfully</text><path d="M4,28 Q107,36 168,28" fill="none" stroke="#c8855a" strokeWidth="1" strokeLinecap="round" opacity="0.4"/><text x="4" y="48" fontFamily="Georgia,'Times New Roman',serif" fontSize="19" fontWeight="700" fontStyle="italic" fill="#e87090">Y</text><path d="M27,43.5 C27,39 20,39 20,43.5 C20,46.5 27,48 27,48 C27,48 34,46.5 34,43.5 C34,39 27,39 27,43.5Z" fill="#c8364e" opacity="0.2" transform="translate(0.8,1)"/><path d="M27,43.5 C27,39 20,39 20,43.5 C20,46.5 27,48 27,48 C27,48 34,46.5 34,43.5 C34,39 27,39 27,43.5Z" fill="#e87090" filter="url(#nf)"/><path d="M21,41 Q27,39 33,41" fill="none" stroke="#ffaabb" strokeWidth="1.2" strokeLinecap="round" opacity="0.5"/><text x="36" y="48" fontFamily="Georgia,'Times New Roman',serif" fontSize="19" fontWeight="700" fontStyle="italic" fill="#e87090">urs</text></svg></div><p style={{color:`${theme.darkText}40`,fontSize:"12px"}}>All personal data stored locally on your device</p></footer></div>);}

function SharePage({setPage,theme}){
  const[copied,setCopied]=useState(false);
  const appUrl="https://heartfully.app";
  async function copyLink(){try{await navigator.clipboard.writeText(appUrl);}catch{}setCopied(true);setTimeout(()=>setCopied(false),2500);}
  async function nativeShare(){if(navigator.share){try{await navigator.share({title:"Heartfully",text:"Know someone who'd love to send more heartfelt messages? Share Heartfully with them 💛",url:appUrl});}catch{}}else{copyLink();}}
  const shareLinks=[
    {label:"WhatsApp",icon:"🟢",color:"#25d366",bg:"#edfaf2",url:`https://wa.me/?text=${encodeURIComponent("I've been using this app to send more heartfelt messages to the people I love — thought you might like it too 💛 "+appUrl)}`},
    {label:"iMessage / SMS",icon:"💬",color:"#34aadc",bg:"#edf6fd",url:`sms:?&body=${encodeURIComponent("I've been using Heartfully to send nicer messages — check it out 💛 "+appUrl)}`},
    {label:"Email",icon:"✉️",color:"#c9746b",bg:"#fdf0ee",url:`mailto:?subject=${encodeURIComponent("You'd love this app")}&body=${encodeURIComponent("Thought you might love this! I use Heartfully to send heartfelt messages to the people I care about: "+appUrl+" 💛")}`},
    {label:"Facebook",icon:"📘",color:"#1877f2",bg:"#edf3fd",url:`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(appUrl)}`},
    {label:"X / Twitter",icon:"🐦",color:"#1da1f2",bg:"#e8f5fd",url:`https://twitter.com/intent/tweet?text=${encodeURIComponent("This little app helps you send more heartfelt messages to the people you love 💛")}&url=${encodeURIComponent(appUrl)}`},
    {label:"Instagram",icon:"📸",color:"#e1306c",bg:"#fdeef4",url:"#",note:"Copy the link and share in your bio or story"}
  ];
  return(
    <div style={{paddingTop:"60px",minHeight:"100vh",background:`linear-gradient(160deg,${theme.bg1},${theme.bg2})`}}>
      {/* Hero */}
      <section style={{padding:"72px 22px 52px",textAlign:"center"}}>
        <div style={{fontSize:"44px",marginBottom:"18px",animation:"float 4s ease-in-out infinite"}}>💛</div>
        <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(28px,5vw,52px)",fontWeight:"700",color:"var(--text)",lineHeight:1.1,marginBottom:"14px"}}>
          Know someone who'd<br/><em style={{color:"var(--accent)",fontStyle:"italic"}}>love this?</em>
        </h1>
        <p style={{color:"var(--sub)",fontSize:"16px",maxWidth:"420px",margin:"0 auto 32px",lineHeight:1.85}}>
          The best way to spread a little more love in the world is to pass it on. Share Heartfully with someone who'd use it.
        </p>
        <div style={{display:"flex",gap:"10px",justifyContent:"center",flexWrap:"wrap"}}>
          <button className="btn" onClick={nativeShare} style={{background:"var(--accent)",color:"white",borderRadius:"100px",padding:"13px 28px",fontSize:"15px",boxShadow:`0 8px 24px ${theme.accent}44`}}>📤 Share Heartfully</button>
          <button className="btn" onClick={copyLink} style={{background:"var(--surface)",color:"var(--text)",border:`1.5px solid ${theme.border}`,borderRadius:"100px",padding:"13px 22px",fontSize:"15px"}}>{copied?"✓ Link copied!":"🔗 Copy Link"}</button>
        </div>
      </section>

      {/* Share via */}
      <section style={{maxWidth:"680px",margin:"0 auto",padding:"0 22px 60px"}}>
        <div style={{textAlign:"center",marginBottom:"24px"}}>
          <div style={{fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",color:"var(--muted)"}}>Share via</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:"9px"}}>
          {shareLinks.map((sl,i)=>(
            <a key={i} href={sl.url} target="_blank" rel="noopener noreferrer"
              style={{display:"flex",alignItems:"center",gap:"11px",padding:"13px 16px",background:sl.bg,border:`1.5px solid ${sl.color}22`,borderRadius:"14px",boxShadow:"0 2px 8px rgba(0,0,0,.04)",textDecoration:"none"}}>
              <span style={{fontSize:"20px"}}>{sl.icon}</span>
              <div>
                <div style={{fontSize:"14px",fontWeight:"600",color:"var(--text)",fontFamily:"var(--fd)"}}>{sl.label}</div>
                {sl.note&&<div style={{fontSize:"11px",color:"var(--muted)",marginTop:"2px"}}>{sl.note}</div>}
              </div>
              <span style={{marginLeft:"auto",color:sl.color,fontSize:"16px"}}>→</span>
            </a>
          ))}
        </div>
      </section>

      {/* Install on phone */}
      <section style={{maxWidth:"680px",margin:"0 auto",padding:"0 22px 80px"}}>
        <div style={{background:"var(--dark)",borderRadius:"24px",padding:"36px"}}>
          <div style={{textAlign:"center",marginBottom:"24px"}}>
            <div style={{fontSize:"28px",marginBottom:"10px"}}>📱</div>
            <h2 style={{fontFamily:"var(--fd)",fontSize:"20px",fontWeight:"600",color:"var(--darkText)",marginBottom:"8px"}}>Add to your home screen</h2>
            <p style={{fontSize:"13px",color:`${theme.darkText}80`,lineHeight:1.7}}>Heartfully works like an app — no App Store needed. Add it to your home screen for one-tap access.</p>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:"12px"}}>
            {[
              {platform:"📱 iPhone / iPad",steps:["Open in Safari","Tap the Share button ↑","Tap 'Add to Home Screen'","Tap Add"]},
              {platform:"🤖 Android",steps:["Open in Chrome","Tap the menu ⋮","Tap 'Add to Home Screen'","Tap Add"]},
              {platform:"🖥️ Desktop",steps:["Open in Chrome or Edge","Click the ⊕ in address bar","Click Install","Done — it's in your dock"]}
            ].map((p,i)=>(
              <div key={i} style={{background:"rgba(255,255,255,0.06)",borderRadius:"14px",padding:"16px"}}>
                <div style={{fontFamily:"var(--fd)",fontSize:"13px",fontWeight:"600",color:"var(--darkText)",marginBottom:"10px"}}>{p.platform}</div>
                {p.steps.map((s,j)=>(
                  <div key={j} style={{display:"flex",gap:"8px",marginBottom:"6px",alignItems:"flex-start"}}>
                    <span style={{background:theme.accent,color:"white",borderRadius:"50%",width:"16px",height:"16px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",fontWeight:"700",flexShrink:0,marginTop:"1px"}}>{j+1}</span>
                    <span style={{fontSize:"12px",color:`${theme.darkText}bb`,lineHeight:1.5}}>{s}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{background:"var(--dark)",padding:"24px 22px",textAlign:"center"}}>
        <div style={{display:"flex",justifyContent:"center",gap:"16px",marginBottom:"7px",flexWrap:"wrap"}}>
          <a href="mailto:hello@heartfully.app?subject=Feedback%20%2F%20Bug%20Report&body=What%20happened%3A%0A%0AWhat%20I%20expected%3A%0A%0ADevice%20%2F%20browser%3A" style={{color:"rgba(255,255,255,0.35)",fontSize:"12px",textDecoration:"none"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.7)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}>💬 Send feedback</a>
        </div>
        <p style={{color:`${theme.darkText}40`,fontSize:"12px"}}>© Heartfully · All personal data stored locally on your device</p>
      </footer>
    </div>
  );
}

function FAQPage({setPage,theme}){const[open,setOpen]=useState(null);const cats=[...new Set(FAQS.map(f=>f.cat))];return(<div style={{paddingTop:"60px",minHeight:"100vh",background:`linear-gradient(160deg,${theme.bg1},${theme.bg2})`}}><section style={{padding:"68px 22px 48px",textAlign:"center",borderBottom:`1px solid ${theme.border}`}}><h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(28px,5vw,50px)",fontWeight:"700",color:"var(--text)",lineHeight:1.1,marginBottom:"12px"}}>Frequently Asked Questions</h1><p style={{color:"var(--sub)",fontSize:"15px",maxWidth:"440px",margin:"0 auto",lineHeight:1.8}}>Plain answers about your privacy, your data, and how the app works.</p></section><div style={{maxWidth:"740px",margin:"0 auto",padding:"52px 22px 90px"}}>{cats.map(cat=>(<div key={cat} style={{marginBottom:"44px"}}><div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"4px"}}><div style={{height:"2px",width:"20px",background:"var(--accent)",borderRadius:"2px"}}/><div style={{fontSize:"11px",letterSpacing:"2.5px",textTransform:"uppercase",color:"var(--accent)"}}>{cat}</div></div>{FAQS.filter(f=>f.cat===cat).map((faq,i)=>{const id=`${cat}-${i}`;const isOpen=open===id;return(<div key={id} style={{borderBottom:`1px solid ${theme.border}`}}><button className="faq-btn" onClick={()=>setOpen(isOpen?null:id)}><span style={{paddingRight:"18px",lineHeight:1.5}}>{faq.q}</span><span style={{color:"var(--accent)",fontSize:"18px",flexShrink:0,transition:"transform .2s",transform:isOpen?"rotate(45deg)":"rotate(0)",display:"inline-block"}}>+</span></button>{isOpen&&<div style={{paddingBottom:"16px",animation:"slideDown .2s ease"}}><p style={{fontSize:"14px",color:"var(--sub)",lineHeight:1.85}}>{faq.a}</p></div>}</div>);})}</div>))}<div style={{background:"var(--dark)",borderRadius:"20px",padding:"34px",textAlign:"center"}}><div style={{fontSize:"24px",marginBottom:"9px"}}>💛</div><h3 style={{fontFamily:"var(--fd)",fontSize:"20px",fontWeight:"600",color:"var(--darkText)",marginBottom:"7px"}}>Ready to start?</h3><p style={{color:`${theme.darkText}65`,fontSize:"13px",marginBottom:"20px"}}>No account needed. Just open the app and add your people.</p><button className="btn" onClick={()=>setPage("app")} style={{background:"var(--accent)",color:"white",borderRadius:"100px",padding:"11px 26px",fontSize:"13px",boxShadow:`0 6px 18px ${theme.accent}44`}}>Open the App →</button></div></div><footer style={{background:"var(--dark)",padding:"24px 22px",textAlign:"center"}}><div style={{display:"flex",justifyContent:"center",gap:"16px",marginBottom:"7px",flexWrap:"wrap"}}><a href="mailto:hello@heartfully.app?subject=Feedback%20%2F%20Bug%20Report&body=What%20happened%3A%0A%0AWhat%20I%20expected%3A%0A%0ADevice%20%2F%20browser%3A" style={{color:"rgba(255,255,255,0.35)",fontSize:"12px",textDecoration:"none"}} onMouseEnter={e=>e.target.style.color="rgba(255,255,255,0.7)"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.35)"}>💬 Send feedback</a></div><p style={{color:`${theme.darkText}40`,fontSize:"12px"}}>© Heartfully · All personal data stored locally on your device</p></footer></div>);}

function AppPage({theme}){
  const[people,setPeople]=useState(null);
  const[activeId,setActiveId]=useState(null);
  const[messages,setMessages]=useState({});
  const[editingMsg,setEditingMsg]=useState(null);
  const[loadingId,setLoadingId]=useState(null);
  const[copiedId,setCopiedId]=useState(null);
  const[sentToday,setSentToday]=useState([]);
  const[toast,setToast]=useState(null);
  const[storageReady,setStorageReady]=useState(false);
  const[editingNickId,setEditingNickId]=useState(null);
  const[tempNick,setTempNick]=useState("");
  const[showAddForm,setShowAddForm]=useState(false);
  const[newP,setNewP]=useState({name:"",relationship:"friend",nickname:"",phone:"",email:"",notes:"",language:"en",tones:[]});
  const[showContactPanel,setShowContactPanel]=useState(false);
  const[editContact,setEditContact]=useState(null);
  const[contactLoading,setContactLoading]=useState(false);
  
  const[showPersonalize,setShowPersonalize]=useState(false);
  const[freePrompt,setFreePrompt]=useState("");
  const taRef=useRef(null);

  useEffect(()=>{try{const raw=localStorage.getItem("heartfelt-v4");const d=raw?JSON.parse(raw):null;if(d?.length){setPeople(d);setActiveId(d[0].id);}else{setPeople(DEFAULT_PEOPLE);setActiveId("demo-1");}}catch{setPeople(DEFAULT_PEOPLE);setActiveId("demo-1");}setStorageReady(true);},[]);
  useEffect(()=>{if(!storageReady||!people)return;try{localStorage.setItem("heartfelt-v4",JSON.stringify(people));}catch{}},[people,storageReady]);
  useEffect(()=>{if(!people||!activeId)return;const p=people.find(x=>x.id===activeId);if(p&&!messages[activeId])genMsg(p,"");},[activeId,people]);

  const ap=people?.find(p=>p.id===activeId);
  const cfg=ap?RC[ap.relationship]:null;
  const showT=msg=>{setToast(msg);setTimeout(()=>setToast(null),2800);};

  async function genMsg(person,fp){
    setLoadingId(person.id);setEditingMsg(null);
    const rel=RC[person.relationship];
    const addr=person.nickname?.trim()||person.name;
    const ni=person.nickname?.trim()?`Address them as "${person.nickname}" naturally (not forced at the start).`:`Use their name "${person.name}" naturally.`;
    const lang=LANG_INSTRUCTION[person.language||"en"]||LANG_INSTRUCTION.en;
    const selTones=(person.tones||[]).map(id=>TONES.find(t=>t.id===id)?.label).filter(Boolean);
    const toneInstr=selTones.length?`Emotional tone: ${selTones.join(", ")}.`:"";
    const notesInstr=person.notes?.trim()?`Context about this person: ${person.notes.trim()}.`:"";
    const activeIntent=(fp||freePrompt)?.trim();
    const intentInstr=activeIntent?`The sender specifically wants to convey: "${activeIntent}". Build the entire message around this intent — it is the primary directive.`:"";
    const userMsg=activeIntent
      ?`Write a heartfelt message for my ${rel.label.toLowerCase()} named ${person.name} (I call them "${addr}"). I want to: ${activeIntent}`
      :`Write a heartfelt message for my ${rel.label.toLowerCase()} named ${person.name} (I call them "${addr}"). I want to let them know I'm thinking of them today.`;
    try{
      const res=await fetch("/api/claude",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-5",max_tokens:1000,
          system:`You write short, meaningful, heartfelt messages from one person to another.\nRelationship tone baseline: ${rel.tone}.\n${toneInstr}\n${notesInstr}\n${intentInstr}\n${ni}\nWrite 2–4 sentences. No clichés. Be specific, warm, human. Never start with "Hey" or "Hi".\n${lang}\nReturn ONLY the message text, nothing else.`,
          messages:[{role:"user",content:userMsg}]
        })});
      const d=await res.json();
      if(d.error){console.error("API error:",d.error);setMessages(p=>({...p,[person.id]:fallback(person)}));}
      else{setMessages(p=>({...p,[person.id]:d.content?.[0]?.text?.trim()||fallback(person)}));}
      if(activeIntent)setFreePrompt("");
    }catch(err){
      console.error("Generation error:", err);
      setMessages(p=>({...p,[person.id]:fallback(person)}));
    }
    setLoadingId(null);
  }

  function fallback(p){const n=p.nickname?.trim()||p.name;const f={wife:`${n}, every quiet moment of my day finds its way back to you.`,husband:`${n}, the way you love — quietly, steadily — is the most beautiful thing I know.`,lover:`I carry the thought of you, ${n}, like a warmth I cannot explain.`,girlfriend:`${n}, you make the world more colourful just by being in it.`,boyfriend:`${n}, you make ordinary days feel worth remembering.`,bestfriend:`Life would be less funny, less honest, and less good without you, ${n}.`,friend:`I was thinking of you today, ${n} — really glad you're in my life.`,child:`${n}, watching you grow fills me with a love I never knew was possible.`,parent:`Everything I am, I owe in part to the love you gave me. Thank you, ${n}.`,sibling:`Growing up with you was a gift I didn't appreciate then, ${n}. I do now.`,grandparent:`Your wisdom and love guide me always, ${n}. You are so treasured.`,mentor:`Your belief in me changed the direction of my life, ${n}.`};return f[p.relationship]||`I was thinking of you, ${n}, and wanted you to know how much you mean to me.`;}

  function startEdit(p){setEditingMsg({id:p.id,text:messages[p.id]||""});setTimeout(()=>taRef.current?.focus(),50);}
  function saveEdit(){if(!editingMsg)return;setMessages(p=>({...p,[editingMsg.id]:editingMsg.text}));setEditingMsg(null);showT("Message saved ✓");}
  function saveNick(person){const upd={...person,nickname:tempNick.trim()};setPeople(p=>p.map(x=>x.id===person.id?upd:x));setEditingNickId(null);setMessages(p=>{const n={...p};delete n[person.id];return n;});showT("Nickname updated ✨");}
  function applyNick(person,s){const upd={...person,nickname:s};setPeople(p=>p.map(x=>x.id===person.id?upd:x));setMessages(p=>{const n={...p};delete n[person.id];return n;});showT(`Nickname set to "${s}" 💛`);}
  function savePersonalize(person,{notes,tones,language}){const upd={...person,notes,tones,language};setPeople(p=>p.map(x=>x.id===person.id?upd:x));setShowPersonalize(false);setMessages(p=>{const n={...p};delete n[person.id];return n;});showT("Saved — regenerating… ✨");}
  async function pickContact(tid){setContactLoading(true);try{if("contacts"in navigator&&"ContactsManager"in window){const r=await navigator.contacts.select(["name","tel","email"],{multiple:false});if(r?.length){const c=r[0];setPeople(p=>p.map(x=>x.id===tid?{...x,phone:c.tel?.[0]||"",email:c.email?.[0]||"",contactName:c.name?.[0]||""}:x));showT("Contact linked 📇");setEditContact(null);}}else{const p=people.find(x=>x.id===tid);setEditContact({phone:p?.phone||"",email:p?.email||""}); }}catch{const p=people.find(x=>x.id===tid);setEditContact({phone:p?.phone||"",email:p?.email||""});}setContactLoading(false);}
  function saveContactEdit(person){setPeople(p=>p.map(x=>x.id===person.id?{...x,phone:editContact.phone.trim(),email:editContact.email.trim()}:x));setEditContact(null);showT("Contact saved 📇");}
  function sendVia(person,platform,msg){window.open(platform.getUrl(person,msg),"_blank");if(!sentToday.includes(person.id))setSentToday(p=>[...p,person.id]);showT(`Opening ${platform.label}… 💌`);}
  async function copyMsg(person){const msg=editingMsg?.id===person.id?editingMsg.text:messages[person.id];if(!msg)return;try{await navigator.clipboard.writeText(msg);}catch{}setCopiedId(person.id);setTimeout(()=>setCopiedId(null),2000);showT("Copied ✓");}
  function addPerson(){if(!newP.name.trim())return;const id=`p-${Date.now()}`;const p={id,name:newP.name.trim(),relationship:newP.relationship,nickname:newP.nickname.trim(),phone:newP.phone.trim(),email:newP.email.trim(),notes:"",language:"en",tones:[]};setPeople(prev=>[...prev,p]);setActiveId(id);setNewP({name:"",relationship:"friend",nickname:"",phone:"",email:"",notes:"",language:"en",tones:[]});setShowAddForm(false);showT(`${p.name} added 💛`);}
  function removePerson(id){setPeople(prev=>{const next=prev.filter(p=>p.id!==id);if(activeId===id&&next.length)setActiveId(next[0].id);return next;});setMessages(prev=>{const n={...prev};delete n[id];return n;});}

  const avail=ap?PLATFORMS.filter(pl=>pl.needs==="phone"?!!ap.phone?.trim():!!ap.email?.trim()):[];
  const hasContact=p=>!!(p?.phone?.trim()||p?.email?.trim());
  const isEditing=editingMsg?.id===activeId;
  const curMsg=isEditing?editingMsg.text:(messages[activeId]||"");
  const activeLang=LANGUAGES.find(l=>l.id===(ap?.language||"en"));
  const activeTones=(ap?.tones||[]).map(id=>TONES.find(t=>t.id===id)).filter(Boolean);
  const FREE_PROMPT_CHIPS=["thank you for","miss you so much","proud of you","thinking of you today","can't wait to see you","you inspire me","you made me laugh this week","I appreciate everything you do","just wanted you to know","you mean the world to me"];

  if(!people)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(160deg,${theme.bg1},${theme.bg2})`}}><div style={{textAlign:"center",color:"var(--muted)"}}><div style={{fontSize:"28px",marginBottom:"10px",animation:"float 2s ease-in-out infinite"}}>💛</div><div style={{fontStyle:"italic"}}>Loading your circle…</div></div></div>);

  return(<div style={{minHeight:"100vh",paddingTop:"60px",background:`linear-gradient(160deg,${theme.bg1} 0%,${theme.bg2} 60%,${theme.bg3} 100%)`}}>
    {toast&&<div style={{position:"fixed",top:"15px",left:"50%",transform:"translateX(-50%)",background:"var(--dark)",color:"var(--darkText)",padding:"8px 20px",borderRadius:"100px",fontSize:"13px",zIndex:9999,boxShadow:"0 4px 24px rgba(0,0,0,.18)",animation:"toastIn .3s ease",whiteSpace:"nowrap"}}>{toast}</div>}
    <div style={{maxWidth:"1000px",margin:"0 auto",padding:"24px 16px"}}>
      <div style={{textAlign:"center",marginBottom:"22px"}}>
        <div style={{fontSize:"11px",letterSpacing:"3px",color:"var(--muted)",textTransform:"uppercase",marginBottom:"4px"}}>Daily Thoughtfulness</div>
        <h1 style={{fontFamily:"var(--fd)",fontSize:"clamp(20px,4vw,32px)",fontWeight:"700",color:"var(--text)",margin:"0 0 3px"}}>Your Circle</h1>
        {sentToday.length>0&&<div style={{marginTop:"6px",display:"inline-flex",alignItems:"center",gap:"5px",background:`${theme.accent}14`,border:`1px solid ${theme.accent}28`,padding:"3px 13px",borderRadius:"100px",fontSize:"12px",color:"var(--accent)"}}>💌 {sentToday.length} message{sentToday.length>1?"s":""} sent today</div>}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"250px 1fr",gap:"16px",alignItems:"start"}}>

        {/* SIDEBAR */}
        <div style={{display:"flex",flexDirection:"column",gap:"11px"}}>
          <div style={{background:"var(--surface)",backdropFilter:"blur(10px)",borderRadius:"20px",padding:"15px",border:`1px solid ${theme.border}`,boxShadow:"0 4px 24px rgba(0,0,0,.05)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"11px"}}>
              <span style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)"}}>Your People</span>
              <button className="btn" onClick={()=>setShowAddForm(f=>!f)} style={{background:showAddForm?"var(--bg3)":"var(--dark)",color:showAddForm?"var(--text)":"var(--darkText)",borderRadius:"100px",padding:"3px 12px",fontSize:"11px"}}>{showAddForm?"✕ Cancel":"+ Add"}</button>
            </div>
            {showAddForm&&(<div style={{background:RC[newP.relationship]?.bg,borderRadius:"15px",padding:"12px",marginBottom:"9px",border:`1px solid ${RC[newP.relationship]?.color}30`,animation:"slideDown .2s ease"}}>
              <input placeholder="Full name" value={newP.name} onChange={e=>setNewP(p=>({...p,name:e.target.value}))} style={{width:"100%",border:`1px solid ${theme.border}`,borderRadius:"9px",padding:"7px 10px",fontSize:"13px",background:"rgba(255,255,255,.9)",boxSizing:"border-box",marginBottom:"6px",color:"var(--text)"}}/>
              <select value={newP.relationship} onChange={e=>setNewP(p=>({...p,relationship:e.target.value,nickname:""}))} style={{width:"100%",border:`1px solid ${theme.border}`,borderRadius:"9px",padding:"7px 10px",fontSize:"13px",background:"rgba(255,255,255,.9)",boxSizing:"border-box",marginBottom:"6px",color:"var(--text)",cursor:"pointer"}}>
                {Object.entries(RC).map(([k,v])=><option key={k} value={k}>{v.emoji} {v.label}</option>)}
              </select>
              <input placeholder={`Nickname — e.g. "${RC[newP.relationship]?.ns[0]}"`} value={newP.nickname} onChange={e=>setNewP(p=>({...p,nickname:e.target.value}))} style={{width:"100%",border:`1px solid ${theme.border}`,borderRadius:"9px",padding:"6px 10px",fontSize:"12px",background:"rgba(255,255,255,.9)",boxSizing:"border-box",marginBottom:"5px",color:"var(--text)"}}/>
              <div style={{display:"flex",flexWrap:"wrap",gap:"3px",marginBottom:"6px"}}>{RC[newP.relationship]?.ns.map(s=>(<span key={s} className="chip" onClick={()=>setNewP(p=>({...p,nickname:s}))} style={{background:newP.nickname===s?RC[newP.relationship].color:"rgba(255,255,255,.85)",border:`1px solid ${RC[newP.relationship]?.color}`,borderRadius:"100px",padding:"1px 7px",fontSize:"10px",color:newP.nickname===s?"white":"var(--text)"}}>{s}</span>))}</div>
              <div style={{display:"flex",gap:"5px",marginBottom:"6px"}}>
                <input placeholder="📞 Phone" value={newP.phone} onChange={e=>setNewP(p=>({...p,phone:e.target.value}))} style={{flex:1,border:`1px solid ${theme.border}`,borderRadius:"8px",padding:"6px 8px",fontSize:"11px",background:"rgba(255,255,255,.9)",boxSizing:"border-box",color:"var(--text)"}}/>
                <input placeholder="✉️ Email" value={newP.email} onChange={e=>setNewP(p=>({...p,email:e.target.value}))} style={{flex:1,border:`1px solid ${theme.border}`,borderRadius:"8px",padding:"6px 8px",fontSize:"11px",background:"rgba(255,255,255,.9)",boxSizing:"border-box",color:"var(--text)"}}/>
              </div>
              <button className="btn" onClick={addPerson} style={{width:"100%",background:"var(--dark)",color:"var(--darkText)",borderRadius:"9px",padding:"8px",fontSize:"12px"}}>Add to Circle</button>
            </div>)}
            <div style={{display:"flex",flexDirection:"column",gap:"4px"}}>
              {people.map(person=>{const c=RC[person.relationship];const isAct=person.id===activeId;const pLang=LANGUAGES.find(l=>l.id===(person.language||"en"));return(<div key={person.id} className="pcard" onClick={()=>{setActiveId(person.id);setShowContactPanel(false);setEditContact(null);setShowPersonalize(false);setFreePrompt("");}} style={{display:"flex",alignItems:"center",gap:"8px",padding:"8px 9px",borderRadius:"12px",background:isAct?c.bg:"transparent",border:`1.5px solid ${isAct?c.color:"transparent"}`,boxShadow:isAct?`0 2px 8px ${c.color}33`:"none"}}>
                <div style={{width:"32px",height:"32px",borderRadius:"50%",background:c.bg,border:`1.5px solid ${c.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"14px",flexShrink:0}}>{c.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:"600",color:"var(--text)",fontSize:"12px"}}>{person.name}{sentToday.includes(person.id)&&<span style={{fontSize:"10px",marginLeft:"3px"}}>💌</span>}</div>
                  <div style={{fontSize:"10px",color:"var(--muted)",display:"flex",alignItems:"center",gap:"3px",flexWrap:"wrap"}}>
                    {person.nickname&&<><span style={{color:c.color,fontStyle:"italic"}}>"{person.nickname}"</span><span>·</span></>}
                    <span>{c.label}</span>
                    {hasContact(person)&&<span>📇</span>}
                    {pLang&&pLang.id!=="en"&&<span>{pLang.flag}</span>}
                    {(person.tones||[]).length>0&&<span>🎭</span>}
                    {person.notes&&<span>📝</span>}
                  </div>
                </div>
                <button className="btn" onClick={e=>{e.stopPropagation();removePerson(person.id);}} style={{background:"none",color:"var(--muted)",fontSize:"13px",padding:"2px 4px",opacity:.4}}>×</button>
              </div>);})}
              {people.length===0&&<div style={{textAlign:"center",padding:"16px",color:"var(--muted)",fontSize:"12px"}}>Add someone you love 💛</div>}
            </div>
          </div>
        </div>

        {/* MAIN PANEL */}
        <div style={{display:"flex",flexDirection:"column",gap:"12px"}}>
          {ap&&cfg&&(<>
            <div style={{background:"var(--surface)",backdropFilter:"blur(10px)",borderRadius:"22px",padding:"22px",border:`1px solid ${theme.border}`,boxShadow:"0 8px 40px rgba(0,0,0,.07)"}}>

              {/* Person header */}
              <div style={{display:"flex",alignItems:"flex-start",gap:"12px",marginBottom:"16px"}}>
                <div style={{width:"50px",height:"50px",borderRadius:"50%",background:cfg.bg,border:`2px solid ${cfg.color}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"21px",flexShrink:0,boxShadow:`0 4px 14px ${cfg.color}44`}}>{cfg.emoji}</div>
                <div style={{flex:1}}>
                  <h2 style={{margin:"0 0 4px",fontFamily:"var(--fd)",fontSize:"20px",fontWeight:"600",color:"var(--text)"}}>{ap.name}</h2>
                  {editingNickId===ap.id?(<div style={{display:"flex",alignItems:"center",gap:"5px",flexWrap:"wrap"}}>
                    <span style={{fontSize:"12px",color:"var(--muted)"}}>Called:</span>
                    <input value={tempNick} onChange={e=>setTempNick(e.target.value)} autoFocus onKeyDown={e=>{if(e.key==="Enter")saveNick(ap);if(e.key==="Escape")setEditingNickId(null);}} style={{border:`1.5px solid ${cfg.color}`,borderRadius:"7px",padding:"2px 9px",fontSize:"12px",background:cfg.bg,color:"var(--text)",width:"110px"}}/>
                    <button className="btn" onClick={()=>saveNick(ap)} style={{background:cfg.color,color:"white",borderRadius:"7px",padding:"2px 10px",fontSize:"11px"}}>Save</button>
                    <button className="btn" onClick={()=>setEditingNickId(null)} style={{background:"none",color:"var(--muted)",fontSize:"12px",padding:"2px 5px"}}>✕</button>
                  </div>):(<div>
                    <div style={{display:"flex",alignItems:"center",gap:"6px",flexWrap:"wrap"}}>
                      <div style={{fontSize:"11px",color:"var(--muted)",display:"flex",alignItems:"center",gap:"3px"}}><span style={{display:"inline-block",width:"5px",height:"5px",borderRadius:"50%",background:cfg.color}}/>{cfg.label}</div>
                      {ap.nickname?(<div style={{display:"flex",alignItems:"center",gap:"3px"}}>
                        <span style={{background:cfg.bg,border:`1px solid ${cfg.color}`,borderRadius:"100px",padding:"1px 9px",fontSize:"11px",color:"var(--text)",fontStyle:"italic"}}>"{ap.nickname}"</span>
                        <button className="btn" onClick={()=>{setEditingNickId(ap.id);setTempNick(ap.nickname||"");}} style={{background:"var(--surface)",border:`1px solid ${theme.border}`,borderRadius:"5px",padding:"1px 6px",fontSize:"10px",color:"var(--sub)"}}>edit</button>
                      </div>):(<button className="btn" onClick={()=>{setEditingNickId(ap.id);setTempNick("");}} style={{background:cfg.bg,border:`1px dashed ${cfg.color}`,borderRadius:"100px",padding:"1px 9px",fontSize:"10px",color:"var(--sub)"}}>+ nickname</button>)}
                      {activeLang&&<span style={{background:`${cfg.color}18`,border:`1px solid ${cfg.color}33`,borderRadius:"100px",padding:"1px 8px",fontSize:"10px",color:"var(--text)"}}>{activeLang.flag} {activeLang.nativeName}</span>}
                    </div>
                    {!ap.nickname&&(<div style={{marginTop:"4px"}}><span style={{fontSize:"10px",color:"var(--muted)"}}>Quick: </span>{cfg.ns.map(s=><span key={s} className="chip" onClick={()=>applyNick(ap,s)} style={{background:"rgba(255,255,255,.85)",border:`1px solid ${cfg.color}`,borderRadius:"100px",padding:"1px 7px",fontSize:"10px",color:"var(--text)",marginLeft:"3px"}}>{s}</span>)}</div>)}
                    {activeTones.length>0&&(<div style={{marginTop:"4px",display:"flex",gap:"4px",flexWrap:"wrap",alignItems:"center"}}><span style={{fontSize:"10px",color:"var(--muted)"}}>Tone:</span>{activeTones.map(t=><span key={t.id} style={{background:`${cfg.color}18`,border:`1px solid ${cfg.color}33`,borderRadius:"100px",padding:"1px 7px",fontSize:"10px",color:"var(--text)"}}>{t.emoji} {t.label}</span>)}</div>)}
                    {ap.notes&&<div style={{marginTop:"4px",fontSize:"10px",color:"var(--muted)",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"340px"}}>📝 {ap.notes}</div>}
                  </div>)}
                </div>
                <div style={{display:"flex",flexDirection:"column",gap:"5px",flexShrink:0}}>
                  <button className="btn" onClick={()=>setShowPersonalize(v=>!v)} style={{background:showPersonalize?cfg.color:cfg.bg,color:showPersonalize?"white":"var(--text)",border:`1.5px solid ${cfg.color}`,borderRadius:"11px",padding:"5px 11px",fontSize:"11px",display:"flex",alignItems:"center",gap:"4px"}}><span>✨</span><span>Personalise</span></button>
                  <button className="btn" onClick={()=>{setShowContactPanel(v=>!v);if(!showContactPanel&&!hasContact(ap))setEditContact({phone:ap.phone||"",email:ap.email||""});}} style={{background:hasContact(ap)?cfg.bg:"var(--surface)",border:`1.5px solid ${hasContact(ap)?cfg.color:theme.border}`,borderRadius:"11px",padding:"5px 11px",fontSize:"11px",color:"var(--text)",display:"flex",alignItems:"center",gap:"4px"}}><span>📇</span><span>{hasContact(ap)?"Contact":"+ Contact"}</span></button>
                </div>
                {sentToday.includes(ap.id)&&<div style={{background:"#edfaf2",border:"1px solid #a8d8b8",borderRadius:"100px",padding:"3px 10px",fontSize:"11px",color:"#2a7a4a",flexShrink:0,alignSelf:"flex-start"}}>✓ Sent</div>}
              </div>

              {showPersonalize&&<div style={{marginBottom:"16px"}}><PersonalizationPanel person={ap} config={cfg} onSave={data=>savePersonalize(ap,data)} onClose={()=>setShowPersonalize(false)}/></div>}

              {showContactPanel&&!showPersonalize&&(<div style={{background:cfg.bg,border:`1.5px solid ${cfg.color}33`,borderRadius:"14px",padding:"15px",marginBottom:"14px",animation:"slideDown .22s ease"}}>
                {/* Header */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                  <div>
                    <div style={{fontSize:"13px",fontWeight:"600",color:"var(--text)",fontFamily:"var(--fd)"}}>How to reach {ap.nickname?.trim()||ap.name}</div>
                    <div style={{fontSize:"11px",color:"var(--muted)",marginTop:"2px"}}>Add phone or email to send messages directly</div>
                  </div>
                  <button className="btn" onClick={()=>{setShowContactPanel(false);setEditContact(null);}} style={{background:"none",color:"var(--muted)",fontSize:"15px",padding:"2px 6px",marginLeft:"8px"}}>✕</button>
                </div>
                {/* Import from device — only shown where supported (Android Chrome) */}
                {"contacts"in navigator&&"ContactsManager"in window&&(
                  <button className="btn" onClick={()=>pickContact(ap.id)} disabled={contactLoading}
                    style={{width:"100%",background:"var(--dark)",color:"var(--darkText)",borderRadius:"10px",padding:"9px 14px",fontSize:"13px",display:"flex",alignItems:"center",justifyContent:"center",gap:"7px",marginBottom:"12px"}}>
                    {contactLoading?<div style={{width:"11px",height:"11px",border:"1.5px solid rgba(255,255,255,.4)",borderTopColor:"white",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>:"📱"}
                    {contactLoading?"Importing…":"Import from Contacts"}
                  </button>
                )}
                {/* Always-visible manual entry */}
                <div style={{display:"flex",gap:"8px",flexWrap:"wrap",marginBottom:"10px"}}>
                  <div style={{flex:1,minWidth:"130px"}}>
                    <div style={{fontSize:"11px",color:"var(--muted)",marginBottom:"4px",display:"flex",alignItems:"center",gap:"4px"}}>📞 Phone number</div>
                    <input
                      value={editContact?.phone??ap.phone??""}
                      onChange={e=>setEditContact(c=>({...(c||{phone:ap.phone||"",email:ap.email||""}),phone:e.target.value}))}
                      onFocus={()=>{if(!editContact)setEditContact({phone:ap.phone||"",email:ap.email||""});}}
                      placeholder="e.g. +1 555 000 0000"
                      type="tel"
                      style={{width:"100%",border:`1.5px solid ${cfg.color}44`,borderRadius:"9px",padding:"8px 11px",fontSize:"13px",background:"rgba(255,255,255,.92)",boxSizing:"border-box",color:"var(--text)"}}/>
                  </div>
                  <div style={{flex:1,minWidth:"130px"}}>
                    <div style={{fontSize:"11px",color:"var(--muted)",marginBottom:"4px",display:"flex",alignItems:"center",gap:"4px"}}>✉️ Email address</div>
                    <input
                      value={editContact?.email??ap.email??""}
                      onChange={e=>setEditContact(c=>({...(c||{phone:ap.phone||"",email:ap.email||""}),email:e.target.value}))}
                      onFocus={()=>{if(!editContact)setEditContact({phone:ap.phone||"",email:ap.email||""});}}
                      placeholder="e.g. name@email.com"
                      type="email"
                      style={{width:"100%",border:`1.5px solid ${cfg.color}44`,borderRadius:"9px",padding:"8px 11px",fontSize:"13px",background:"rgba(255,255,255,.92)",boxSizing:"border-box",color:"var(--text)"}}/>
                  </div>
                </div>
                {/* Save button — only shown when there are unsaved changes */}
                {editContact&&<button className="btn" onClick={()=>saveContactEdit(ap)}
                  style={{width:"100%",background:cfg.color,color:"white",borderRadius:"10px",padding:"9px",fontSize:"13px",fontWeight:"600",boxShadow:`0 3px 10px ${cfg.color}44`}}>
                  Save Contact ✓
                </button>}
              </div>)}

              {/* Free prompt */}
              {!showPersonalize&&(<div style={{marginBottom:"12px"}}>
                <div style={{fontSize:"10px",letterSpacing:"1.5px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"6px"}}>💭 What do you want to say? <span style={{textTransform:"none",letterSpacing:"0",fontStyle:"italic"}}>(optional)</span></div>
                <input value={freePrompt} onChange={e=>setFreePrompt(e.target.value)} onKeyDown={e=>e.key==="Enter"&&genMsg(ap,freePrompt)}
                  placeholder={`e.g. "thank her for being there last week" or "something funny about our trip"`}
                  style={{width:"100%",border:`1.5px solid ${cfg.color}44`,borderRadius:"11px",padding:"9px 13px",fontSize:"13px",background:"rgba(255,255,255,.85)",color:"var(--text)",boxSizing:"border-box"}}/>
                <div style={{marginTop:"6px",display:"flex",flexWrap:"wrap",gap:"5px"}}>
                  {FREE_PROMPT_CHIPS.map(c=>(<span key={c} className="chip" onClick={()=>setFreePrompt(c)} style={{background:freePrompt===c?`${cfg.color}22`:`${cfg.color}0e`,border:`1px solid ${cfg.color}30`,borderRadius:"100px",padding:"2px 9px",fontSize:"11px",color:"var(--text)"}}>{c}</span>))}
                </div>
              </div>)}

              {/* Message box */}
              <div style={{background:`linear-gradient(145deg,${cfg.bg},rgba(255,255,255,.92))`,border:`1.5px solid ${cfg.color}`,borderRadius:"16px",padding:"14px 18px",minHeight:"110px",marginBottom:"12px",boxShadow:`0 4px 18px ${cfg.color}1e`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"6px"}}>
                  <div style={{fontFamily:"var(--fd)",fontSize:"34px",color:cfg.color,lineHeight:1,opacity:.32}}>"</div>
                  <div style={{display:"flex",gap:"4px"}}>
                    {!loadingId&&messages[ap.id]&&!isEditing&&<button className="btn" onClick={()=>startEdit(ap)} style={{background:"rgba(255,255,255,.85)",border:`1px solid ${cfg.color}`,borderRadius:"7px",padding:"2px 9px",fontSize:"11px",color:"var(--text)"}}>✏️ Edit</button>}
                    {isEditing&&<><button className="btn" onClick={saveEdit} style={{background:cfg.color,color:"white",borderRadius:"7px",padding:"2px 9px",fontSize:"11px"}}>Save</button><button className="btn" onClick={()=>setEditingMsg(null)} style={{background:"rgba(255,255,255,.85)",border:`1px solid ${theme.border}`,borderRadius:"7px",padding:"2px 8px",fontSize:"11px",color:"var(--sub)"}}>Cancel</button></>}
                  </div>
                </div>
                {loadingId===ap.id?(<div style={{display:"flex",alignItems:"center",gap:"9px",color:"var(--muted)"}}><div style={{width:"13px",height:"13px",border:`2px solid ${cfg.color}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite",flexShrink:0}}/><span style={{fontStyle:"italic",fontSize:"14px",animation:"pulse 1.4s ease infinite"}}>Writing something for {ap.nickname||ap.name}…</span></div>
                ):isEditing?(<textarea ref={taRef} value={editingMsg.text} onChange={e=>setEditingMsg(m=>({...m,text:e.target.value}))} style={{width:"100%",minHeight:"80px",border:"none",background:"transparent",fontSize:"14px",lineHeight:1.85,color:"var(--text)",fontStyle:"italic",boxSizing:"border-box",resize:"none"}}/>
                ):(<p style={{margin:0,fontSize:"14px",lineHeight:1.9,color:"var(--text)",fontStyle:"italic"}}>{curMsg||<span style={{color:"var(--muted)"}}>Tap Generate to create a message…</span>}</p>)}
              </div>

              {/* Action buttons */}
              <div style={{display:"flex",gap:"7px",marginBottom:"12px",flexWrap:"wrap"}}>
                <button className="btn" onClick={()=>genMsg(ap,freePrompt)} disabled={!!loadingId} style={{flex:1,background:"var(--dark)",color:"var(--darkText)",borderRadius:"12px",padding:"11px 13px",fontSize:"13px",letterSpacing:".3px",minWidth:"110px"}}>✦ Generate</button>
                <button className="btn" onClick={()=>copyMsg(ap)} disabled={!curMsg} style={{flex:1,background:copiedId===ap.id?"#edfaf2":cfg.bg,color:copiedId===ap.id?"#2a7a4a":"var(--text)",border:`1.5px solid ${copiedId===ap.id?"#a8d8b8":cfg.color}`,borderRadius:"12px",padding:"11px 13px",fontSize:"13px",minWidth:"95px"}}>{copiedId===ap.id?"✓ Copied":"⎘ Copy"}</button>
              </div>

              {/* Send via */}
              <div>
                <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"8px"}}>Send via</div>
                {avail.length>0?(<div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>{avail.map(pl=>(<button key={pl.id} className="plat-btn" disabled={!curMsg||!!loadingId} onClick={()=>sendVia(ap,pl,curMsg)} style={{background:pl.bg,border:`1.5px solid ${pl.color}33`,color:"var(--text)",padding:"7px 12px",borderRadius:"11px",fontSize:"12px",display:"flex",alignItems:"center",gap:"6px",opacity:(!curMsg||!!loadingId)?.35:1}}><span style={{fontSize:"14px"}}>{pl.icon}</span><span>{pl.label}</span></button>))}</div>
                ):(<div style={{display:"flex",alignItems:"center",gap:"10px",background:"var(--surface)",border:`1.5px dashed ${theme.border}`,borderRadius:"12px",padding:"11px 14px"}}><span style={{fontSize:"17px"}}>📇</span><div><div style={{fontSize:"12px",color:"var(--text)",fontFamily:"var(--fd)",fontWeight:"600",marginBottom:"2px"}}>Add contact info to send directly</div><div style={{fontSize:"11px",color:"var(--muted)"}}>Tap 📇 Contact above to add phone or email</div></div><button className="btn" onClick={()=>{setShowContactPanel(true);setEditContact({phone:ap.phone||"",email:ap.email||""});}} style={{marginLeft:"auto",background:"var(--dark)",color:"var(--darkText)",borderRadius:"9px",padding:"6px 12px",fontSize:"11px",flexShrink:0}}>Add Now</button></div>)}
              </div>
            </div>

            

            {people.length>1&&(<div>
              <div style={{fontSize:"10px",letterSpacing:"2px",textTransform:"uppercase",color:"var(--muted)",marginBottom:"7px",paddingLeft:"2px"}}>Quick Switch</div>
              <div style={{display:"flex",gap:"6px",flexWrap:"wrap"}}>{people.filter(p=>p.id!==activeId).map(person=>{const c=RC[person.relationship];return(<button key={person.id} className="btn" onClick={()=>{setActiveId(person.id);setShowContactPanel(false);setEditContact(null);setShowPersonalize(false);setFreePrompt("");}} style={{display:"flex",alignItems:"center",gap:"5px",background:"var(--surface)",border:`1.5px solid ${c.color}44`,borderRadius:"100px",padding:"5px 12px",fontSize:"12px",color:"var(--text)"}}><span>{c.emoji}</span><span>{person.nickname||person.name}</span>{sentToday.includes(person.id)&&<span>💌</span>}</button>);})}</div>
            </div>)}
          </>)}
        </div>
      </div>
    </div>
  </div>);}

export default function App(){
  const[page,setPage]=useState("home");
  const[theme,setTheme]=useState(THEMES[0]);
  const[showTheme,setShowTheme]=useState(false);

  useEffect(()=>{
    // ── Sentry error monitoring ──────────────────────────────────────────
    // Replace YOUR_SENTRY_DSN below with the DSN from your Sentry project.
    // (sentry.io → Settings → Projects → your project → Client Keys → DSN)
    const SENTRY_DSN="https://dc1ffcbb399e1d8474063a475202fb1a@o4511006908219392.ingest.us.sentry.io/4511007099387904";
    if(SENTRY_DSN!=="YOUR_SENTRY_DSN"){
      const s=document.createElement("script");
      s.src="https://browser.sentry-cdn.com/7.99.0/bundle.min.js";
      s.crossOrigin="anonymous";
      s.onload=()=>{window.Sentry&&window.Sentry.init({
        dsn:SENTRY_DSN,
        environment:window.location.hostname==="localhost"?"development":"production",
        tracesSampleRate:1.0,
      });};
      document.head.appendChild(s);
    }
    // ────────────────────────────────────────────────────────────────────
    try{const raw=localStorage.getItem("heartfelt-theme");if(raw){setTheme(JSON.parse(raw));}}catch{}
  },[]);
  function applyTheme(t){setTheme(t);try{localStorage.setItem("heartfelt-theme",JSON.stringify(t));}catch{}}

  useEffect(()=>{window.scrollTo(0,0);},[page]);

  return(<><style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');`}</style>
    <GlobalStyles theme={theme}/>
    <Nav page={page} setPage={setPage} theme={theme} onThemeClick={()=>setShowTheme(v=>!v)}/>
    {showTheme&&<ThemePanel theme={theme} setTheme={t=>{applyTheme(t);setShowTheme(false);}} onClose={()=>setShowTheme(false)}/>}
    {page==="home"&&<LandingPage setPage={setPage} theme={theme}/>}
    {page==="app" &&<AppPage theme={theme}/>}
    {page==="share"&&<SharePage setPage={setPage} theme={theme}/>}
    {page==="faq" &&<FAQPage setPage={setPage} theme={theme}/>}
    <SpeedInsights />
  </>);}
