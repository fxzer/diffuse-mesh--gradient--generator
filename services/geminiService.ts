
import { GoogleGenAI, Type } from "@google/genai";
import { ColorTheme } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateAIPalette = async (prompt: string): Promise<ColorTheme> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `生成一个高级感十足的弥散渐变配色方案。基于以下氛围关键词： "${prompt}"。
      提供 5 个和谐的十六进制（HEX）颜色，用于弥散渐变效果。
      并提供一个适合的背景底色（通常是白色，或者主色调的极浅/极深版本）。
      请用中文命名这个主题。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "主题的中文名称" },
            colors: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "5 个 HEX 颜色字符串"
            },
            background: { type: Type.STRING, description: "1 个 HEX 背景色字符串" }
          },
          required: ["name", "colors", "background"]
        }
      }
    });

    return JSON.parse(response.text.trim()) as ColorTheme;
  } catch (error) {
    console.error("Gemini Error:", error);
    // 备选方案
    return {
      name: "经典灵光",
      colors: ["#E0C3FC", "#8EC5FC", "#FBC2EB", "#A18CD1", "#F6D365"],
      background: "#FFFFFF"
    };
  }
};
