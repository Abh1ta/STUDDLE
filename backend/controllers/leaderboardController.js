import userModel from "../models/userModel.js";
import friendshipModel from "../models/friendshipModel.js";

export const getGlobalLeaderboard = async (req, res) => {
    try {
        const topUsers = await userModel.find()
            .select("username avatar_url xp level")
            .sort({ xp: -1 })
            .limit(50); 

        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({ message: "Eroare la clasamentul global", error: error.message });
    }
};

export const getFriendsLeaderboard = async (req, res) => {
    try {
        const userId = req.userId;

        const friendships = await friendshipModel.find({
            status: "accepted",
            $or: [{ user_a_id: userId }, { user_b_id: userId }]
        });

        const friendIds = friendships.map(f => 
            f.user_a_id.toString() === userId ? f.user_b_id : f.user_a_id
        );

        friendIds.push(userId);

        const leaderboard = await userModel.find({ _id: { $in: friendIds } })
            .select("username avatar_url xp level")
            .sort({ xp: -1 });

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: "Eroare la clasamentul prietenilor", error: error.message });
    }
};

export const getMyGlobalRank = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilizatorul nu a fost găsit." });
        }

        const count = await userModel.countDocuments({ xp: { $gt: user.xp } });

        res.status(200).json({ 
            rank: count + 1, 
            xp: user.xp,
            username: user.username 
        });
    } catch (error) {
        res.status(500).json({ message: "Eroare la calcularea rangului", error: error.message });
    }
};