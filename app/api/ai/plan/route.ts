import {NextResponse} from "next/server"; import {z} from "zod"; import {planDay} from "@/lib/ai/fallback";
const Schema=z.object({tasks:z.array(z.object({title:z.string(),priority:z.string(),estimated_duration:z.number(),status:z.string()})),date:z.string().optional(),language:z.enum(["en","id"]).optional()});
export async function POST(req:Request){try{const {tasks,language}=Schema.parse(await req.json()); return NextResponse.json({plan:planDay(tasks,language||"en")});}catch{return NextResponse.json({error:"Invalid request"},{status:400})}}
