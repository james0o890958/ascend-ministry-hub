import { Soul, SoulFollowUp, SoulNote, SoulPrayer, SoulMilestone, SoulStage, Member } from "@/types/domain";
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
  saveSouls([soul, ...current]);
}

export function updateSoul(id: string, patch: Partial<Soul>) {
  const current = getSouls();
  const updated = current.map((s) => (s.id === id ? { ...s, ...patch } : s));
  saveSouls(updated);
  return getSoulById(id);
}

export function addSoulFollowUp(id: string, f: SoulFollowUp) {
  const soul = getSoulById(id);
  if (!soul) return;
  const updatedFollowUps = [f, ...(soul.followUps || [])];
  updateSoul(id, { followUps: updatedFollowUps });
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

export function addSoulMilestone(id: string, m: SoulMilestone) {
  const soul = getSoulById(id);
  if (!soul) return;
  const updatedMilestones = [m, ...(soul.milestones || [])];
  updateSoul(id, { milestones: updatedMilestones });
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

  const newMember: Member = {
    id: memberId,
    name: input.name,
    email: input.email,
    phone: input.phone,
    branch: input.branch,
    role: "Member",
    stage: input.startingStage || "Invitee",
    milestones: [],
    mentor: input.mentor || soul.mentor || "Branch Leadership",
    joinedAt: new Date().toISOString(),
    avatar: soul.avatar || `https://i.pravatar.cc/120?img=${Math.floor(Math.random() * 70) + 1}`,
    status: "active",
    originSoulId: soul.id,
    attendance: 100,
  };

  // 1. Add new Member
  addMember(newMember);

  // 2. Archive Soul & link to new Member
  updateSoul(soulId, {
    stage: "Converted",
    status: "archived",
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
