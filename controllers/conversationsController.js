import { supabase } from "../config/supabase.js";

class ConversationsController {
  static async getConversation(req, res, next) {
    try {
      const user_id = req.user;
      const { id: conversation_id } = req.params;

      const { data, error } = await supabase
        .from("conversations")
        .select()
        .eq("id", user_id)
        .eq("conversation_id", conversation_id)
        .order("created_at", { ascending: true });

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async postConversation(req, res, next) {
    try {
      const { character_id } = req.body;
      const user_id = req.user;
      console.log(character_id, user_id);

      const { data, error } = await supabase
        .from("conversations")
        .insert({
          user_id: user_id,
          character_id: character_id,
        })
        .select();

      const tod = await supabase
        .from("conversations")
        .select()
        .eq("user_id", user_id)
        .order("created_at", { ascending: true });

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}

export default ConversationsController;
