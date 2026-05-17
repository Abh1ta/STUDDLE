import mongoose from "mongoose";
 
const homeworkSchema = new mongoose.Schema({
    user_id:    { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    title:      { type: String, required: true },
    color:      { type: String },
}, { timestamps: true });
 
const homeworkModel = mongoose.models.homeworkModel || mongoose.model("homeworkModel", homeworkSchema);
export default homeworkModel;