import {NextResponse} from "next/server"; import {z} from "zod"; import {recommend} from "@/lib/ai/fallback";
const Schema=z.object({tasks:z.array(z.object({title:z.string(),priority:z.string(),status:z.string(),due_date:z.string()})),language:z.enum(["en","id"]).optional()});
export async function POST(req:Request){try{const {tasks,language}=Schema.parse(await req.json()); return NextResponse.json({recommendation:recommend(tasks,language||"en")});}catch{return NextResponse.json({error:"Invalid request"},{status:400})}}
