import userModel from "../models/userModel.js";
import friendshipModel from "../models/friendshipModel.js";

// @desc    Top 50 utilizatori la nivel global (după XP)
export const getGlobalLeaderboard = async (req, res) => {
    try {
        const topUsers = await userModel.find()
            .select("username avatar_url xp level") // Luăm doar datele necesare
            .sort({ xp: -1 }) // Cel mai mare XP primul
            .limit(50); // Limităm la primii 50 pentru performanță

        res.status(200).json(topUsers);
    } catch (error) {
        res.status(500).json({ message: "Eroare la clasamentul global", error: error.message });
    }
};

// @desc    Clasament între tine și prietenii tăi (acceptați)
export const getFriendsLeaderboard = async (req, res) => {
    try {
        const userId = req.userId;

        // 1. Găsim toate prieteniile confirmate ale utilizatorului
        const friendships = await friendshipModel.find({
            status: "accepted",
            $or: [{ user_a_id: userId }, { user_b_id: userId }]
        });

        // 2. Extragem ID-urile prietenilor
        const friendIds = friendships.map(f => 
            f.user_a_id.toString() === userId ? f.user_b_id : f.user_a_id
        );

        // 3. Ne adăugăm și pe noi în listă pentru a ne vedea poziția față de prieteni
        friendIds.push(userId);

        // 4. Căutăm utilizatorii și îi sortăm după XP
        const leaderboard = await userModel.find({ _id: { $in: friendIds } })
            .select("username avatar_url xp level")
            .sort({ xp: -1 });

        res.status(200).json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: "Eroare la clasamentul prietenilor", error: error.message });
    }
};

// @desc    Obține poziția exactă a utilizatorului curent în clasamentul global
export const getMyGlobalRank = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilizatorul nu a fost găsit." });
        }

        // Numărăm câți utilizatori au XP mai mare decât utilizatorul curent
        const count = await userModel.countDocuments({ xp: { $gt: user.xp } });

        res.status(200).json({ 
            rank: count + 1, // Locul tău este (număr de oameni în față) + 1
            xp: user.xp,
            username: user.username 
        });
    } catch (error) {
        res.status(500).json({ message: "Eroare la calcularea rangului", error: error.message });
    }
};