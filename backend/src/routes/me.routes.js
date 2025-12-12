// backend/src/routes/me.routes.js
import { Router } from "express";
import { authMiddleware } from "../middleware/auth.js";
import { supabase } from "../config/supabase.js";

const router = Router();

router.get("/usage", authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from("profiles")
    .select(
      "plan, generations_used, generation_limit, usage_reset_at"
    )
    .eq("user_id", req.user.id)
    .single();

  if (error) {
    return res.status(500).json({ error: "Failed to load usage" });
  }

  res.json(data);
});

export default router;
