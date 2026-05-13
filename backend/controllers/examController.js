import examModel from "../models/examModel.js";

export const getExams = async (req, res) => {
    try {
        const exams = await examModel
            .find({ user_id: req.userId })
            .sort({ date: 1 });
        res.status(200).json(exams);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea examenelor", error: error.message });
    }
};

export const createExam = async (req, res) => {
    try {
        const { title, color, date } = req.body;
        if (!title?.trim() || !color || !date) {
            return res.status(400).json({ message: "Toate câmpurile sunt obligatorii." });
        }
        const exam = await examModel.create({
            user_id: req.userId,
            title,
            color,
            date,
        });
        res.status(201).json(exam);
    } catch (error) {
        res.status(500).json({ message: "Eroare la creare", error: error.message });
    }
};

export const deleteExam = async (req, res) => {
    try {
        const exam = await examModel.findOne({
            _id: req.params.id,
            user_id: req.userId,
        });
        if (!exam) {
            return res.status(404).json({ message: "Examenul nu a fost găsit." });
        }
        await exam.deleteOne();
        res.status(200).json({ message: "Examen șters." });
    } catch (error) {
        res.status(500).json({ message: "Eroare la ștergere", error: error.message });
    }
};