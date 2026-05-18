import penaltyModel from "../models/penaltyModel.js";
import studyModel from "../models/studyModel.js";
import User from "../models/userModel.js";

// ─── Check if user has studied at least once in the last 7 days ───────────────
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

// ─── Apply -20 XP weekly penalty ─────────────────────────────────────────────
export async function createWeeklyPenalty(user_id) {
  const user = await User.findById(user_id);
  if (!user) return null;

  // Guard: don't double-penalize if penalty already exists this week
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  const existing = await penaltyModel.findOne({
    user_id,
    resolved: false,
    reason: "Nicio sesiune de studiu în ultima săptămână",
    createdAt: { $gte: oneWeekAgo },
  });

  if (existing) return existing;

  // Deduct XP (floor at 0 so XP never goes negative)
  const newXp = Math.max(0, (user.xp || 0) - 20);
  await User.findByIdAndUpdate(user_id, { $set: { xp: newXp } });

  return penaltyModel.create({
    user_id,
    xp_lost: 20,
    reason: "Nicio sesiune de studiu în ultima săptămână",
    challenge_active: true,
    challenge_hours: 1, // user must study 1h to recover XP
    resolved: false,
  });
}

// ─── Try to resolve oldest active penalty after a study session ───────────────
// Called automatically from the /api/study/stop route.
// Returns null if no active penalty, otherwise { resolved, xp_restored } or { resolved: false, needed_minutes, done_minutes }
export async function tryResolvePenalty(user_id, duration_minutes) {
  const penalty = await penaltyModel.findOne({
    user_id,
    resolved: false,
    challenge_active: true,
  }).sort({ createdAt: 1 }); // oldest first

  if (!penalty) return null;

  const hoursStudied = duration_minutes / 60;

  if (hoursStudied < penalty.challenge_hours) {
    return {
      resolved: false,
      needed_minutes: penalty.challenge_hours * 60,
      done_minutes: duration_minutes,
    };
  }

  // Challenge met — restore XP and close penalty
  await User.findByIdAndUpdate(user_id, { $inc: { xp: penalty.xp_lost } });

  penalty.resolved = true;
  penalty.challenge_active = false;
  await penalty.save();

  return {
    resolved: true,
    xp_restored: penalty.xp_lost,
  };
}

// ─── Get all unresolved penalties for a user ─────────────────────────────────
export async function getActivePenalties(user_id) {
  return penaltyModel.find({ user_id, resolved: false }).sort({ createdAt: 1 });
}