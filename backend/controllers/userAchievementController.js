import userAchievementModel from "../models/userAchievementModel.js";
import achievementModel from "../models/achievementModel.js";
import mongoose from "mongoose";

export const getUserAchievements = async (req, res) => {
  try {
    const userAchievements = await userAchievementModel
      .find({ user_id: req.params.userId })
      .populate("achievement_id");
    res.status(200).json(userAchievements);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user achievements", error });
  }
};

export const getUserAchievementById = async (req, res) => {
  try {
    const userAchievement = await userAchievementModel
      .findById(req.params.id)
      .populate("achievement_id")
      .populate("user_id");
    if (!userAchievement) return res.status(404).json({ message: "User achievement not found" });
    res.status(200).json(userAchievement);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user achievement", error });
  }
};

export const awardAchievement = async (req, res) => {
  try {
    const { user_id, achievement_id } = req.body;

    const achievement = await achievementModel.findById(achievement_id);
    if (!achievement) return res.status(404).json({ message: "Achievement not found" });

    const existing = await userAchievementModel.findOne({ user_id, achievement_id });
    if (existing) return res.status(409).json({ message: "Achievement already awarded to this user" });

    const userAchievement = new userAchievementModel({ user_id, achievement_id });
    await userAchievement.save();

    res.status(201).json(userAchievement);
  } catch (error) {
    res.status(400).json({ message: "Failed to award achievement", error });
  }
};

export const revokeAchievement = async (req, res) => {
  try {
    const userAchievement = await userAchievementModel.findByIdAndDelete(req.params.id);
    if (!userAchievement) return res.status(404).json({ message: "User achievement not found" });
    res.status(200).json({ message: "Achievement revoked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to revoke achievement", error });
  }
};

export const getUserTotalXP = async (req, res) => {
  try {
    const result = await userAchievementModel.aggregate([
      { $match: { user_id: new mongoose.Types.ObjectId(req.params.userId) } },
      {
        $lookup: {
          from: "achievementmodels", 
          localField: "achievement_id",
          foreignField: "_id",
          as: "achievement"
        }
      },
      { $unwind: "$achievement" },
      { $group: { _id: "$user_id", totalXP: { $sum: "$achievement.xp_reward" } } }
    ]);

    const totalXP = result[0]?.totalXP ?? 0;
    res.status(200).json({ user_id: req.params.userId, totalXP });
  } catch (error) {
    res.status(500).json({ message: "Failed to calculate XP", error });
  }
};