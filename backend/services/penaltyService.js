import penaltyModel from "../models/penaltyModel.js";
import studyModel from "../models/studyModel.js";
import User from "../models/userModel.js";

// vedem daca utiliz a lucrat in ultimele 7 zile
export async function hasStudiedThisWeek(user_id) {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const session = await studyModel.findOne({
    user_id,
    status: "completed",
    createdAt: { $gte: oneWeekAgo },
  });

  return !!session;
}

// penalizare de -20 XP/ sapt 
export async function createWeeklyPenalty(user_id) {
  const user = await User.findById(user_id);
  if (!user) return null;

  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const existing = await penaltyModel.findOne({
    user_id,
    resolved: false,
    reason: "Nicio sesiune de studiu în ultima săptămână",
    createdAt: { $gte: oneWeekAgo },
  });

  if (existing) return existing;

  // xp sa nu fie negativ
  const newXp = Math.max(0, (user.xp || 0) - 20);
  await User.findByIdAndUpdate(user_id, { $set: { xp: newXp } });

  return penaltyModel.create({
    user_id,
    xp_lost: 20,
    reason: "Nicio sesiune de studiu în ultima săptămână",
    challenge_active: true,
    challenge_hours: 1, // utiliz trebuie sa studieze 1h pt xp 
    resolved: false,
  });
}


export async function tryResolvePenalty(user_id, duration_minutes) {
  const penalty = await penaltyModel.findOne({
    user_id,
    resolved: false,
    challenge_active: true,
  }).sort({ createdAt: 1 }); 

  if (!penalty) return null;

  const hoursStudied = duration_minutes / 60;

  if (hoursStudied < penalty.challenge_hours) {
    return {
      resolved: false,
      needed_minutes: penalty.challenge_hours * 60,
      done_minutes: duration_minutes,
    };
  }

  // restore xp 
  await User.findByIdAndUpdate(user_id, { $inc: { xp: penalty.xp_lost } });

  penalty.resolved = true;
  penalty.challenge_active = false;
  await penalty.save();

  return {
    resolved: true,
    xp_restored: penalty.xp_lost,
  };
}


export async function getActivePenalties(user_id) {
  return penaltyModel.find({ user_id, resolved: false }).sort({ createdAt: 1 });
}