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

// Initialize Supabase Client
// const privateKey = process.env.SUPABASE_API_KEY;
// const url = process.env.SUPABASE_URL;
// const client = createClient(url, privateKey);

// const embeddings = new OpenAIEmbeddings();
// const vectorStore = new SupabaseVectorStore(embeddings, {
//   client,
//   tableName: "embeddings",
//   queryName: "match_embeddings",
// });

// Function to get chat completion from OpenAI
async function getChatCompletion(
  prompt,
  chatHistory,
  personality,
  character_id,
  chatbotSettings = "gpt-3.5-turbo-0125",
) {
  // Find Context with the prompt using similaritySearch
//   const context = await vectorStore.similaritySearch(prompt, 4, {
//     character_id: character_id,
//   });

//   const combinedContext = context
//     .map((doc) => {
//       if (doc.pageContent.startsWith("Question:")) {
//         doc.pageContent.replace("Answer:", "Answer with: ");
//         return doc.pageContent.replace("Question:", "If the user asks: ");
//       }
//       return doc.pageContent;
//     })
//     .join("\n ");

    const lastSix = chatHistory.slice(-7);

    // Process the lastSix array
    const processedChatHistory = lastSix.map((message, index) => {
    // Check if the message is one of the first 4 in the lastSix array
    if (index < 4) {
        // Truncate the content to 50 characters if it's longer
        return {
        role: message.role,
        content: message.content.length > 50 ? message.content.substring(0, 50) + '...' : message.content
        };
    } else {
        // Leave the last 2 messages (latest pair) unchanged
        return message;
    }
    });
    console.log(processedChatHistory,"processedChatHistory")

  let localChatHistory = [...processedChatHistory];

  localChatHistory.unshift({
    role: "system",
    content:
      personality 
  });

//   localChatHistory.unshift({
//     role: "system",
//     content:
//       personality +
//       "\n \nContext (ignore if unrelated):" +
//       combinedContext +
//       "\nEND OF CONTEXT\n" +
//       "\nWhen the user's prompt roughly means these statements, run the function transfer to a human agent: " +
//       transfer_conditions,
//   });

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
