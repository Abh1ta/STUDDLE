import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    user_id:       { type: mongoose.Schema.Types.ObjectId, ref: "userModel",    required: true },
    subject_id:    { type: mongoose.Schema.Types.ObjectId, ref: "subjectModel", required: false },
    title:         { type: String, required: true },
    file_type:     { type: String, enum: ["pdf", "txt"], required: true },
    cloudinary_id: { type: String, required: true },
    url:           { type: String, required: true },
    size_bytes:    { type: Number },
}, { timestamps: true });

const fileModel = mongoose.models.fileModel || mongoose.model("fileModel", fileSchema);
export default fileModel;
