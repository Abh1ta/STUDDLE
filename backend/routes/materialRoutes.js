import express from "express";
import MaterialCanvas from "../models/MaterialCanvas.js";

const router = express.Router();


router.get("/subject/:subjectName", async (req, res) => {
  try {
    const materialId = decodeURIComponent(req.params.subjectName);
    //caută toate notițele care aparțin de materia resp
    const notes = await MaterialCanvas.find({ materialId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Eroare la luarea notițelor:", err);
    res.status(500).json({ message: "Eroare la încărcare." });
  }
});


router.get("/note/:id", async (req, res) => {
  try {
    const note = await MaterialCanvas.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Notița nu există." });
    res.json(note);
  } catch (err) {
    console.error("Eroare la luarea unei notițe:", err);
    res.status(500).json({ message: "Eroare." });
  }
});

// notiță noua
router.post("/note/new", async (req, res) => {
  try {
    const { materialId, nume } = req.body;
    const newNote = await MaterialCanvas.create({
      materialId,
      nume: nume || "Notiță nouă",
      paperType: "blank",
      canvasData: null
    });
    res.json(newNote);
  } catch (err) {
    console.error("Eroare la creare notiță:", err);
    res.status(500).json({ message: "Eroare la creare." });
  }
});

// salveaza si actualizează o notita (din editor)
router.put("/note/:id", async (req, res) => {
  try {
    const { paperType, canvasData, nume, pdfFileName, pdfFileType } = req.body;
    const saved = await MaterialCanvas.findByIdAndUpdate(
      req.params.id,
      { paperType, canvasData, nume, pdfFileName, pdfFileType },
      { new: true }
    );
    res.json(saved);
  } catch (err) {
    res.status(500).json({ message: "Eroare la salvare." });
  }
});


router.post("/:id/files", async (req, res) => {
  return res.json({ message: "Endpoint fișiere pregătit." });
});

router.delete("/note/:id", async (req, res) => {
  try {
    await MaterialCanvas.findByIdAndDelete(req.params.id);
    res.json({ message: "Notiță ștearsă cu succes." });
  } catch (err) {
    console.error("Eroare la ștergerea notiței:", err);
    res.status(500).json({ message: "Eroare la ștergerea notiței." });
  }
});

export default router;