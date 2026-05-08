import mongoose from "mongoose";
 
const achievementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    xp_reward: { type: Number, default: 0 },
    icon: { type: String },
    condition_key: { type: String },
    condition_value: { type: Number }
});
 
const achievementModel = mongoose.models.achievementModel || mongoose.model("achievementModel", achievementSchema);
export default achievementModel;
export default achievementModel;
