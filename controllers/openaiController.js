import { supabase } from "../config/supabase.js";
import { getChatCompletion } from "../helpers/openai.js";

class OpenaiController {
  static async getOpenAI(req, res, next) {
    try {
      const { character_id, prompt } = req.query;
      const user_id = req.user;

      // Fetch user subscription status, message counts, and package details
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("is_premium, messages_count, daily_messages_count, monthly_messages_count, package:packages(*)")
        .eq("id", user_id)
        .single();

      if (userError || !userData) {
        throw userError || new Error("User not found");
      }

      // Check message limits based on premium status
      if (userData.is_premium && userData.monthly_messages_count >= userData.package.chat_limit) {
        return res.status(403).json({ error: "Monthly message limit reached." });
      } else if (!userData.is_premium && userData.daily_messages_count >= 30) {
        return res.status(403).json({ error: "Daily message limit reached." });
      }

      // Get character information
      const { data: character_data, error: character_error } = await supabase
        .from("characters")
        .select("prompt, welcome_message")
        .eq("id", character_id)
        .single();

      if (character_error) {
        throw character_error;
      }

      // Fetch the last 6 messages for chat history
      const { data: message_data, error: message_error } = await supabase
        .from("messages")
        .select()
        .eq("character_id", character_id)
        .eq("user_id", user_id)
        .order("created_at", { ascending: true })
        .limit(10);

      if (message_error) {
        throw message_error;
      }


      const chatHistory = message_data.concat(message_data.map(message => ({
        role: message.sent_by === character_id ? 'assistant' : 'user',
        content: message.message
      })));

      // Generate AI message
      const aiMessageContent = await getChatCompletion(prompt, chatHistory, character_data.welcome_message,character_data.prompt, userData.username, character_data.name);

      // Insert user and AI messages
      await supabase
      .from("messages")
      .insert([
        { character_id, message: prompt, sent_by: user_id, user_id },
        { character_id, message: aiMessageContent.ai_message, sent_by: character_id, user_id }
      ])
      .select("*"); // Adjust the select clause as needed


      // Update message counts atomically where possible
      await Promise.all([
        supabase
          .from("users")
          .update({
            daily_messages_count: (userData.daily_messages_count || 0) + 1,
            monthly_messages_count: (userData.monthly_messages_count || 0) + 1,
            messages_count: (userData.messages_count || 0) + 1
          })
          .eq("id", user_id),
          supabase.rpc('increment_character_count', { character_id_param: character_id })
      ]);

      // Send response back with AI message content
      res.status(200).json({ data: aiMessageContent });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
}

export default OpenaiController;
