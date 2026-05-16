import homeworkModel from "../models/homeworkModel.js";

export const getHomework = async (req, res) => {
    try {
        const items = await homeworkModel
            .find({ user_id: req.userId })
            .sort({ createdAt: -1 });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea temelor", error: error.message });
    }
};

export const createHomework = async (req, res) => {
    try {
        const { title, color } = req.body;
        if (!title?.trim()) {
            return res.status(400).json({ message: "Titlul este obligatoriu." });
        }
        const item = await homeworkModel.create({
            user_id: req.userId,
            title,
            color,
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: "Eroare la creare", error: error.message });
    }
};

export const deleteHomework = async (req, res) => {
    try {
        const item = await homeworkModel.findOne({
            _id: req.params.id,
            user_id: req.userId,
        });
        if (!item) {
            return res.status(404).json({ message: "Tema nu a fost găsită." });
        }
        await item.deleteOne();
        res.status(200).json({ message: "Temă ștearsă." });
    } catch (error) {
        res.status(500).json({ message: "Eroare la ștergere", error: error.message });
    }
};