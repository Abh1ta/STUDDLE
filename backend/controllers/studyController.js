import mongoose from "mongoose";
import studyModel from "../models/studyModel.js";
import userModel from "../models/userModel.js";
import xpLogModel from "../models/xpLogModel.js";
import achievementModel from "../models/achievementModel.js";
import userAchievementModel from "../models/userAchievementModel.js";
import fileModel from "../models/fileModel.js";
import friendshipModel from "../models/friendshipModel.js";
import { tryResolvePenalty } from "../services/penaltyService.js"; // ← ADD

export const startStudySession = async (req, res) => {
    try {
        const userId = req.userId;

        await studyModel.updateMany(
            { user_id: userId, status: "active" },
            { 
                status: "completed", 
                end_time: new Date(), 
                duration_minutes: 0, 
                xp_earned: 0 
            }
        );

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

export const stopStudySession = async (req, res) => {
    try {
        const userId = req.userId;
        const session = await studyModel.findOne({ user_id: userId, status: "active" });

        if (!session) {
            return res.status(404).json({ message: "Nu s-a găsit nicio sesiune activă." });
        }

        const endTime = new Date();
        const diffMs = endTime - session.start_time;
        const diffMins = Math.round(diffMs / 60000);

        if (diffMins < 1) {
            session.status = "completed";
            session.end_time = endTime;
            session.duration_minutes = 0;
            session.xp_earned = 0;
            await session.save();
            return res.status(200).json({ 
                message: "Sesiune prea scurtă, fără XP acordat.", 
                duration: 0,
                xpGained: 0,
                penaltyResult: null // ← ADD
            });
        }

        const xpGained = diffMins * 0.1;

        session.end_time = endTime;
        session.duration_minutes = diffMins;
        session.xp_earned = xpGained;
        session.status = "completed";
        await session.save();

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            { 
                $inc: { xp: xpGained }, 
                $set: { last_active: new Date() } 
            },
            { new: true }
        );

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

        // ── Penalty resolve ───────────────────────────────────────────────────
        // If user had an active weekly penalty and studied 60+ min, recover XP.
        const penaltyResult = await tryResolvePenalty(userId, diffMins); // ← ADD
        // ─────────────────────────────────────────────────────────────────────

        res.status(200).json({ 
            message: "Sesiune terminată!", 
            duration: diffMins, 
            xpGained,
            currentLevel: updatedUser.level,
            penaltyResult // ← ADD — frontend reads this to show the green recovery banner
        });
    } catch (error) {
        res.status(500).json({ message: "Eroare la oprirea sesiunii", error: error.message });
    }
};

export const getStudyHistory = async (req, res) => {
    try {
        const userId = req.userId;

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

const buildStudyStats = async (userObjId) => {
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const sessions = await studyModel.find({
        user_id: userObjId,
        status: "completed",
        start_time: { $gte: sevenDaysAgo }
    });

    // "YYYY-MM-DD"
    const minutesByDay = {};
    for (let i = 0; i < 7; i++) {
        const d = new Date(sevenDaysAgo);
        d.setDate(sevenDaysAgo.getDate() + i);
        const key = d.toISOString().split("T")[0];
        minutesByDay[key] = 0;
    }

    for (const s of sessions) {
        const key = new Date(s.start_time).toISOString().split("T")[0];
        if (minutesByDay[key] !== undefined) {
            minutesByDay[key] += s.duration_minutes || 0;
        }
    }

    const studyByDay = Object.entries(minutesByDay)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, minutes]) => ({
            date,
            label: new Date(date).toLocaleDateString("ro-RO", { weekday: "short" }),
            minutes,
            hours: Math.round((minutes / 60) * 10) / 10
        }));

    const filesBySubject = await fileModel.aggregate([
        { $match: { user_id: userObjId } },
        { $group: { _id: "$subject_id", count: { $sum: 1 } } },
        {
            $lookup: {
                from: "subjects",
                localField: "_id",
                foreignField: "_id",
                as: "subject"
            }
        },
        {
            $project: {
                count: 1,
                subjectTitle: { $arrayElemAt: ["$subject.title", 0] },
                subjectColor: { $arrayElemAt: ["$subject.color", 0] }
            }
        }
    ]);

    const filesPerSubject = filesBySubject.map(item => ({
        subjectId: item._id,
        title: item.subjectTitle || "Fără materie",
        color: item.subjectColor || "#9bacff",
        count: item.count
    }));

    const totalMinutes = studyByDay.reduce((sum, d) => sum + d.minutes, 0);
    const totalSessions = await studyModel.countDocuments({
        user_id: userObjId,
        status: "completed"
    });

    return {
        studyByDay,
        filesPerSubject,
        totalMinutesThisWeek: totalMinutes,
        totalHoursThisWeek: Math.round((totalMinutes / 60) * 10) / 10,
        totalSessions
    };
};

export const getStudyStats = async (req, res) => {
    try {
        const stats = await buildStudyStats(new mongoose.Types.ObjectId(req.userId));
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: "Eroare la obținerea statisticilor", error: error.message });
    }
};

export const getFriendStudyStats = async (req, res) => {
    try {
        const { friendId } = req.params;
        const userId = new mongoose.Types.ObjectId(req.userId);
        const friendObjId = new mongoose.Types.ObjectId(friendId);

        const friendship = await friendshipModel.findOne({
            status: "accepted",
            $or: [
                { user_a_id: userId, user_b_id: friendObjId },
                { user_a_id: friendObjId, user_b_id: userId }
            ]
        });

        if (!friendship) {
            return res.status(403).json({ message: "Nu ești prieten cu acest utilizator." });
        }

        const stats = await buildStudyStats(friendObjId);
        res.status(200).json(stats);
    } catch (error) {
        console.error("getFriendStudyStats error:", error);
        res.status(500).json({ message: "Eroare la statistici prieten", error: error.message });
    }
};