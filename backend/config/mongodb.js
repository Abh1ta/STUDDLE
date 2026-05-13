import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUrl = process.env.MONGODB_URL?.trim();
  if (!mongoUrl) {
    console.warn(
      "MongoDB connection skipped because MONGODB_URL is not configured.",
    );
    return;
  }

  const databaseUri = mongoUrl.match(/\/studdle(\/|$)/i)
    ? mongoUrl
    : `${mongoUrl.replace(/\/+$/, "")}/studdle`;

  try {
    mongoose.connection.on("connected", () => {
      console.log("*** MongoDB connected successfully");
    });

    await mongoose.connect(databaseUri);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.warn(
      "Continuing without MongoDB. The backend is running, but database-dependent features may not work.",
    );
  }
};

export default connectDB;
