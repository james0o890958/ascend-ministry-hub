import {
  Soul,
  SoulFollowUp,
  SoulNote,
  SoulPrayer,
  SoulMilestone,
  SoulStage,
  Member,
} from "@/types/domain";
import { INITIAL_SOULS, initializeSeedData } from "./seed-data";
import { addMember } from "./members-store";

const KEY = "soultracer:souls";
const listeners = new Set<() => void>();
let cachedSouls: Soul[] | null = null;

function notify() {
  listeners.forEach((l) => l());
}

export function getSouls(): Soul[] {
  if (typeof window === "undefined") return INITIAL_SOULS;
  if (!cachedSouls) {
    initializeSeedData();
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      cachedSouls = INITIAL_SOULS;
    } else {
      try {
        cachedSouls = JSON.parse(raw);
      } catch {
        cachedSouls = INITIAL_SOULS;
      }
    }
  }
  return cachedSouls!;
}

export function getActiveSouls(): Soul[] {
  return getSouls().filter((s) => s.status === "active" && s.stage !== "Converted");
}

export function getSoulById(id: string): Soul | undefined {
  return getSouls().find((s) => s.id === id);
}

export function saveSouls(souls: Soul[]) {
  cachedSouls = souls;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(souls));
  }
  notify();
}

export function addSoulToStore(soul: Soul) {
  const current = getSouls();
  const year = new Date().getFullYear();
  const serial = String(current.length + 1).padStart(4, "0");
  const soulTracerId = soul.soulTracerId || `ST-S-${year}-${serial}`;
  const soulWithId = recalculateSoulGrowth({
    ...soul,
    soulTracerId,
  });
  saveSouls([soulWithId, ...current]);
}

export function updateSoul(id: string, patch: Partial<Soul>) {
  const current = getSouls();
  const updated = current.map((s) => (s.id === id ? { ...s, ...patch } : s));
  saveSouls(updated);
  return getSoulById(id);
}

export function recalculateSoulGrowth(soul: Soul): Soul {
  const followUps = soul.followUps || [];
  const validFollowUps = followUps.filter((f) => f.status !== "cancelled");
  const completed = validFollowUps.filter((f) => f.status === "completed" || !f.status).length;
  const total = validFollowUps.length;
  const followUpCompletion =
    total > 0 ? Math.round((completed / total) * 100) : soul.growth?.followUpCompletion || 0;

  const badges = soul.badges || [];
  const milestones = soul.milestones || [];

  let discipleship = 20;
  if (badges.includes("Born Again")) discipleship += 20;
  if (badges.includes("Baptized")) discipleship += 20;
  if (badges.includes("Spirit Filled")) discipleship += 20;
  if (milestones.some((m) => m.title.toLowerCase().includes("foundation"))) discipleship += 20;
  discipleship = Math.min(100, discipleship);

  let bibleStudy = 30;
  if (milestones.some((m) => m.kind === "Discipleship" || m.title.toLowerCase().includes("bible")))
    bibleStudy += 35;
  if (badges.includes("Faithful Attender")) bibleStudy += 35;
  bibleStudy = Math.min(100, bibleStudy);

  let churchInvolvement = 25;
  if (badges.includes("Faithful Attender")) churchInvolvement += 25;
  if (badges.includes("Tithing")) churchInvolvement += 25;
  if (milestones.some((m) => m.kind === "Ministry")) churchInvolvement += 25;
  churchInvolvement = Math.min(100, churchInvolvement);

  return {
    ...soul,
    growth: {
      discipleship,
      bibleStudy,
      churchInvolvement,
      followUpCompletion,
    },
  };
}

export function addSoulFollowUp(id: string, f: SoulFollowUp) {
  const soul = getSoulById(id);
  if (!soul) return;
  const updatedFollowUps = [f, ...(soul.followUps || [])];
  const updatedSoul = recalculateSoulGrowth({ ...soul, followUps: updatedFollowUps });
  updateSoul(id, { followUps: updatedFollowUps, growth: updatedSoul.growth });
}

