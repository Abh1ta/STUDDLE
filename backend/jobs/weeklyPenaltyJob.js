import cron from "node-cron";
import User from "../models/userModel.js";
import { hasStudiedThisWeek, createWeeklyPenalty } from "../services/penaltyService.js";

// Every Monday at 00:00
cron.schedule("0 0 * * 1", async () => {
  console.log("[WeeklyPenalty] Running check...");

  const users = await User.find({}, "_id username");

  for (const user of users) {
    const studied = await hasStudiedThisWeek(user._id);
    if (!studied) {
      await createWeeklyPenalty(user._id);
      console.log(`[WeeklyPenalty] -20 XP → ${user.username}`);
    }
  }

  console.log("[WeeklyPenalty] Done.");
});