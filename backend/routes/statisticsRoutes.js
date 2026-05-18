import express from "express";
import Statistic from "../models/Statistic.js";
import simpleAuth from "../middleware/simpleAuth.js";

const router = express.Router();

const getOrCreateStats = async (userId) => {
  let stats = await Statistic.findOne({ userId });

  if (!stats) {
    stats = await Statistic.create({ userId });
  }

  return stats;
};

const buildStudyBars = (studySessions) => {
  const today = new Date();
  const days = [];

  for (let i = 3; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    d.setHours(0, 0, 0, 0);

    const next = new Date(d);
    next.setDate(d.getDate() + 1);

    const totalMinutes = studySessions
      .filter((session) => {
        const sessionDate = new Date(session.data);
        return sessionDate >= d && sessionDate < next;
      })
      .reduce((sum, session) => sum + Number(session.minutes || 0), 0);

    days.push(Number(totalMinutes.toFixed(2)));
  }

  return days;
};

router.get("/me", simpleAuth, async (req, res) => {
  try {
    const stats = await getOrCreateStats(req.user.id);

    res.json({
      totalAccesari: stats.totalAccesari,
      materiiAccesate: stats.materiiAccesate,
      temeAccesate: stats.temeAccesate,
      ultimeleAccesari: stats.ultimeleAccesari,
      studyBars: buildStudyBars(stats.studySessions),
      studySessions: stats.studySessions
    });
  } catch (err) {
    console.error("Eroare la statistici:", err);
    res.status(500).json({
      message: "Eroare la încărcarea statisticilor."
    });
  }
});

router.post("/access", simpleAuth, async (req, res) => {
  try {
    const { nume, tip, materialId } = req.body;

    const stats = await getOrCreateStats(req.user.id);

    stats.totalAccesari += 1;

    if (tip === "materie") {
      stats.materiiAccesate += 1;
    }

    if (tip === "tema") {
      stats.temeAccesate += 1;
    }

    stats.ultimeleAccesari.unshift({
      nume,
      tip,
      materialId,
      data: new Date()
    });

    stats.ultimeleAccesari = stats.ultimeleAccesari.slice(0, 10);

    await stats.save();

    res.json({
      message: "Accesare salvată.",
      totalAccesari: stats.totalAccesari,
      materiiAccesate: stats.materiiAccesate,
      temeAccesate: stats.temeAccesate,
      ultimeleAccesari: stats.ultimeleAccesari,
      studyBars: buildStudyBars(stats.studySessions)
    });
  } catch (err) {
    console.error("Eroare la salvarea accesării:", err);
    res.status(500).json({
      message: "Eroare la salvarea accesării."
    });
  }
});

router.post("/study-time", simpleAuth, async (req, res) => {
  try {
    const { materialId, nume, seconds, minutes, source } = req.body;

    const safeSeconds = Number(seconds || 0);
    const safeMinutes =
      Number(minutes || 0) > 0
        ? Number(minutes)
        : safeSeconds / 60;

    if (safeSeconds <= 0 && safeMinutes <= 0) {
      return res.status(400).json({
        message: "Timp invalid."
      });
    }

    const stats = await getOrCreateStats(req.user.id);

    stats.studySessions.push({
      materialId: materialId || "",
      nume: nume || "",
      seconds: safeSeconds,
      minutes: safeMinutes,
      source: source || "unknown",
      data: new Date()
    });

    stats.studySessions = stats.studySessions.slice(-300);

    await stats.save();

    res.json({
      message: "Timp de studiu salvat.",
      studyBars: buildStudyBars(stats.studySessions),
      studySessions: stats.studySessions
    });
  } catch (err) {
    console.error("Eroare la salvarea timpului de studiu:", err);
    res.status(500).json({
      message: "Eroare la salvarea timpului de studiu."
    });
  }
});

export default router;