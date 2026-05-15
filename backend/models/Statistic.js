import mongoose from "mongoose";

const accessSchema = new mongoose.Schema(
  {
    nume: String,
    tip: String,
    materialId: String,
    data: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const studySessionSchema = new mongoose.Schema(
  {
    materialId: String,
    nume: String,
    seconds: {
      type: Number,
      default: 0
    },
    minutes: {
      type: Number,
      default: 0
    },
    source: {
      type: String,
      default: "unknown"
    },
    data: {
      type: Date,
      default: Date.now
    }
  },
  { _id: false }
);

const statisticSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      unique: true
    },

    totalAccesari: {
      type: Number,
      default: 0
    },

    materiiAccesate: {
      type: Number,
      default: 0
    },

    temeAccesate: {
      type: Number,
      default: 0
    },

    ultimeleAccesari: {
      type: [accessSchema],
      default: []
    },

    studySessions: {
      type: [studySessionSchema],
      default: []
    }
  },
  { timestamps: true }
);

const Statistic = mongoose.model("Statistic", statisticSchema);

export default Statistic;