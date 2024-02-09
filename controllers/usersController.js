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

  static async getUserProfile(req, res, next) {
    try {
      const user_id = req.params.id;

      const { data, error } = await supabase
        .from("users")
        .select("name,description,pfp,social_link,promo_code")
        .eq("id", user_id)
        .single();

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const user_id = req.user;
      const { username, description,pfp,social_link,promo_code } = req.body;

      const { data, error } = await supabase
        .from("users")
        .update({
          username: username,
          description: description,
          pfp: pfp,
          social_link: social_link,
          promo_code: promo_code
        })
        .eq("id", user_id)
        .select("id, username, description, pfp, social_link, promo_code");

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}

export default UsersController;
