import mongoose from "mongoose";
 
const studySessionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "subjectModel", required: true },
    started_at: { type: Date, required: true },
    ended_at: { type: Date },
    duration_sec: { type: Number },
    method: { type: String },
    auto_break: { type: Boolean, default: false }
}, { timestamps: true });
 
const studySessionModel = mongoose.models.studySessionModel || mongoose.model("studySessionModel", studySessionSchema);
export default studySessionModel;