import Message from "../models/messageModel.js";
import fileModel from "../models/fileModel.js";

export const getConversation = async (req, res) => {
  try {
    const userId   = req.user._id;
    const friendId = req.params.friendId;
    const page     = parseInt(req.query.page) || 1;
    const limit    = parseInt(req.query.limit) || 40;
    const skip     = (page - 1) * limit;

    const messages = await Message.find({
      $or: [
        { sender: userId,   receiver: friendId },
        { sender: friendId, receiver: userId   },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender",   "username avatar")
      .populate("receiver", "username avatar")
      .populate("file",     "title file_type url size_bytes cloudinary_id");

    res.status(200).json({ messages: messages.reverse(), page });
  } catch (error) {
    console.error("getConversation error:", error);
    res.status(500).json({ message: "Could not fetch conversation.", error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId   = req.user._id;
    const friendId = req.params.friendId;

    await Message.updateMany(
      { sender: friendId, receiver: userId, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read." });
  } catch (error) {
    console.error("markAsRead error:", error);
    res.status(500).json({ message: "Could not mark as read.", error: error.message });
  }
};

export const getConversationList = async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .sort({ createdAt: -1 })
      .populate("sender",   "username avatar")
      .populate("receiver", "username avatar");

    const seen = new Map();
    for (const msg of messages) {
      const otherId = msg.sender._id.toString() === userId.toString()
        ? msg.receiver._id.toString()
        : msg.sender._id.toString();

      if (!seen.has(otherId)) {
        const unreadCount = await Message.countDocuments({
          sender: otherId,
          receiver: userId,
          read: false,
        });
        seen.set(otherId, { lastMessage: msg, unreadCount });
      }
    }

    const conversations = Array.from(seen.values());
    res.status(200).json({ conversations });
  } catch (error) {
    console.error("getConversationList error:", error);
    res.status(500).json({ message: "Could not fetch conversations.", error: error.message });
  }
};

export const getUserFiles = async (req, res) => {
  try {
    const files = await fileModel
      .find({ user_id: req.user._id })
      .populate("subject_id", "title color")
      .sort({ createdAt: -1 });

    res.status(200).json({ files });
  } catch (error) {
    console.error("getUserFiles error:", error);
    res.status(500).json({ message: "Could not fetch files.", error: error.message });
  }
};