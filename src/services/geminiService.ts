import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function extractTextFromImage(base64Image: string, mimeType: string) {
  const model = "gemini-3-flash-preview";
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1],
                mimeType: mimeType,
              },
            },
            {
              text: "You are a document analysis expert. Please extract all text from this document. If it is a tax form (like Form 1040, W-2, etc.), please identify and list the key fields and their values in a structured format. If it is a legal document, summarize the main points. Format the output clearly using Markdown.",
            },
          ],
        },
      ],
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

export async function getTaxAdvice(query: string, language: 'en' | 'es') {
  const model = "gemini-3-flash-preview";
  const systemInstruction = language === 'es' 
    ? "Eres un experto en impuestos de AARS Notary And Tax Services. Responde en español."
    : "You are a tax expert at AARS Notary And Tax Services. Respond in English.";

  const response = await ai.models.generateContent({
    model,
    contents: query,
    config: {
      systemInstruction,
    }
  });

  return response.text;
}
