import { GoogleGenAI, Type } from "@google/genai";
import { JournalEntry, AnalysisResult } from '../types';

const initializeAI = () => {
  // API key availability is guaranteed by the environment
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeJournalEntries = async (entries: JournalEntry[]): Promise<AnalysisResult | null> => {
  if (entries.length === 0) return null;

  const ai = initializeAI();

  // Prepare data for the model
  // Limit to last 20 entries to fit context and stay relevant
  const dataToAnalyze = entries.slice(0, 20).map(e => ({
    date: e.dateString,
    text: e.content
  }));

  const prompt = `
    Analyze the following journal entries from a user. 
    Return a JSON object containing:
    1. 'overallVibe': A short 2-3 word description of the general mood.
    2. 'moodTrend': An array where you estimate a sentiment score (0-100, where 0 is very negative/sad and 100 is very positive/happy) for each entry.
    3. 'topThemes': An array of the top 3 recurring topics or emotions with a count (frequency).
    4. 'personalizedAdvice': A supportive, psychological-based paragraph (approx 50 words) giving advice or reflection based on the entries.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: JSON.stringify(dataToAnalyze) + "\n\n" + prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallVibe: { type: Type.STRING },
            moodTrend: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  date: { type: Type.STRING },
                  score: { type: Type.NUMBER }
                }
              }
            },
            topThemes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  theme: { type: Type.STRING },
                  count: { type: Type.NUMBER }
                }
              }
            },
            personalizedAdvice: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AnalysisResult;
    }
    return null;

  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw new Error("Unable to analyze journal entries at this time.");
  }
};
