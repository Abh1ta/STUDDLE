import express from "express";
import multer from "multer";
import { uploadFile, getFiles, deleteFile } from "../controllers/fileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 },  
    fileFilter: (_req, file, cb) => {
        const allowed = ["application/pdf", "text/plain"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only PDF and TXT files are allowed."));
        }
    },
});


router.post  ("/upload", protect, upload.single("file"), uploadFile);
router.get   ("/",       protect,                        getFiles);
router.delete("/:id",   protect,                        deleteFile);

export default router;