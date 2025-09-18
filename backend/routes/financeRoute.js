import express from "express";
import { getAIInsights } from "../controllers/financeController.js";

const router = express.Router();

router.post("/insights", getAIInsights);

export default router;
