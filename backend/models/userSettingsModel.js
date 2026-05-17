import mongoose from "mongoose";
 
const userSettingsSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    bg_color: { type: String },
    bg_style: { type: String },
    music_pref: { type: String },
    learn_method: { type: String },
    break_interval_min: { type: Number }
}, { timestamps: true });
 
const userSettingsModel = mongoose.models.userSettingsModel || mongoose.model("userSettingsModel", userSettingsSchema);
export default userSettingsModel;