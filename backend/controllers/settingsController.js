import userSettingsModel from "../models/userSettingsModel.js";
import avatarModel from "../models/avatarModel.js";


export const getUserSettings = async (req, res) => {
  try {
    const settings = await userSettingsModel.findOne({ user_id: req.userId });

    if (!settings) {
      return res.status(404).json({ success: false, message: "Settings not found." });
    }

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

export const createOrUpdateUserSettings = async (req, res) => {
  try {
    const { bg_color, bg_style, music_pref, learn_method, break_interval_min } = req.body;

    if (break_interval_min !== undefined && (break_interval_min < 5 || break_interval_min > 120)) {
      return res.status(400).json({
        success: false,
        message: "Pauza trebuie sa fie între 5 și 120 de minute.",
      });
    }

    const settings = await userSettingsModel.findOneAndUpdate(
      { user_id: req.userId },
      { bg_color, bg_style, music_pref, learn_method, break_interval_min },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Settings updated.", data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

export const resetUserSettings = async (req, res) => {
  try {
    const defaults = {
      bg_color: "#ffffff",
      bg_style: "default",
      music_pref: "none",
      learn_method: "pomodoro",
      break_interval_min: 25,
    };

    const settings = await userSettingsModel.findOneAndUpdate(
      { user_id: req.userId },
      defaults,
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Setarile resetate la defaults.", data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};


export const getAvatar = async (req, res) => {
  try {
    const avatar = await avatarModel.findOne({ user_id: req.userId });

    if (!avatar) {
      return res.status(404).json({ success: false, message: "Avatarul nu a fost găsit." });
    }

    res.status(200).json({ success: true, data: avatar });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

export const createOrUpdateAvatar = async (req, res) => {
  try {
    const {  eye_color, skin_color } = req.body;

   

    const avatar = await avatarModel.findOneAndUpdate(
      { user_id: req.userId },
      { eye_color, skin_color },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: "Avatar updated.", data: avatar });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};

export const resetAvatar = async (req, res) => {
  try {
    const defaults = {
      
      eye_color: "#008000",
      skin_color: "#efefef",
    };

    const avatar = await avatarModel.findOneAndUpdate(
      { user_id: req.userId },
      defaults,
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, message: "Avatar resetat la defaults.", data: avatar });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};


export const getFullAccountSettings = async (req, res) => {
  try {
    const [settings, avatar] = await Promise.all([
      userSettingsModel.findOne({ user_id: req.userId }),
      avatarModel.findOne({ user_id: req.userId }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        settings: settings || null,
        avatar: avatar || null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error.", error: error.message });
  }
};