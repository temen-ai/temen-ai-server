import express from "express";
import charactersRouter from "./characters.js";
import messagesRouter from "./messages.js";
import conversationsRouter from "./conversations.js";
import usersRouter from "./users.js";
import { authenticateToken } from "../config/supabase.js";

const router = express.Router();

import { supabase } from "../config/supabase.js";

router
  .get("/", async (req, res) => {
    const { email, password } = req.query;
    const { data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log(data, "yays");
    let access_token = data.session.access_token;
    res.status(200).json({ access_token: data.session.access_token });
  })
  .use("/characters", authenticateToken, charactersRouter)
  .use("/messages", authenticateToken, messagesRouter)
  .use("/conversations", authenticateToken, conversationsRouter)
  .use("/users", usersRouter);

export default router;
