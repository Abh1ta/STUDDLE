import studyModel from "../models/studyModel.js";
import userModel from "../models/userModel.js";
import xpLogModel from "../models/xpLogModel.js";
import achievementModel from "../models/achievementModel.js";
import userAchievementModel from "../models/userAchievementModel.js";

// @desc    Pornește o sesiune de studiu
export const startStudySession = async (req, res) => {
    try {
        const userId = req.userId;

        const activeSession = await studyModel.findOne({ user_id: userId, status: "active" });
        if (activeSession) {
            return res.status(400).json({ message: "Ai deja o sesiune de studiu activă!" });
        }

        const { subject_id } = req.body;
        const newSession = await studyModel.create({
            user_id: userId,
            subject_id: subject_id || null,
            start_time: new Date(),
            status: "active"
        });

        res.status(201).json(newSession);
    } catch (error) {
        res.status(500).json({ message: "Eroare la pornirea sesiunii", error: error.message });
    }
};

// @desc    Oprește sesiunea și calculează XP-ul
export const stopStudySession = async (req, res) => {
    try {
        const userId = req.userId;
        const session = await studyModel.findOne({ user_id: userId, status: "active" });

        if (!session) {
            return res.status(404).json({ message: "Nu s-a găsit nicio sesiune activă." });
        }

        const endTime = new Date();
        const diffMs = endTime - session.start_time;
        const diffMins = Math.floor(diffMs / 60000);

        // FIX: Sesiunile sub 1 minut nu primesc XP
        if (diffMins < 1) {
            session.status = "completed";
            session.end_time = endTime;
            session.duration_minutes = 0;
            session.xp_earned = 0;
            await session.save();
            return res.status(200).json({ 
                message: "Sesiune prea scurtă, fără XP acordat.", 
                duration: 0,
                xpGained: 0 
            });
        }

        const xpGained = diffMins * 0.1;

        session.end_time = endTime;
        session.duration_minutes = diffMins;
        session.xp_earned = xpGained;
        session.status = "completed";
        await session.save();

        // FIX: Folosim findByIdAndUpdate pentru a evita race conditions
        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { 
                $inc: { xp: xpGained }, 
                $set: { last_active: new Date() } 
            },
            { new: true }
        );

        // Calculăm noul level după ce avem XP-ul actualizat
        const newLevel = Math.floor(updatedUser.xp / 500) + 1;
        if (newLevel !== updatedUser.level) {
            updatedUser.level = newLevel;
            await updatedUser.save();
        }

        await checkAndAwardAchievements(userId, updatedUser.xp);

        await xpLogModel.create({
            user_id: userId,
            source: "Study Session",
            delta: xpGained
        });

        res.status(200).json({ 
            message: "Sesiune terminată!", 
            duration: diffMins, 
            xpGained,
            currentLevel: updatedUser.level 
        });
    } catch (error) {
        res.status(500).json({ message: "Eroare la oprirea sesiunii", error: error.message });
    }
};

// @desc    Obține istoricul sesiunilor (cu paginare)
export const getStudyHistory = async (req, res) => {
    try {
        const userId = req.userId;

        // FIX: Paginare adăugată
        const page = parseInt(req.query.page) || 1;
        const limit = 20;
        const skip = (page - 1) * limit;

        const history = await studyModel.find({ user_id: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await studyModel.countDocuments({ user_id: userId });

        res.status(200).json({
            history,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalSessions: total
        });
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea istoricului", error: error.message });
    }
};

const checkAndAwardAchievements = async (userId, userXP) => {
    try {
        const allAchievements = await achievementModel.find();
        const earnedAchievements = await userAchievementModel.find({ user_id: userId });
        const earnedIds = earnedAchievements.map(ua => ua.achievement_id.toString());

        for (let ach of allAchievements) {
            if (!earnedIds.includes(ach._id.toString())) {
                let conditionMet = false;

                if (ach.condition_key === "total_xp" && userXP >= ach.condition_value) {
                    conditionMet = true;
                }

                // FIX: Verificăm că e chiar prima sesiune completată
                if (ach.condition_key === "first_session") {
                    const sessionCount = await studyModel.countDocuments({ 
                        user_id: userId, 
                        status: "completed" 
                    });
                    conditionMet = sessionCount === 1;
                }

                if (conditionMet) {
                    await userAchievementModel.create({
                        user_id: userId,
                        achievement_id: ach._id
                    });
                    console.log(`Achievement deblocat: ${ach.title}`);
                }
            }
        }
    } catch (error) {
        console.error("Eroare la verificarea achievement-urilor:", error);
    }
};