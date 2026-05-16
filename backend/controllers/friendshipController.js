import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import friendshipModel from "../models/friendshipModel.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Introdu un nume pentru căutare." });
    }

    const users = await userModel.find({
      $and: [
        {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { email: { $regex: query, $options: "i" } }
          ]
        },
        { _id: { $ne: new mongoose.Types.ObjectId(req.userId) } }
      ]
    }).select("username avatar_url xp level");

    res.status(200).json(users);
  } catch (error) {
    console.error("searchUsers error:", error);
    res.status(500).json({ message: "Eroare la căutare", error: error.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const requesterId = req.userId;

    if (!recipientId) {
      return res.status(400).json({ message: "recipientId lipsește." });
    }

    const requesterObjId = new mongoose.Types.ObjectId(requesterId);
    const recipientObjId = new mongoose.Types.ObjectId(recipientId);

    if (requesterObjId.equals(recipientObjId)) {
      return res.status(400).json({ message: "Nu îți poți trimite cerere ție însuți." });
    }

    const existingRequest = await friendshipModel.findOne({
      $or: [
        { user_a_id: requesterObjId, user_b_id: recipientObjId },
        { user_a_id: recipientObjId, user_b_id: requesterObjId }
      ]
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Există deja o cerere sau sunteți deja prieteni." });
    }

    const newFriendship = await friendshipModel.create({
      user_a_id: requesterObjId,
      user_b_id: recipientObjId,
      status: "pending"
    });

    res.status(201).json({ message: "Cerere de prietenie trimisă!", data: newFriendship });
  } catch (error) {
    console.error("sendFriendRequest error:", error);
    res.status(500).json({ message: "Eroare la trimiterea cererii", error: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const userId = req.userId;

    const friendship = await friendshipModel.findById(requestId);

    if (!friendship) {
      return res.status(404).json({ message: "Cererea nu a fost găsită." });
    }

    if (friendship.user_b_id.toString() !== userId) {
      return res.status(403).json({ message: "Nu poți accepta o cerere care nu ți-a fost adresată." });
    }

    friendship.status = "accepted";
    await friendship.save();

    res.status(200).json({ message: "Cerere acceptată! Acum sunteți prieteni.", data: friendship });
  } catch (error) {
    console.error("acceptFriendRequest error:", error);
    res.status(500).json({ message: "Eroare la acceptarea cererii", error: error.message });
  }
};

export const getFriendsList = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const friendships = await friendshipModel.find({
      $and: [
        { status: "accepted" },
        { $or: [{ user_a_id: userId }, { user_b_id: userId }] }
      ]
    }).populate("user_a_id user_b_id", "username avatar_url last_active level");

    const friends = friendships.map(friendship => {
      const friend = friendship.user_a_id._id.toString() === req.userId
        ? friendship.user_b_id
        : friendship.user_a_id;

      const now = new Date();
      const lastActive = new Date(friend.last_active);
      const diffInMinutes = (now - lastActive) / 1000 / 60;
      const isOnline = diffInMinutes < 5;

      return {
        id: friend._id,
        username: friend.username,
        avatar_url: friend.avatar_url,
        level: friend.level,
        isOnline,
        lastActive: friend.last_active
      };
    });

    res.status(200).json(friends);
  } catch (error) {
    console.error("getFriendsList error:", error);
    res.status(500).json({ message: "Eroare la obținerea listei de prieteni", error: error.message });
  }
};

export const getPendingRequests = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const requests = await friendshipModel.find({
      user_b_id: userId,
      status: "pending"
    }).populate("user_a_id", "username avatar_url level");

    res.status(200).json(requests);
  } catch (error) {
    console.error("getPendingRequests error:", error);
    res.status(500).json({ message: "Eroare la obținerea cererilor", error: error.message });
  }
};

export const deleteFriendship = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const friendship = await friendshipModel.findById(id);

    if (!friendship) {
      return res.status(404).json({ message: "Prietenia nu a fost găsită." });
    }

    if (friendship.user_a_id.toString() !== userId && friendship.user_b_id.toString() !== userId) {
      return res.status(403).json({ message: "Nu ai permisiunea să ștergi această prietenie." });
    }

    await friendshipModel.findByIdAndDelete(id);

    res.status(200).json({ message: "Prietenia a fost eliminată." });
  } catch (error) {
    console.error("deleteFriendship error:", error);
    res.status(500).json({ message: "Eroare la ștergere", error: error.message });
  }
};