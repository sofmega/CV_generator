// backend/src/routes/generate.routes.js
import { Router } from "express";
import { generateController } from "../controllers/generate.controller.js";

const router = Router();

router.post("/", generateController);

export default router;
