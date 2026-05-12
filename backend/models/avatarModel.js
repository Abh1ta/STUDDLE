import mongoose from "mongoose";
 
const avatarSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    eye_color: { type: String },
    skin_color: { type: String }
}, { timestamps: true });
 
const avatarModel = mongoose.models.avatarModel || mongoose.model("avatarModel", avatarSchema);
export default avatarModel;