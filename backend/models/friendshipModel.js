import mongoose from "mongoose";
 
const friendshipSchema = new mongoose.Schema({
    user_a_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    user_b_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    status: { type: String, enum: ["pending", "accepted", "blocked"], default: "pending" }
}, { timestamps: true });
 
const friendshipModel = mongoose.models.friendshipModel || mongoose.model("friendshipModel", friendshipSchema);
export default friendshipModel;