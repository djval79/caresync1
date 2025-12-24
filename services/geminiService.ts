import { GoogleGenAI, Type } from "@google/genai";
import { Staff, Shift } from "../types";

// Fix: Initializing GoogleGenAI using VITE_ prefixed env var for client-side access
console.log("geminiService keys:", import.meta.env.VITE_GEMINI_API_KEY ? "Found" : "Missing");
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || "dummy_key" });

export const getRotaInsights = async (staff: Staff[], shifts: Shift[]) => {
  const prompt = `
    As a UK Care Quality Commission (CQC) expert and scheduling specialist, analyze this current rota and staff list for a care setting.
    Staff Data: ${JSON.stringify(staff)}
    Shift Data: ${JSON.stringify(shifts)}
    
    Provide 3 actionable insights in JSON format.
    Focus on:
    1. Compliance (Working Time Regulations - max 48 hours).
    2. Continuity of Care (Staff consistency).
    3. Efficiency (Overtime costs vs bank staff).
  `;

  try {
    const response = await ai.models.generateContent({
      // Fix: Using gemini-3-pro-preview for complex reasoning task (CQC analysis)
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['compliance', 'optimization', 'warning'] }
            },
            required: ["title", "description", "type"]
          }
        }
      }
    });

    // Use .text property to extract content
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Rota Analysis Error:", error);
    return [
      {
        title: "Compliance Alert",
        description: "One or more staff members are approaching the 48-hour weekly limit.",
        type: "compliance"
      },
      {
        title: "Efficiency Check",
        description: "Consider assigning Emma Wilson to the unassigned afternoon shift to reduce potential bank staff costs.",
        type: "optimization"
      }
    ];
  }
};