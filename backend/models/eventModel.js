import mongoose from "mongoose";
 
const eventSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "subjectModel", required: true },
    type: { type: String },
    priority: { type: Number, default: 0 },
    due_date: { type: Date },
    synced_gcal: { type: Boolean, default: false },
    completed: { type: Boolean, default: false }
}, { timestamps: true });
 
const eventModel = mongoose.models.eventModel || mongoose.model("eventModel", eventSchema);
export default eventModel;