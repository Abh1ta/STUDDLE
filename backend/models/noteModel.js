import mongoose from "mongoose";
 
const noteSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    subject_id: { type: mongoose.Schema.Types.ObjectId, ref: "subjectModel", required: true },
    is_sticky: { type: Boolean, default: false },
    pos_x: { type: Number },
    pos_y: { type: Number },
    color: { type: String },
    content: { type: String }
}, { timestamps: true });
 
const noteModel = mongoose.models.noteModel || mongoose.model("noteModel", noteSchema);
export default noteModel;