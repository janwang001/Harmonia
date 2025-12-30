
import { GoogleGenAI, Type, Chat, GenerateContentResponse } from "@google/genai";
import { TheoryData, ImageSize } from "../types";

export const parseTheoryRequest = async (prompt: string): Promise<TheoryData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `请解析以下乐理请求并转化为结构化 JSON: "${prompt}"`,
    config: {
      systemInstruction: "你是一个乐理解析器。将用户的请求转换为详细的乐理数据。'name' 和 'description' 必须使用中文。'root' 和 'notes' 必须使用标准的英文字母音名（如 C, C#, Db 等）。notes 应该是从根音开始的一个八度内的音符数组。'intervals' 应使用音乐术语（如 R, M2, m3, P4 等）。",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          type: { type: Type.STRING, enum: ['scale', 'chord', 'interval', 'custom'] },
          root: { type: Type.STRING },
          notes: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          intervals: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING } 
          },
          description: { type: Type.STRING },
          formula: { type: Type.STRING }
        },
        required: ["name", "type", "root", "notes", "intervals", "description"]
      }
    }
  });

  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr);
};

export const createTheoryChat = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: "你是 Harmonia，一位资深的 AI 乐理专家。请使用中文帮助用户解决关于和声、对位、节奏、配器和音乐史的复杂问题。回答应简明扼要且富有洞见。",
    }
  });
};

export const generateMusicImage = async (prompt: string, size: ImageSize): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: size
      }
    }
  });

  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  }
  throw new Error("未能从 API 获取图像数据");
};
