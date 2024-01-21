import { supabase } from "../config/supabase.js";
import { getChatCompletion } from "../helpers/openai.js";

class OpenaiController {
  static async getOpenAI(req, res, next) {
    try {
      const { character_id, prompt } = req.query;
      const user_id = req.user;


      //gets the message history of the conversation
      const { data:message_data, error:message_error } = await supabase
      .from("messages")
      .select()
      .eq("character_id", character_id)
      .eq("user_id", user_id)
      .order("created_at", { ascending: true });
      console.log(message_data,"messageData")
      const chatHistory = message_data?.map(message => {
        if (message.sent_by === message.character_id) {
          return { role: 'assistant', content: message.message };
        } else if (message.sent_by === user_id) {
          return { role: 'user', content: message.message };
        }
      }) || []


      //gets the character information
      const { data:character_data, error:character_error } = await supabase
        .from("characters")
        .select()
        .eq("id", character_id)
        


      // create new message of the user
      await supabase
        .from("messages")
        .insert([
          {
            character_id: character_id,
            message: prompt,
            media_url: "",
            media_type: "",
            sent_by: user_id,
            user_id: user_id,
          },
        ])
        .select();

      //gets the openai completion
      const message = await getChatCompletion(prompt,chatHistory,character_data[0].prompt,character_id)


      // create new message of the AI
      const aimessage = await supabase
        .from("messages")
        .insert([
          {
            character_id: character_id,
            message: message.ai_message,
            media_url: "",
            media_type: "",
            sent_by: character_id,
            user_id: user_id,
          },
        ])
        .select();

      res.status(200).json({ data:aimessage });
    } catch (err) {
      next(err);
    }
  }

  /*
  static async postOpenAI(req, res, next) {
    try {
      const { name, description, prompt, model, pfp, messages_count } =
        req.body;

      const { data, error } = await supabase
        .from("characters")
        .insert([
          {
            name: name,
            description: description,
            prompt: prompt,
            model: model,
            pfp: pfp,
            messages_count: messages_count,
          },
        ])
        .select();

      res.status(200).json({ data });
      d;
    } catch (err) {
      next(err);
    }
  }
  */
}

export default OpenaiController;
