import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await userModel.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ message: "Email sau username deja folosite." });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({ username, email, password_hash });

    sendWelcomeEmail(email, username).catch(console.error);

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: newUser._id, username, email } });
  } catch (err) {
    res.status(500).json({ message: "Eroare server", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User nu a fost găsit." });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(401).json({ message: "Credențiale invalide." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: "Eroare server", error: err.message });
  }
};
export const deleteAccount = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.userId);
    res.status(200).json({ message: "Cont șters cu succes." });
  } catch (error) {
    res.status(500).json({ message: "Eroare la ștergere", error: error.message });
  }
};