import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";
import fileModel from "../models/fileModel.js";


const uploadToCloudinary = (buffer, originalName) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "raw",         
                folder: "studdle/files",
                public_id: `${Date.now()}_${originalName}`,
                use_filename: false,
                overwrite: false,
            },
            (error, result) => (error ? reject(error) : resolve(result))
        );
        Readable.from(buffer).pipe(stream);
    });


export const uploadFile = async (req, res) => {
    try {
        const { subject_id, title } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "No file attached." });
        }
        if (!subject_id) {
            return res.status(400).json({ message: "subject_id is required." });
        }

        const originalName = req.file.originalname;
        const ext = originalName.split(".").pop().toLowerCase();

        if (!["pdf", "txt"].includes(ext)) {
            return res.status(400).json({ message: "Only PDF and TXT files are allowed." });
        }

        const cloudResult = await uploadToCloudinary(req.file.buffer, originalName);

        const file = await fileModel.create({
            user_id:       req.user._id,
            subject_id,
            title:         title || originalName,
            file_type:     ext,
            cloudinary_id: cloudResult.public_id,
            url:           cloudResult.secure_url,
            size_bytes:    req.file.size,
        });

        res.status(201).json({ message: "File uploaded successfully.", file });
    } catch (error) {
        console.error("uploadFile error:", error);
        res.status(500).json({ message: "Upload failed.", error: error.message });
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
        res.status(500).json({ message: "Could not fetch files.", error: error.message });
    }
};


export const deleteFile = async (req, res) => {
    try {
        const file = await fileModel.findOne({
            _id:     req.params.id,
            user_id: req.user._id,       
        });

        if (!file) {
            return res.status(404).json({ message: "File not found." });
        }

        await cloudinary.uploader.destroy(file.cloudinary_id, {
            resource_type: "raw",
        });

        await file.deleteOne();

        res.status(200).json({ message: "File deleted successfully." });
    } catch (error) {
        console.error("deleteFile error:", error);
        res.status(500).json({ message: "Delete failed.", error: error.message });
    }
};