import mongoose from "mongoose";
 
const avatarSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
<<<<<<< HEAD
    body_type: { type: String },
    outfit: { type: String },
    accessories: { type: String },
    hair: { type: String },
=======
    eye_color: { type: String },
>>>>>>> origin/settings-avatar_settings
    skin_color: { type: String }
}, { timestamps: true });
 
const avatarModel = mongoose.models.avatarModel || mongoose.model("avatarModel", avatarSchema);
export default avatarModel;