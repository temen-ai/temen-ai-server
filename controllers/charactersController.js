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
      const searchTerm = req.query.searchTerm || null;
      const limit = parseInt(req.query.limit) || 10; // default limit
      const offset = parseInt(req.query.offset) || 0; // default offset
  
      let query;
  
      if (searchTerm) {

        const formattedSearchTerm = searchTerm.trim().replace(/\s+/g, ' & ');

        query = supabase
        .from("characters")
        .select(`
          *,
          users (
            username,
            description,
            pfp,
            social_link,
            promo_code
          )
        `)
        .ilike('name', `%${formattedSearchTerm}%`)
        .order("messages_count", { ascending: false });
      
      } else {
        // If there is no search term, perform a regular query ordered by messages_count
        query = supabase
        .from("characters")
        .select(`
          *,
          users (
            username,
            description,
            pfp,
            social_link,
            promo_code
          )
        `)
        .order("messages_count", { ascending: false })
        .range(offset, offset + limit - 1);
      
      }
  
      const { data, error } = await query;
      console.log(data,error)
  
      if (error) throw error;
  
      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
  

  static async getUserCharactersList(req, res, next) {
    try {
      const { id:user_id } = req.params;

      const { data, error } = await supabase
      .from("characters")
      .select(`
        *,
        users (
          username,
          description,
          pfp,
          social_link,
          promo_code
        )
      `)
      .eq("created_by", user_id)
      .order("messages_count", { ascending: false });
    
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
  

  static async createCharacter(req, res, next) {
    try {
      const { name, description, prompt, pfp, welcome_message,is_public } =
        req.body;
      const user_id = req.user; 

      const { data, error } = await supabase
        .from("characters")
        .insert([
          {
            name: name,
            description: description,
            prompt: prompt,
            pfp: pfp,
            welcome_message: welcome_message,
            created_by: user_id,
            is_public: is_public
          },
        ])
        .select();

      res.status(200).json({ data });
      
    } catch (err) {
      next(err);
    }
  }

  //edit character

  static async updateCharacter(req, res, next) {
    try {
      const { id } = req.params;
      const { name, description, prompt, pfp, welcome_message,is_public } =
        req.body;

      const { data, error } = await supabase
        .from("characters")
        .update({
          name: name,
          description: description,
          prompt: prompt,
          pfp: pfp,
          welcome_message: welcome_message,
          is_public: is_public
        })
        .eq("id", id)
        .single();

      res.status(200).json({ data });
    } catch (err) {
      next(err);
    }
  }
}

export default CharactersController;
