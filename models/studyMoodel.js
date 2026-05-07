import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "subjectModel" }, 
    start_time: { type: Date, required: true },
    end_time: { type: Date },
    duration_minutes: { type: Number, default: 0 },
    xp_earned: { type: Number, default: 0 },
    status: { type: String, enum: ["active", "completed"], default: "active" },
    method: { type: String, default: "standard" } 
}, { timestamps: true });

const studyModel = mongoose.models.studyModel || mongoose.model("studyModel", studySessionSchema);
export default studyModel;