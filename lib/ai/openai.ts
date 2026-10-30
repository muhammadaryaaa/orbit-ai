export async function callOpenAI(messages:{role:string;content:string}[], opts:{style?:string}={}){
 const key=process.env.OPENAI_API_KEY; if(!key) return null;
 const model=process.env.OPENAI_MODEL||"gpt-4o-mini";
 const system=`You are ORBIT AI, an intelligent personal productivity companion. Your mission is to help users think clearly, organize responsibilities, and make meaningful progress. Be practical, empathetic, and structured. Do not overwhelm users. When users describe a large goal, break it into achievable steps. When they have many tasks, help identify what matters most. Respect the user's preferred language and response style (${opts.style||"balanced"}). Never invent personal information. Focus on actionable recommendations.`;
 try{
  const res=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${key}`},body:JSON.stringify({model,temperature:0.7,max_tokens:1500,messages:[{role:"system",content:system},...messages]})});
  if(!res.ok) return null; const data=await res.json(); return data.choices?.[0]?.message?.content as string|null;
 }catch{return null}
}
