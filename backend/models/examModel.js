import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    user_id:    { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    title:      { type: String, required: true },
    color:      { type: String },
    date:       { type: String, required: true }, // format: "YYYY-MM-DD"
}, { timestamps: true });

const examModel = mongoose.models.examModel || mongoose.model("examModel", examSchema);
export default examModel;