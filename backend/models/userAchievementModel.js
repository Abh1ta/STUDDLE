import mongoose from "mongoose";
 
const userAchievementSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    achievement_id: { type: mongoose.Schema.Types.ObjectId, ref: "achievementModel", required: true },
    earned_at: { type: Date, default: Date.now }
});
 
const userAchievementModel = mongoose.models.userAchievementModel || mongoose.model("userAchievementModel", userAchievementSchema);
export default userAchievementModel;
