import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
    const  { promt }  = await req.json();

    const response = await fetch("https://api.Groquery.com/v1/generate", {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-API-Key": process.env.GROQUERY_API_KEY || "",

        },
        body: JSON.stringify({
            model: "llama-2-7b-instruct.gguf",
            max_tokens: 4000,
            messages: [{ role: "user", content: promt}],

        }), 
    });
    if (!response.ok) {
        return NextResponse.json({ error: "Erreur lors de la génération du quiz" }, { status: 500 });
    }

    const data = await response.json();
    const content = data.content.map((b: { text?: string})=> b.text || "").join("");

    return NextResponse.json({ content });
}