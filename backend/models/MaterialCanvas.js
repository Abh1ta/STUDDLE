import mongoose from "mongoose";

const materialCanvasSchema = new mongoose.Schema(
  {
    // materialId va fi numele materiei (ex: "mate", "romana")
    materialId: {
      type: String,
      required: true,
      index: true // index în loc de unique
    },
    // Titlul specific al notiței (ex: "Curs 1", "Recapitulare")
    nume: {
      type: String,
      default: "Notiță nouă"
    },
    paperType: {
      type: String,
      enum: ["blank", "math", "lined"],
      default: "blank"
    },
    canvasData: {
      type: Object,
      default: null
    },
    pdfFileName: { type: String, default: null },
pdfFileType: { type: String, default: null },
  },
  { timestamps: true }
);

const MaterialCanvas = mongoose.model("MaterialNote", materialCanvasSchema);
export default MaterialCanvas;