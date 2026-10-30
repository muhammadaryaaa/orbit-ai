export type Lang="en"|"id";
export function detectLang(text:string, pref?:string):Lang{
 if(pref==="id"||pref==="en") return pref as Lang;
 const idWords=["saya","aku","tolong","hari ini","tugas","besok","jadwal","belajar","bagaimana","kenapa","bantu","rencana"];
 const lower=text.toLowerCase(); const hits=idWords.filter(w=>lower.includes(w)).length; return hits>=2?"id":"en";
}
export function breakdownTask(title:string,description=""):string[]{
 const t=(title+" "+description).toLowerCase();
 if(t.includes("portfolio")||t.includes("website")||t.includes("web")) return ["Define the structure and goals","Prepare content and visual assets","Design the main layout / homepage","Implement the responsive layout","Add content and polish details","Test on mobile and desktop, then deploy"];
 if(t.includes("study")||t.includes("exam")||t.includes("belajar")||t.includes("ujian")) return ["List the topics you need to cover","Gather notes and materials for each topic","Study topic by topic in 25-minute focus blocks","Solve practice questions","Review mistakes and weak areas","Do a final review the day before"];
 if(t.includes("presentation")||t.includes("presentasi")||t.includes("slide")) return ["Define the one key message","Outline the slide flow","Gather data and examples","Design the slides simply and consistently","Write speaker notes","Rehearse out loud and time it"];
 if(t.includes("video")||t.includes("content")||t.includes("konten")) return ["Define the topic and hook","Write a short outline or script","Prepare assets and recording setup","Record the main material","Edit and add captions","Review, export, and publish"];
 if(t.includes("report")||t.includes("laporan")||t.includes("essay")||t.includes("paper")) return ["Clarify the question and outline","Collect sources and data","Write the introduction and structure","Draft each section one by one","Add citations and formatting","Proofread and revise"];
 // Generic but actionable breakdown derived from the title
 const clean=title.replace(/^(build|create|make|finish|complete)\s+/i,"");
 return [`Clarify the final outcome for: ${clean}`,`List materials and information you need`,`Do the first concrete draft / version of ${clean}`,`Review the draft and fix the biggest gaps`,`Finish remaining details`,`Check the result and mark it done`];
}
export function chatFallback(prompt:string, lang:Lang, style="balanced"):string{
 const p=prompt.toLowerCase();
 const id=lang==="id";
 if(p.includes("break down")||p.includes("breakdown")||p.includes("pecah")||p.includes("bagi tugas")){
   const steps=breakdownTask(prompt); return id?`Baik, kita pecah jadi langkah kecil yang bisa langsung dikerjakan:\n\n${steps.map((s,i)=>`${i+1}. **${s}**`).join("\n")}\n\nMulai dari langkah 1 saja dulu — jangan pikirkan semuanya sekaligus.`:`Let's break it into small, doable steps:\n\n${steps.map((s,i)=>`${i+1}. **${s}**`).join("\n")}\n\nStart with step 1 only — you don't need to hold the whole project in your head.`;
 }
 if(p.includes("procrastinat")||p.includes("menunda")||p.includes("malas")||p.includes("sulit mulai")){
   return id?`Menunda biasanya bukan soal malas — tugasnya terasa terlalu besar atau tidak jelas. Coba ini:\n\n1. **Kecilkan sampai terasa mudah** — target 10 menit saja, bukan selesai semua.\n2. **Tulis langkah pertama secara konkret** — misalnya "buka dokumen dan tulis judul", bukan "kerjakan tugas".\n3. **Jauhkan HP selama 25 menit** dan pakai timer.\n4. **Setelah mulai, momentum biasanya datang sendiri.**\n\nMau saya bantu pecah tugas yang sedang kamu tunda jadi langkah pertama yang sangat kecil?`:`Procrastination is usually not laziness — the task feels too big or too vague. Try this:\n\n1. **Shrink it until it feels easy** — aim for just 10 minutes, not finishing everything.\n2. **Make the first step concrete** — "open the document and write the title", not "do the assignment".\n3. **Put your phone away for 25 minutes** and use a timer.\n4. **Once you start, momentum usually follows.**\n\nWant me to break the task you're avoiding into one very small first step?`;
 }
 if(p.includes("prioriti")||p.includes("priorit")||p.includes("what should i")||p.includes("apa yang harus")){
   return id?`Cara menentukan prioritas hari ini:\n\n1. **Urgent + deadline dekat** kerjakan dulu, tapi jangan biarkan menghabiskan seluruh hari.\n2. **Penting untuk tujuan jangka panjang** — jadwalkan 1 blok fokus, walau hanya 60–90 menit.\n3. **Tugas kecil (<15 menit)** kumpulkan dan selesaikan sekaligus di sela waktu.\n4. Sisanya bisa menunggu besok — daftar yang realistis lebih baik daripada daftar yang sempurna.\n\nAturan praktis: kalau hanya bisa menyelesaikan **3 hal** hari ini, pilih 1 urgent, 1 penting, dan 1 yang cepat selesai.`:`Here's a practical way to prioritize today:\n\n1. **Urgent with a near deadline** goes first — but don't let it consume the whole day.\n2. **Important for a long-term goal** gets one focus block, even just 60–90 minutes.\n3. **Small tasks (<15 min)** — batch them together between bigger work.\n4. Everything else can wait until tomorrow. A realistic list beats a perfect one.\n\nRule of thumb: if you could only finish **3 things** today, pick 1 urgent, 1 important, and 1 quick win.`;
 }
 if(p.includes("plan my day")||p.includes("schedule")||p.includes("jadwal")||p.includes("rencana hari")||p.includes("study schedule")||p.includes("jadwal belajar")){
   const study=p.includes("study")||p.includes("belajar");
   return id?`Ini rencana ${study?"belajar":"hari"} yang realistis:\n\n- **09.00–10.30** Blok fokus 1 — tugas terpenting, HP jauh\n- **10.30–10.45** Istirahat\n- **10.45–12.00** Blok fokus 2 — lanjutkan atau tugas kedua\n- **12.00–13.00** Makan siang + istirahat beneran\n- **13.00–14.30** Tugas ringan / administrasi / email\n- **14.30–15.00** Review progres dan tulis 3 prioritas besok\n\nKuncinya: jadwalkan lebih sedikit dari yang kamu kira mampu. Selesai lebih awal itu motivasi, bukan kegagalan.`:`Here is a realistic ${study?"study schedule":"plan for your day"}:\n\n- **09:00–10:30** Focus block 1 — your most important task, phone away\n- **10:30–10:45** Break\n- **10:45–12:00** Focus block 2 — continue, or your second task\n- **12:00–13:00** Lunch and a real rest\n- **13:00–14:30** Lighter work — admin, messages, small tasks\n- **14:30–15:00** Review progress and write tomorrow's top 3\n\nThe key: schedule less than you think you can do. Finishing early is motivation, not failure.`;
 }
 if(p.includes("hello")||p.includes("hi")||p.includes("halo")||p.includes("hai")){
   return id?`Halo! Saya ORBIT AI. Saya bisa membantu merencanakan hari, memprioritaskan tugas, memecah proyek besar jadi langkah kecil, atau membuat jadwal belajar yang realistis. Apa yang sedang ingin kamu bereskan hari ini?`:`Hello! I'm ORBIT AI. I can help you plan your day, prioritize tasks, break a big project into small steps, or build a realistic study schedule. What would you like to get sorted today?`;
 }
 // Default: structured, specific answer referencing the user's actual words
 const topic=prompt.trim().replace(/\.$/,"");
 return id?`Baik, mari kita bereskan: **${topic}**.\n\nLangkah praktisnya:\n\n1. **Jelaskan dulu hasil akhirnya** — selesai itu terlihat seperti apa, dalam satu kalimat.\n2. **Tulis langkah terkecil berikutnya** yang bisa dilakukan dalam 15 menit.\n3. **Kerjakan dalam blok fokus 25 menit**, lalu istirahat 5 menit.\n4. **Catat progresnya** di Tasks agar terlihat maju.\n\nKalau kamu ceritakan deadline dan seberapa besar tugasnya, saya bisa bantu buat urutan yang lebih spesifik.`:`Let's get this sorted: **${topic}**.\n\nA practical way forward:\n\n1. **Define the finished state** — what "done" looks like, in one sentence.\n2. **Write the smallest next step** you can do in 15 minutes.\n3. **Work in a 25-minute focus block**, then take a 5-minute break.\n4. **Track it in Tasks** so progress stays visible.\n\nTell me the deadline and how big it feels, and I'll help you sequence it more specifically.${style==="concise"?"\n\n(Tip: switch response style in Settings if you want shorter or more detailed answers.)":""}`;
}
export function recommend(tasks:{title:string;priority:string;status:string;due_date:string}[],lang:Lang="en"):string{
 const open=tasks.filter(t=>t.status!=="completed");
 if(!open.length) return lang==="id"?"Semua tugas selesai. Pakai waktu ini untuk review minggu ini dan siapkan 3 prioritas besok.":"Everything is complete. Use this time to review the week and set tomorrow's top 3.";
 const urgent=open.find(t=>t.priority==="Urgent")||open.find(t=>t.priority==="High")||open[0];
 return lang==="id"?`Mulai dari "${urgent.title}" — ini prioritas ${urgent.priority.toLowerCase()} dan paling berdampak hari ini. Blok 60–90 menit tanpa gangguan, lalu ambil tugas kecil sebagai penutup agar hari terasa selesai.`:`Start with "${urgent.title}" — it's your ${urgent.priority.toLowerCase()}-priority item and will move today forward most. Give it one 60–90 minute uninterrupted block, then finish with a small task so the day feels closed.`;
}
export function planDay(tasks:{title:string;priority:string;estimated_duration:number;status:string}[],lang:Lang="en"){
 const open=tasks.filter(t=>t.status!=="completed").sort((a,b)=>({Urgent:0,High:1,Medium:2,Low:3} as any)[a.priority]-({Urgent:0,High:1,Medium:2,Low:3} as any)[b.priority]);
 const slots=["09:00","10:45","13:00","14:30","16:00"]; const out:{title:string;start_time:string;end_time:string}[]=[];
 open.slice(0,5).forEach((t,i)=>{const start=slots[i]; const [h,m]=start.split(":").map(Number); const endMin=h*60+m+Math.min(t.estimated_duration||60,90); const end=`${String(Math.floor(endMin/60)).padStart(2,"0")}:${String(endMin%60).padStart(2,"0")}`; out.push({title:t.title,start_time:start,end_time:end});});
 return out;
}
