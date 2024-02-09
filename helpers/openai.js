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

// Updated function signature to include welcome_message
async function getChatCompletion(
  prompt,
  chatHistory,
  welcome_message, // Make sure this parameter is passed when calling the function
  personality,
  username,
  characterName
) {
  const chatbotSettings = "gpt-3.5-turbo-0125";
  const lastSix = chatHistory
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

  // Unshift the welcome message at the start of the chat history
  if (welcome_message) {
    localChatHistory.unshift({
      role: 'assistant', // or 'system' based on your role naming convention
      content: replacePlaceholders(welcome_message, username, characterName)
    });
  }

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
