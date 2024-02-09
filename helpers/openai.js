import OpenAI from "openai";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { createClient } from "@supabase/supabase-js";

//dotenv
import dotenv from "dotenv";
dotenv.config();
//readline

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

function replacePlaceholders(content, username, characterName) {
  return content
    .replace(/\{\{user\}\}/gi, username)
    .replace(/\{\{char\}\}/gi, characterName);
}

// Function to get chat completion from OpenAI
async function getChatCompletion(
  prompt,
  chatHistory,
  personality,
  character_id,
  chatbotSettings = "gpt-3.5-turbo-0125",
  username,
  characterName
) {
  const lastSix = chatHistory.slice(-7);
  const processedChatHistory = lastSix.map((message, index) => {
      if (index < 4) {
          return {
              role: message.role,
              content: message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content
          };
      } else {
          return message;
      }
  });

  let localChatHistory = processedChatHistory.map(message => ({
      role: message.role,
      content: replacePlaceholders(message.content, username, characterName)
  }));

  localChatHistory.unshift({
      role: "system",
      content: replacePlaceholders(personality, username, characterName)
  });

  localChatHistory.push({ role: "user", content: prompt });

  let firstResponse = await openai.chat.completions.create({
      model: chatbotSettings,
      messages: localChatHistory,
  });

  let responseMessage = firstResponse.choices[0].message;

  return {
      tokens: firstResponse.usage.total_tokens,
      ai_message: responseMessage.content,
      human_message: prompt,
  };
}

export { getChatCompletion };
