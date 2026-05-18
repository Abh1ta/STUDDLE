import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import fileModel from "../models/fileModel.js";

<<<<<<< HEAD

=======
>>>>>>> origin/feature/update
const uploadToCloudinary = (buffer, originalName, fileType) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
<<<<<<< HEAD
        resource_type: fileType === 'pdf' ? 'raw' : 'auto', // ← key change
=======
        resource_type: "raw",
>>>>>>> origin/feature/update
        folder: "studdle/files",
        public_id: `${Date.now()}_${originalName.replace(/\.[^/.]+$/, "")}`,
        use_filename: true,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    Readable.from(buffer).pipe(stream);
  });

export const uploadFile = async (req, res) => {
<<<<<<< HEAD
    try {
        const { subject_id, title } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Nu ai atașat niciun fișier." });
        }
        if (!subject_id) {
            return res.status(400).json({ message: "subject_id este obligatoriu." });
        }

        const originalName = req.file.originalname;
        const ext = originalName.split(".").pop().toLowerCase();

        if (!["pdf", "txt"].includes(ext)) {
            return res.status(400).json({ message: "Doar fișierele PDF și TXT sunt permise." });
        }

const cloudResult = await uploadToCloudinary(req.file.buffer, originalName, ext);

        const file = await fileModel.create({
            user_id:       req.user._id,
            subject_id,
            title:         title || originalName,
            file_type:     ext,
            cloudinary_id: cloudResult.public_id,
            url:           cloudResult.secure_url,
            size_bytes:    req.file.size,
        });

        res.status(201).json({ message: "Fișier încărcat cu succes.", file });
    } catch (error) {
        console.error("uploadFile error:", error);
        res.status(500).json({ message: "Upload eșuat.", error: error.message });
    }
};

export const getFiles = async (req, res) => {
    try {
        const filter = { user_id: req.user._id };

        if (req.query.subject_id) {
            filter.subject_id = req.query.subject_id;
        }

        const files = await fileModel
            .find(filter)
            .populate("subject_id", "title color")
            .sort({ createdAt: -1 });

        res.status(200).json({ files });
    } catch (error) {
        console.error("getFiles error:", error);
        res.status(500).json({ message: "Nu s-au putut prelua fișierele.", error: error.message });
    }
};

export const deleteFile = async (req, res) => {
    try {
        const file = await fileModel.findOne({
            _id:     req.params.id,
            user_id: req.user._id,       
        });

        if (!file) {
            return res.status(404).json({ message: "Fișierul nu a fost găsit." });
        }

const cloudResult = await uploadToCloudinary(req.file.buffer, originalName, ext);

        await cloudinary.uploader.destroy(file.cloudinary_id, {
            resource_type: resType,
        });

        await file.deleteOne();

        res.status(200).json({ message: "Fișier șters cu succes." });
    } catch (error) {
        console.error("deleteFile error:", error);
        res.status(500).json({ message: "Ștergerea a eșuat.", error: error.message });
    }
=======
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Nu ai atașat niciun fișier." });
    }

    const originalName = req.file.originalname;
    const ext = originalName.split(".").pop().toLowerCase();

    if (!["pdf", "txt"].includes(ext)) {
      return res.status(400).json({ message: "Doar fișierele PDF și TXT sunt permise." });
    }

    const cloudResult = await uploadToCloudinary(req.file.buffer, originalName, ext);

    const fileData = {
      user_id:       req.user._id,
      title:         req.body.title || originalName,
      file_type:     ext,
      cloudinary_id: cloudResult.public_id,
      url:           cloudResult.secure_url,
      size_bytes:    req.file.size,
    };

    if (req.body.subject_id) {
      fileData.subject_id = req.body.subject_id;
    }

    const file = await fileModel.create(fileData);
    res.status(201).json({ message: "Fișier încărcat cu succes.", file, url: cloudResult.secure_url });
  } catch (error) {
    console.error("uploadFile error:", error);
    res.status(500).json({ message: "Upload eșuat.", error: error.message });
  }
};

export const getFiles = async (req, res) => {
  try {
    const filter = { user_id: req.user._id };
    if (req.query.subject_id) {
      filter.subject_id = req.query.subject_id;
    }
    const files = await fileModel
      .find(filter)
      .populate("subject_id", "title color")
      .sort({ createdAt: -1 });
    res.status(200).json({ files });
  } catch (error) {
    console.error("getFiles error:", error);
    res.status(500).json({ message: "Nu s-au putut prelua fișierele.", error: error.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const file = await fileModel.findOne({
      _id:     req.params.id,
      user_id: req.user._id,
    });
    if (!file) {
      return res.status(404).json({ message: "Fișierul nu a fost găsit." });
    }
    await cloudinary.uploader.destroy(file.cloudinary_id, { resource_type: "raw" });
    await file.deleteOne();
    res.status(200).json({ message: "Fișier șters cu succes." });
  } catch (error) {
    console.error("deleteFile error:", error);
    res.status(500).json({ message: "Ștergerea a eșuat.", error: error.message });
  }
>>>>>>> origin/feature/update
};