import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key bulunamadı." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const { imageBase64, promptText } = await req.json();

    const parts: any[] = [
      { text: "Sen gelişmiş bir matematik öğretmenisin. Verilen problemi adım adım açıkla. Matematiksel ifadeleri LaTeX formatında ver (örn: $x^2 + 2x + 1$). Cevabı Türkçe ver." }
    ];

    if (promptText) {
      parts.push({ text: `Soru: ${promptText}` });
    }

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      parts.push({
        inlineData: {
          mimeType: "image/png",
          data: cleanBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ role: 'user', parts }]
    });

    return NextResponse.json({ result: response.text });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Çözüm sırasında bir hata oluştu." }, { status: 500 });
  }
}