export function completeSoulFollowUp(id: string, followUpId: string, outcome?: string) {
  const soul = getSoulById(id);
  if (!soul) return;
  const updatedFollowUps = (soul.followUps || []).map((f) =>
    f.id === followUpId
      ? {
          ...f,
          status: "completed" as const,
          completedAt: new Date().toISOString().slice(0, 10),
          outcome: outcome || f.outcome,
        }
      : f,
  );
  const updatedSoul = recalculateSoulGrowth({ ...soul, followUps: updatedFollowUps });
  updateSoul(id, { followUps: updatedFollowUps, growth: updatedSoul.growth });
}

export function cancelSoulFollowUp(id: string, followUpId: string) {
  const soul = getSoulById(id);
  if (!soul) return;
  const updatedFollowUps = (soul.followUps || []).map((f) =>
    f.id === followUpId ? { ...f, status: "cancelled" as const } : f,
  );
  const updatedSoul = recalculateSoulGrowth({ ...soul, followUps: updatedFollowUps });
  updateSoul(id, { followUps: updatedFollowUps, growth: updatedSoul.growth });
}

export function addSoulNote(id: string, n: SoulNote) {
  const soul = getSoulById(id);
  if (!soul) return;
  const updatedNotes = [n, ...(soul.noteLog || [])];
  updateSoul(id, { noteLog: updatedNotes });
}

export function addSoulPrayer(id: string, p: SoulPrayer) {
  const soul = getSoulById(id);
  if (!soul) return;
  const updatedPrayers = [p, ...(soul.prayers || [])];
  updateSoul(id, { prayers: updatedPrayers });
}

export function markPrayerAnswered(id: string, prayerId: string, testimony?: string) {
  const soul = getSoulById(id);
  if (!soul) return;
  const updatedPrayers = (soul.prayers || []).map((p) =>
    p.id === prayerId
      ? {
          ...p,
          status: "Answered" as const,
          answeredAt: new Date().toISOString().slice(0, 10),
          testimony: testimony || p.testimony,
        }
      : p,
  );
  updateSoul(id, { prayers: updatedPrayers });
}

export function addSoulMilestone(id: string, m: SoulMilestone) {
  const soul = getSoulById(id);
  if (!soul) return;
  const updatedMilestones = [m, ...(soul.milestones || [])];
  const updatedSoul = recalculateSoulGrowth({ ...soul, milestones: updatedMilestones });
  updateSoul(id, { milestones: updatedMilestones, growth: updatedSoul.growth });
}

export type ConvertSoulInput = {
  name: string;
  email: string;
  phone: string;
  branch: string;
  startingStage?: string;
  mentor?: string;
};

export function convertSoulToMember(soulId: string, input: ConvertSoulInput) {
  const soul = getSoulById(soulId);
  if (!soul) throw new Error("Soul not found");

  const memberId = `m${Date.now()}`;
  const tempPasskey = `ST-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString().slice(0, 10);

  const convertedMilestones = (soul.milestones || []).map((m, idx) => ({
    milestoneId: `ms-converted-${idx}`,
    completed: true,
    date: m.date,
  }));

  const newMember: Member = {
    id: memberId,
    soulTracerId:
      soul.soulTracerId ||
      `ST-M-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    name: input.name,
    email: input.email,
    phone: input.phone,
    branch: input.branch,
    role: "Member",
    stage: input.startingStage || "Invitee",
    milestones: convertedMilestones,
    badges: soul.badges || [],
    mentor: input.mentor || soul.mentor || "Branch Leadership",
    joinedAt: soul.date || now,
    convertedAt: now,
    avatar: soul.avatar || `https://i.pravatar.cc/120?img=${Math.floor(Math.random() * 70) + 1}`,
    status: "active",
    originType: "evangelism",
    originSoulId: soul.id,
    attendance: 100,
  };

  addMember(newMember);

  updateSoul(soulId, {
    stage: "Converted",
    status: "archived",
    convertedAt: now,
    convertedMemberId: memberId,
  });

  return {
    member: newMember,
    soul: getSoulById(soulId)!,
    credentials: {
      email: input.email,
      tempPasskey,
    },
  };
}

export function subscribeSouls(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
