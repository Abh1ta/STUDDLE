import subjectModel from "../models/subjectModel.js";
<<<<<<< HEAD
=======
import materialCanvasModel from "../models/MaterialCanvas.js"; 
>>>>>>> origin/feature/update

export const getSubjects = async (req, res) => {
    try {
        const subjects = await subjectModel
            .find({ user_id: req.userId })
            .sort({ createdAt: -1 });
        res.status(200).json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea materiilor", error: error.message });
    }
};

export const createSubject = async (req, res) => {
    try {
        const { title, color } = req.body;
        if (!title?.trim()) {
            return res.status(400).json({ message: "Titlul este obligatoriu." });
        }
        const subject = await subjectModel.create({
            user_id: req.userId,
            title,
            color,
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: "Eroare la creare", error: error.message });
    }
};

export const deleteSubject = async (req, res) => {
    try {
        const subject = await subjectModel.findOne({
            _id: req.params.id,
            user_id: req.userId,
        });
        if (!subject) {
            return res.status(404).json({ message: "Materia nu a fost găsită." });
        }
<<<<<<< HEAD
        await subject.deleteOne();
        res.status(200).json({ message: "Materie ștearsă." });
=======

      
        await materialCanvasModel.deleteMany({ materialId: subject.title });

        await subject.deleteOne();
        
        res.status(200).json({ message: "Materia și toate notițele sale au fost șterse." });
>>>>>>> origin/feature/update
    } catch (error) {
        res.status(500).json({ message: "Eroare la ștergere", error: error.message });
    }
};