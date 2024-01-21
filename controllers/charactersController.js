import { supabase } from "../config/supabase.js";

class CharactersController {
  static async getCharacter(req, res, next) {
    try {
      const { id } = req.params;

      const { data, error } = await supabase
        .from("characters")
        .select()
        .eq("id", id)

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async getCharactersList(req, res, next) {
    try {
      const { id } = req.query;

      const { data, error } = await supabase
        .from("characters")
        .select()
        .order("created_at", { ascending: true });

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async getActiveCharactersList(req, res, next) {
    try {
      console.log("hi")
      const user_id = req.user; // Make sure this is the correct user ID format (UUID)
      console.log(user_id)
      const { data, error } = await supabase
        .rpc('get_active_characters', { user_id_param: user_id });
  
      if (error) {
        throw error;
      }
  
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
  

  static async postCharacters(req, res, next) {
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
}

export default CharactersController;
