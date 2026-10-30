"use client";
import {Suspense,useEffect,useRef,useState} from "react"; import {useSearchParams} from "next/navigation"; import {useStore} from "@/lib/store"; import {Button} from "@/components/ui"; import Markdown from "@/components/Markdown"; import {Send,Plus,Trash2,Pencil,Copy,RotateCcw,Check} from "lucide-react";
const prompts=["Help me plan my day.","Break down my project into smaller tasks.","What should I prioritize today?","Create a realistic study schedule.","Help me overcome procrastination."];
function ChatInner(){
 const s=useStore(); const params=useSearchParams(); const [active,setActive]=useState(s.conversations[0]?.id||""); const [input,setInput]=useState(""); const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const [copied,setCopied]=useState(""); const bottom=useRef<HTMLDivElement>(null); const ta=useRef<HTMLTextAreaElement>(null);
 const msgs=s.messages.filter(m=>m.conversation_id===active);
 useEffect(()=>{bottom.current?.scrollIntoView({behavior:"smooth"})},[msgs,loading]);
 useEffect(()=>{const q=params.get("q"); if(q){let cid=active; if(!cid){cid=s.addConversation(); setActive(cid);} setTimeout(()=>send(q,cid),50);} // eslint-disable-next-line
 },[]); 
 async function send(text?:string,cidOverride?:string){
   const content=(text??input).trim(); if(!content||loading) return; let cid=cidOverride||active; if(!cid){cid=s.addConversation(); setActive(cid);}
   s.addMessage(cid,"user",content); setInput(""); setLoading(true); setError("");
   const history=[...s.messages.filter(m=>m.conversation_id===cid),{role:"user",content}].map(m=>({role:m.role,content:m.content}));
   try{const r=await fetch("/api/ai/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({messages:history,language:s.settings.language,style:s.settings.style})}); const d=await r.json(); if(!r.ok) throw new Error(d.error||"AI request failed"); s.addMessage(cid,"assistant",d.content);}catch(e:any){setError(e.message||"Something went wrong. Please retry.");} finally{setLoading(false);}
 }
 function retry(){const last=[...msgs].reverse().find(m=>m.role==="user"); if(last) send(last.content);}
 return <div className="flex gap-5">
  <aside className="hidden w-60 shrink-0 lg:block"><Button onClick={()=>{const id=s.addConversation(); setActive(id);}} className="w-full"><Plus size={16}/> New conversation</Button>
  <div className="mt-3 space-y-1">{s.conversations.map(c=><div key={c.id} className={`group flex items-center gap-1 rounded-md px-3 py-2 text-sm cursor-pointer ${c.id===active?"bg-primarySoft font-semibold":"hover:bg-surface"}`} onClick={()=>setActive(c.id)}><span className="flex-1 truncate">{c.title}</span><button aria-label="Rename" onClick={e=>{e.stopPropagation(); const t=prompt("Rename conversation",c.title); if(t) s.renameConversation(c.id,t);}}><Pencil size={13}/></button><button aria-label="Delete" onClick={e=>{e.stopPropagation(); if(confirm("Delete this conversation?")){s.deleteConversation(c.id); if(active===c.id) setActive("");}}}><Trash2 size={13}/></button></div>)}</div></aside>
  <section className="min-w-0 flex-1">
   <h1 className="font-heading text-2xl font-bold">ORBIT AI</h1><p className="text-sm text-muted">Ask in English or Indonesian — ORBIT replies in your language.</p>
   <div className="mt-4 space-y-4 rounded-lg border border-border bg-surface p-5 min-h-[420px]">
    {!msgs.length&&<div><p className="font-heading font-semibold">Start with a suggested prompt</p><div className="mt-3 flex flex-wrap gap-2">{prompts.map(p=><button key={p} onClick={()=>send(p)} className="rounded-full border border-border px-3 py-1.5 text-sm hover:bg-primarySoft">{p}</button>)}</div></div>}
    {msgs.map(m=><div key={m.id} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w-[85%] rounded-lg px-4 py-3 ${m.role==="user"?"bg-primary text-white":"bg-bg border border-border"}`}>{m.role==="assistant"?<><Markdown content={m.content}/><div className="mt-2 flex gap-2"><button className="text-xs text-muted inline-flex gap-1 items-center" onClick={()=>{navigator.clipboard?.writeText(m.content); setCopied(m.id);}}>{copied===m.id?<Check size={12}/>:<Copy size={12}/>} Copy</button><button className="text-xs text-muted inline-flex gap-1 items-center" onClick={retry}><RotateCcw size={12}/> Retry</button></div></>:<p className="text-sm whitespace-pre-wrap">{m.content}</p>}</div></div>)}
    {loading&&<p className="text-sm text-muted animate-pulse">ORBIT is thinking…</p>}{error&&<div className="rounded-md bg-red-50 text-danger text-sm p-3 flex justify-between">{error}<button onClick={retry} className="font-semibold">Retry</button></div>}<div ref={bottom}/></div>
   {msgs.length>0&&<div className="mt-3 flex flex-wrap gap-2">{prompts.slice(0,3).map(p=><button key={p} onClick={()=>send(p)} className="rounded-full border border-border bg-surface px-3 py-1 text-xs hover:bg-primarySoft">{p}</button>)}</div>}
   <form onSubmit={e=>{e.preventDefault(); send();}} className="mt-4 flex items-end gap-2"><textarea ref={ta} aria-label="Message ORBIT AI" value={input} onChange={e=>{setInput(e.target.value); e.target.style.height="auto"; e.target.style.height=Math.min(e.target.scrollHeight,160)+"px";}} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault(); send();}}} rows={1} placeholder="Message ORBIT AI… (Enter to send, Shift+Enter for new line)" className="flex-1 resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"/><Button type="submit" disabled={!input.trim()||loading}><Send size={16}/> Send</Button></form>
  </section></div>;
}
export default function ChatPage(){return <Suspense fallback={<p>Loading…</p>}><ChatInner/></Suspense>}
