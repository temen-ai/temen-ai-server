import { supabase } from "../config/supabase.js";
import { getChatCompletion } from "../helpers/openai.js";

class OpenaiController {
  static async getOpenAI(req, res, next) {
    try {
      const { character_id, prompt } = req.query;
      const user_id = req.user;

      // Get character information including welcome_message
      const { data: character_data, error: character_error } = await supabase
        .from("characters")
        .select("prompt, welcome_message")
        .eq("id", character_id)
        .single(); // Assuming you expect a single row

      if (character_error) {
        throw character_error;
      }

      // Get the last 10 messages (5 pairs) with the character, ordered by creation time
      // Adjust the limit to 5 or 10 based on your definition of "pairs"
      const { data: message_data, error: message_error } = await supabase
        .from("messages")
        .select()
        .eq("character_id", character_id)
        .eq("user_id", user_id)
        .order("created_at", { ascending: true })
        .limit(6); // No need to reverse data

      if (message_error) {
        throw message_error;
      }

      let chatHistory = [];
      // Prepend welcome_message if applicable
      if (character_data.welcome_message && message_data.length > 0 && message_data[0].sent_by === user_id) {
        chatHistory.push({ role: 'assistant', content: character_data.welcome_message });
      }

      chatHistory = chatHistory.concat(message_data.map(message => ({
        role: message.sent_by === character_id ? 'assistant' : 'user',
        content: message.message
      })));

      // Generate AI message
      const aiMessageContent = await getChatCompletion(prompt, chatHistory, character_data.prompt, character_id);

      // Insert user and AI messages together
      const { error: insert_error } = await supabase
        .from("messages")
        .insert([
          {
            character_id,
            message: prompt,
            sent_by: user_id,
            user_id,
          },
          {
            character_id,
            message: aiMessageContent.ai_message,
            sent_by: character_id,
            user_id,
          }
        ]);

      if (insert_error) {
        throw insert_error;
      }

      res.status(200).json({ data: aiMessageContent });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}



export default OpenaiController;
