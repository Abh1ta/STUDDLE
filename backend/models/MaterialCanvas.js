import mongoose from "mongoose";

const materialCanvasSchema = new mongoose.Schema(
  {
    materialId: {
      type: String,
      required: true,
      unique: true
    },

    nume: {
      type: String,
      default: ""
    },

    paperType: {
      type: String,
      enum: ["blank", "math", "lined"],
      default: "blank"
    },

    canvasData: {
      type: Object,
      default: null
    }
  },
  { timestamps: true }
);

const MaterialCanvas = mongoose.model("MaterialCanvas", materialCanvasSchema);

export default MaterialCanvas;