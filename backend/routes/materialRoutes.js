import express from "express";
import MaterialCanvas from "../models/MaterialCanvas.js";

const router = express.Router();

router.get("/:id/canvas", async (req, res) => {
  try {
    const materialId = decodeURIComponent(req.params.id);

    const canvas = await MaterialCanvas.findOne({ materialId });

    if (!canvas) {
      return res.json({
        materialId,
        paperType: "blank",
        canvasData: null
      });
    }

    return res.json({
      materialId: canvas.materialId,
      nume: canvas.nume,
      paperType: canvas.paperType,
      canvasData: canvas.canvasData
    });
  } catch (err) {
    console.error("Eroare la încărcarea canvas-ului:", err);
    return res.status(500).json({
      message: "Eroare la încărcarea canvas-ului.",
      error: err.message
    });
  }
});

router.put("/:id/canvas", async (req, res) => {
  try {
    const materialId = decodeURIComponent(req.params.id);
    const { nume, paperType, canvasData } = req.body;

    const saved = await MaterialCanvas.findOneAndUpdate(
      { materialId },
      {
        materialId,
        nume: nume || materialId,
        paperType: paperType || "blank",
        canvasData: canvasData || null
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
      }
    );

    return res.json({
      message: "Canvas salvat.",
      materialId: saved.materialId,
      paperType: saved.paperType
    });
  } catch (err) {
    console.error("Eroare la salvarea canvas-ului:", err);
    return res.status(500).json({
      message: "Eroare la salvarea canvas-ului.",
      error: err.message
    });
  }
});

router.post("/:id/files", async (req, res) => {
  return res.json({
    message: "Endpoint fișiere pregătit."
  });
});

export default router;