export const uid=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
export const todayStr=()=>new Date().toISOString().slice(0,10);
export function formatDate(d:string){try{return new Date(d+"T00:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short",year:"numeric"})}catch{return d}}
