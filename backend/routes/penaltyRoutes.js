import express from "express";
import { getActivePenalties } from "../services/penaltyService.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.get("/", protect, async (req, res) => {
  try {
    const penalties = await getActivePenalties(req.user._id);
    res.json({ penalties });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;