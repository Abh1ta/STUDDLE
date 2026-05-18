import subjectModel from "../models/subjectModel.js";
import materialCanvasModel from "../models/MaterialCanvas.js"; 

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

        // 2. ȘTERGEREA ÎN CASCADĂ: Curățăm notițele asociate numelui acestei materii
        // Căutăm după 'materialId' fiindcă frontend-ul trimite titlul materiei când creează o notiță nouă
        await materialCanvasModel.deleteMany({ materialId: subject.title });

        // 3. Abia acum ștergem materia propriu-zisă
        await subject.deleteOne();
        
        res.status(200).json({ message: "Materia și toate notițele sale au fost șterse." });
    } catch (error) {
        res.status(500).json({ message: "Eroare la ștergere", error: error.message });
    }
};