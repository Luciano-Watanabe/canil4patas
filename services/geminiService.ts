import { GoogleGenAI } from "@google/genai";

export async function generateMessageIdea(): Promise<string> {
  // IMPORTANT: The API key must be set in the environment variable `process.env.API_KEY`
  // Fix: Removed the check for process.env.API_KEY to align with guidelines that assume it is always present.
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Gere uma mensagem curta e amigável para um cliente de um canil, em português do Brasil. A mensagem pode ser sobre um novo filhote, um lembrete de vacina ou apenas um 'olá'. Dê apenas a mensagem, sem introduções.",
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content with Gemini:", error);
    return "Não foi possível gerar uma ideia de mensagem. Tente novamente mais tarde.";
  }
}
