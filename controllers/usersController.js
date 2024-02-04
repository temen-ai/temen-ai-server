import { supabase } from "../config/supabase.js";

class UsersController {
  static async getUser(req, res, next) {
    try {
      const user_id = req.user;

      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", user_id)
        .single();

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async postUser(req, res, next) {
    try {
      const { username, messages_count } = req.body;

      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            username: username,
            messages_count: messages_count,
          },
        ])
        .select();

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}

export default UsersController;
