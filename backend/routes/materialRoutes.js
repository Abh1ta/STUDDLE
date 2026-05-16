import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import MaterialCanvas from "../models/MaterialCanvas.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Doar fișierele PDF sunt permise."));
    }
  },
});

// Rută pentru uploadul PDF la Cloudinary — returnează URL permanent
router.post("/upload-pdf", protect, upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nu ai atașat niciun fișier PDF." });
    }

    const originalName = req.file.originalname;
    const publicId = `studdle/pdfs/${Date.now()}_${originalName.replace(/\.[^/.]+$/, "").replace(/\s+/g, "_")}`;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "studdle/pdfs",
          public_id: publicId,
          use_filename: true,
          unique_filename: true,
          overwrite: false,
        },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      Readable.from(req.file.buffer).pipe(stream);
    });

    res.status(200).json({
      url: result.secure_url,
      fileName: originalName,
      publicId: result.public_id,
    });
  } catch (err) {
    console.error("Eroare upload PDF:", err);
    res.status(500).json({ message: "Upload PDF eșuat.", error: err.message });
  }
});

// 1. Ia TOATE notițele pentru o materie (ex: "mate")
router.get("/subject/:subjectName", async (req, res) => {
  try {
    const materialId = decodeURIComponent(req.params.subjectName);
    // Caută toate notițele care aparțin de această materie
    const notes = await MaterialCanvas.find({ materialId }).sort({ updatedAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error("Eroare la luarea notițelor:", err);
    res.status(500).json({ message: "Eroare la încărcare." });
  }
});

// 2. Ia o notiță SPECIFICĂ după ID-ul ei (pentru a o deschide în editor)
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

// 3. Crează o notiță NOUĂ
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

// 4. Salvează/Actualizează o notiță (din editor)
router.put("/note/:id", async (req, res) => {
  try {
    const { paperType, canvasData, nume } = req.body;
    const saved = await MaterialCanvas.findByIdAndUpdate(
      req.params.id,
      { paperType, canvasData, nume },
      { new: true }
    );
    res.json(saved);
  } catch (err) {
    console.error("Eroare la salvare notiță:", err);
    res.status(500).json({ message: "Eroare la salvare." });
  }
});

// Păstrăm și ruta de files dacă ai nevoie de ea mai târziu
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