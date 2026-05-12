import jwt from "jsonwebtoken";
import Message from "../models/messageModel.js";
import fileModel from "../models/fileModel.js";


export const initSocket = (httpServer, io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error("No token provided"));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, username, ... }
      next();
    } catch {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    console.log(` Socket connected: ${userId}`);

    // Join personal room so we can push notifications to this user
    socket.join(userId);

    // Client emits this when opening a conversation window
    socket.on("join_chat", ({ friendId }) => {
      const roomId = getRoomId(userId, friendId);
      socket.join(roomId);
      console.log(`${userId} joined room ${roomId}`);
    });

    socket.on("leave_chat", ({ friendId }) => {
      const roomId = getRoomId(userId, friendId);
      socket.leave(roomId);
    });

    socket.on("send_message", async ({ receiverId, content }) => {
      if (!content?.trim()) return;

      try {
        const msg = await Message.create({
          sender:   userId,
          receiver: receiverId,
          content:  content.trim(),
          type:     "text",
        });

        const populated = await msg.populate("sender", "username avatar");

        const roomId = getRoomId(userId, receiverId);
        io.to(roomId).emit("new_message", populated);

        // Also push to receiver's personal room for sidebar badge
        io.to(receiverId).emit("conversation_updated", {
          fromUserId: userId,
          lastMessage: populated,
        });
      } catch (err) {
        console.error("send_message error:", err);
        socket.emit("error", { message: "Message failed to send." });
      }
    });

    // Client sends a fileId from the user's existing Cloudinary files
    socket.on("share_file", async ({ receiverId, fileId, caption }) => {
      try {
        const file = await fileModel.findOne({
          _id:     fileId,
          user_id: userId, // ensure ownership
        });

        if (!file) {
          return socket.emit("error", { message: "File not found or not yours." });
        }

        const msg = await Message.create({
          sender:   userId,
          receiver: receiverId,
          content:  caption?.trim() || "",
          type:     "file",
          file:     file._id,
          attachment: {
            title:      file.title,
            file_type:  file.file_type,
            url:        file.url,
            size_bytes: file.size_bytes,
          },
        });

        const populated = await msg.populate("sender", "username avatar");

        const roomId = getRoomId(userId, receiverId);
        io.to(roomId).emit("new_message", populated);

        io.to(receiverId).emit("conversation_updated", {
          fromUserId:  userId,
          lastMessage: populated,
        });
      } catch (err) {
        console.error("share_file error:", err);
        socket.emit("error", { message: "Could not share file." });
      }
    });

    socket.on("typing_start", ({ receiverId }) => {
      const roomId = getRoomId(userId, receiverId);
      socket.to(roomId).emit("user_typing", { userId });
    });

    socket.on("typing_stop", ({ receiverId }) => {
      const roomId = getRoomId(userId, receiverId);
      socket.to(roomId).emit("user_stopped_typing", { userId });
    });

    socket.on("mark_read", async ({ senderId }) => {
      try {
        await Message.updateMany(
          { sender: senderId, receiver: userId, read: false },
          { $set: { read: true } }
        );
        // Notify the original sender their messages were read
        io.to(senderId).emit("messages_read", { byUserId: userId });
      } catch (err) {
        console.error("mark_read error:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${userId}`);
    });
  });
};


/** Deterministic room ID so both users always join the same room */
const getRoomId = (a, b) => [a, b].sort().join("_");