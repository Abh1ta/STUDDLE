import mongoose from "mongoose";
 
const penaltySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    xp_lost: { type: Number, default: 0 },
    reason: { type: String },
    challenge_active: { type: Boolean, default: false },
    challenge_hours: { type: Number },
    resolved: { type: Boolean, default: false }
}, { timestamps: true });
 
const penaltyModel = mongoose.models.penaltyModel || mongoose.model("penaltyModel", penaltySchema);
export default penaltyModel;