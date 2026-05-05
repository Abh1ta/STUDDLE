import mongoose from "mongoose";
import "dotenv/config";
import achievementModel from "./models/achievementModel.js";
import connectDB from "./config/mongodb.js";

const achievements = [
    {
        title: "Primul Pas",
        description: "Ai terminat prima ta sesiune de studiu!",
        xp_reward: 50,
        condition_key: "first_session",
        condition_value: 1
    },
    {
        title: "Student Sârguincios",
        description: "Ai acumulat primii 500 XP.",
        xp_reward: 100,
        condition_key: "total_xp",
        condition_value: 500
    },
    {
        title: "Maestrul Învățării",
        description: "Ai atins pragul de 1000 XP!",
        xp_reward: 200,
        condition_key: "total_xp",
        condition_value: 1000
    }
];

const seedDB = async () => {
    try {
        await connectDB();
        
        // Ștergem ce e vechi ca să nu se dubleze (opțional)
        await achievementModel.deleteMany({});
        
        // Introducem medaliile noi
        await achievementModel.insertMany(achievements);
        
        console.log(" Medaliile au fost adăugate cu succes în baza de date!");
        process.exit();
    } catch (error) {
        console.error(" Eroare la seeding:", error);
        process.exit(1);
    }
};

seedDB();