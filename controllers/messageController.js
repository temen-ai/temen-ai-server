import { supabase } from "../config/supabase.js";

class MessageController {
  // static async getListMessage(req, res, next) {
  //   try {
  //     const user_id = req.user;

  //     const { data, error } = await supabase
  //       .from("messages")
  //       .select()
  //       .eq("id", user_id)
  //       .order("created_at", { ascending: true });

  //     res.status(200).json({ data });
  //   } catch (err) {
  //     next(err);
  //   }
  // }

  static async getListMessageByConversation(req, res, next) {
    try {
      // use destructuring to make it readable
      const { id: conversation_id } = req.params;
      const user_id = req.user;

      const { data, error } = await supabase
        .from("messages")
        .select()
        .eq("conversation_id", conversation_id)
        .eq("id", user_id)
        .order("created_at", { ascending: true });

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
  static async getListMessageByCharacter(req, res, next) {
    try {
      // use destructuring to make it readable
      const { id: character_id } = req.params;
      const user_id = req.user;

      const { data, error } = await supabase
        .from("messages")
        .select()
        .eq("character_id", character_id)
        .eq("id", user_id)
        .order("created_at", { ascending: true });

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async postListMessage(req, res, next) {
    try {
      const { conversation_id, message, media_url, media_type, sent_by } =
        req.body;

      const { data, error } = await supabase
        .from("messages")
        .insert([
          {
            conversation_id: conversation_id,
            message: message,
            media_url: media_url,
            media_type: media_type,
            sent_by: sent_by,
          },
        ])
        .select();

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}

export default MessageController;
