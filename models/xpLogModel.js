import mongoose from "mongoose";
 
const xpLogSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "userModel", required: true },
    source: { type: String, required: true },
    delta: { type: Number, required: true },
    created_at: { type: Date, default: Date.now }
});
 
const xpLogModel = mongoose.models.xpLogModel || mongoose.model("xpLogModel", xpLogSchema);
export default xpLogModel;