import mongoose from "mongoose";
 
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    avatar_url: { type: String },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak_days: { type: Number, default: 0 },
    last_active: { type: Date, default: Date.now }
}, { timestamps: true });
 
const userModel = mongoose.models.userModel || mongoose.model("userModel", userSchema);
export default userModel;