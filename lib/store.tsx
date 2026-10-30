"use client";
import React,{createContext,useContext,useEffect,useMemo,useState} from "react";
import type {Task,Subtask,Conversation,Message,MemoryItem,Schedule,Settings,Profile} from "./types";
import {demoTasks,demoSubtasks,demoConversations,demoMessages,demoMemories,demoSchedules} from "./demo";
import {uid,todayStr} from "./utils";
interface State{tasks:Task[];subtasks:Subtask[];conversations:Conversation[];messages:Message[];memories:MemoryItem[];schedules:Schedule[];settings:Settings;profile:Profile}
const defaultSettings:Settings={theme:"light",language:"en",style:"balanced",creativity:"medium",temperature:0.7,memoryEnabled:true,notifications:{daily:true,deadline:true,weekly:false}};
const initial:State={tasks:demoTasks,subtasks:demoSubtasks,conversations:demoConversations,messages:demoMessages,memories:demoMemories,schedules:demoSchedules,settings:defaultSettings,profile:{full_name:"Alex Morgan",email:"alex@example.com",role:"Product Designer & Student"}};
interface Ctx extends State{
 addTask:(t:Partial<Task>)=>Task; updateTask:(id:string,p:Partial<Task>)=>void; deleteTask:(id:string)=>void; toggleTask:(id:string)=>void;
 addSubtask:(taskId:string,title:string)=>void; toggleSubtask:(id:string)=>void; deleteSubtask:(id:string)=>void;
 addConversation:()=>string; renameConversation:(id:string,title:string)=>void; deleteConversation:(id:string)=>void; addMessage:(cid:string,role:"user"|"assistant",content:string)=>void;
 addMemory:(content:string,category:string)=>void; updateMemory:(id:string,content:string)=>void; deleteMemory:(id:string)=>void;
 addSchedule:(s:Omit<Schedule,"id">)=>void; deleteSchedule:(id:string)=>void;
 setSettings:(s:Partial<Settings>)=>void; setProfile:(p:Partial<Profile>)=>void; resetDemo:()=>void;
}
const C=createContext<Ctx|null>(null);
export function StoreProvider({children}:{children:React.ReactNode}){
 const [state,setState]=useState<State>(initial); const [loaded,setLoaded]=useState(false);
 useEffect(()=>{try{const raw=localStorage.getItem("orbit-store-v1"); if(raw) setState({...initial,...JSON.parse(raw)});}catch{} setLoaded(true);},[]);
 useEffect(()=>{if(loaded) localStorage.setItem("orbit-store-v1",JSON.stringify(state)); document.documentElement.classList.toggle("dark",state.settings.theme==="dark");},[state,loaded]);
 const api:Ctx=useMemo(()=>({...state,
  addTask:(t)=>{const task:Task={id:uid(),title:t.title||"Untitled task",description:t.description||"",priority:t.priority||"Medium",status:t.status||"todo",due_date:t.due_date||todayStr(),estimated_duration:t.estimated_duration||30,category:t.category||"General",created_at:todayStr(),updated_at:todayStr()}; setState(s=>({...s,tasks:[task,...s.tasks]})); return task;},
  updateTask:(id,p)=>setState(s=>({...s,tasks:s.tasks.map(t=>t.id===id?{...t,...p,updated_at:todayStr()}:t)})),
  deleteTask:(id)=>setState(s=>({...s,tasks:s.tasks.filter(t=>t.id!==id),subtasks:s.subtasks.filter(x=>x.taskId!==id)})),
  toggleTask:(id)=>setState(s=>({...s,tasks:s.tasks.map(t=>t.id===id?{...t,status:t.status==="completed"?"todo":"completed",completed_at:t.status==="completed"?undefined:todayStr()}:t)})),
  addSubtask:(taskId,title)=>setState(s=>({...s,subtasks:[...s.subtasks,{id:uid(),taskId,title,is_completed:false}]})),
  toggleSubtask:(id)=>setState(s=>({...s,subtasks:s.subtasks.map(x=>x.id===id?{...x,is_completed:!x.is_completed}:x)})),
  deleteSubtask:(id)=>setState(s=>({...s,subtasks:s.subtasks.filter(x=>x.id!==id)})),
  addConversation:()=>{const id=uid(); setState(s=>({...s,conversations:[{id,title:"New conversation",created_at:todayStr(),updated_at:todayStr()},...s.conversations]})); return id;},
  renameConversation:(id,title)=>setState(s=>({...s,conversations:s.conversations.map(c=>c.id===id?{...c,title}:c)})),
  deleteConversation:(id)=>setState(s=>({...s,conversations:s.conversations.filter(c=>c.id!==id),messages:s.messages.filter(m=>m.conversation_id!==id)})),
  addMessage:(cid,role,content)=>setState(s=>({...s,messages:[...s.messages,{id:uid(),conversation_id:cid,role,content,created_at:new Date().toISOString()}],conversations:s.conversations.map(c=>c.id===cid&&s.messages.filter(m=>m.conversation_id===cid).length===0?{...c,title:content.slice(0,42)}:c)})),
  addMemory:(content,category)=>setState(s=>({...s,memories:[{id:uid(),content,category,created_at:todayStr()},...s.memories]})),
  updateMemory:(id,content)=>setState(s=>({...s,memories:s.memories.map(m=>m.id===id?{...m,content}:m)})),
  deleteMemory:(id)=>setState(s=>({...s,memories:s.memories.filter(m=>m.id!==id)})),
  addSchedule:(sch)=>setState(s=>({...s,schedules:[...s.schedules,{...sch,id:uid()}].sort((a,b)=>(a.date+a.start_time).localeCompare(b.date+b.start_time))})),
  deleteSchedule:(id)=>setState(s=>({...s,schedules:s.schedules.filter(x=>x.id!==id)})),
  setSettings:(p)=>setState(s=>({...s,settings:{...s.settings,...p,notifications:{...s.settings.notifications,...(p.notifications||{})}}})),
  setProfile:(p)=>setState(s=>({...s,profile:{...s.profile,...p}})),
  resetDemo:()=>setState(initial),
 }),[state]);
 if(!loaded) return <div className="p-8 text-muted">Loading ORBIT…</div>;
 return <C.Provider value={api}>{children}</C.Provider>;
}
export function useStore(){const v=useContext(C); if(!v) throw new Error("useStore outside provider"); return v;}
