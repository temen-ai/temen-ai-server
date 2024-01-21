import supabase from "../config/supabase.js";

class UsersController {
  static async getUser(req, res, next) {
    try {
      const { id } = req.query;

      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("id", id)
        .order("created_at", { ascending: true });

      res.status(200).json({ data });

    } catch (err) {
      next(err);
    }
  }

  static async postUser(req, res, next) {
    try {
      const { username, messages_count } = req.query;

      const { data, error } = await supabase
        .from("users")
        .insert([
            {
                username: username,
                messages_count: messages_count
            }
        ])
        .select()

      res.status(200).json({ data });

    } catch (err) {
      next(err);
    }
  }
}

export default UsersController;
