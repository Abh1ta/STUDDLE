import achievementModel from "../models/achievementModel.js";
import { v2 as cloudinary } from "cloudinary";

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "achievements" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await achievementModel.find();
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch achievements", error });
  }
};

export const getAchievementById = async (req, res) => {
  try {
    const achievement = await achievementModel.findById(req.params.id);
    if (!achievement) return res.status(404).json({ message: "Achievement not found" });
    res.status(200).json(achievement);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch achievement", error });
  }
};

export const createAchievement = async (req, res) => {
  try {
    let iconUrl = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      iconUrl = result.secure_url;
    }

    const achievement = new achievementModel({
      ...req.body,
      ...(iconUrl && { icon: iconUrl }),
    });

    await achievement.save();
    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ message: "Failed to create achievement", error });
  }
};

export const updateAchievement = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
<<<<<<< HEAD
      // Delete old icon from Cloudinary if it exists
=======
     
>>>>>>> origin/feature/update
      const existing = await achievementModel.findById(req.params.id);
      if (existing?.icon) {
        const publicId = existing.icon.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`achievements/${publicId}`);
      }
      const result = await uploadToCloudinary(req.file.buffer);
      updateData.icon = result.secure_url;
    }

    const achievement = await achievementModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!achievement) return res.status(404).json({ message: "Achievement not found" });
    res.status(200).json(achievement);
  } catch (error) {
    res.status(400).json({ message: "Failed to update achievement", error });
  }
};

export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await achievementModel.findByIdAndDelete(req.params.id);
    if (!achievement) return res.status(404).json({ message: "Achievement not found" });

    if (achievement.icon) {
      const publicId = achievement.icon.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`achievements/${publicId}`);
    }

    res.status(200).json({ message: "Achievement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete achievement", error });
  }
};