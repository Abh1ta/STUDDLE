import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "userModel",
  required: true,
},

receiver: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "userModel",
  required: true,
},
    content: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["text", "file", "note"],
      default: "text",
    },
    file: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fileModel",
      default: null,
    },
    attachment: {
      title:      { type: String },
      file_type:  { type: String }, 
      url:        { type: String },
      size_bytes: { type: Number },
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

export default mongoose.model("Message", messageSchema);