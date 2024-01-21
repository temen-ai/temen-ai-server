import supabase from "../config/supabase.js";

class ConversationsController {
  static async getConversation(req, res, next) {
    try {
      const { id } = req.query;

      const { data, error } = await supabase
        .from("conversations")
        .select()
        .eq("id", id)
        .order("created_at", { ascending: true });

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async postConversation(req, res, next) {
    try {
      const { user_id, character_id } = req.query;

      const { data, error } = await supabase
        .from("conversations")
        .insert([
          {
            user_id: user_id,
            character_id: character_id,
          },
        ])
        .select();

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}

export default ConversationsController;
