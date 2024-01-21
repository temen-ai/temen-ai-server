import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
//hide key
const supabaseKey = process.env.SUPABASE_API_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.sendStatus(401); // No token provided

  const { data, error } = await supabase.auth.getUser(token);

  if (error) return res.sendStatus(403); // Invalid token

  req.user = data.user.id;
  next();
}

export { supabase, authenticateToken };
