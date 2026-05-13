import mongoose from "mongoose";
 
const subjectSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    title: { type: String, required: true },
    color: { type: String }
}, { timestamps: true });
 
const subjectModel = mongoose.models.subjectModel || mongoose.model("subjectModel", subjectSchema);
export default subjectModel;