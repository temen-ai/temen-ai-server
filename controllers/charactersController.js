import supabase from "../config/supabase.js";

class CharactersController {
  static async getCharacter(req, res, next) {
    try {
      const { id } = req.query;

      const { data, error } = await supabase
        .from("characters")
        .select()
        .eq("id", id)
        .order("created_at", { ascending: true });

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }

  static async postCharacters(req, res, next) {
    try {
      const { name, description, prompt, model, pfp, messages_count } =
        req.query;

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
