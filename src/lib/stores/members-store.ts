import { Member, MemberMilestone, MilestoneDefinition, Role } from "@/types/domain";
import { INITIAL_MEMBERS, initializeSeedData } from "./seed-data";
import { getBranchById } from "./branches-store";

const KEY = "soultracer:members";
const listeners = new Set<() => void>();
let cachedMembers: Member[] | null = null;

function notify() {
  listeners.forEach((l) => l());
}

export function getMembers(): Member[] {
  if (typeof window === "undefined") return INITIAL_MEMBERS;
  if (!cachedMembers) {
    initializeSeedData();
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      cachedMembers = INITIAL_MEMBERS;
    } else {
      try {
        cachedMembers = JSON.parse(raw);
      } catch {
        cachedMembers = INITIAL_MEMBERS;
      }
    }
  }
  return cachedMembers!;
}

export function getMemberById(id: string): Member | undefined {
  return getMembers().find((m) => m.id === id);
}

export function saveMembers(members: Member[]) {
  cachedMembers = members;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(members));
  }
  notify();
}

export function addMember(member: Member) {
  const current = getMembers();
  saveMembers([member, ...current]);
}

export function importMembers(newMembers: Member[]) {
  const current = getMembers();
  saveMembers([...newMembers, ...current]);
}

export function updateMember(id: string, patch: Partial<Member>) {
  const current = getMembers();
  const updated = current.map((m) => (m.id === id ? { ...m, ...patch } : m));
  saveMembers(updated);
}

export function transferMember(id: string, newBranch: string) {
  const member = getMemberById(id);
  if (!member) return;
  // Transfer retains role, stage, milestones, giving history, originSoulId, but clears/reassigns cell
  updateMember(id, {
    branch: newBranch,
    cellId: null,
    cell: undefined,
  });
}

export type StageSuggestion = {
  memberId: string;
  suggestedStage: string;
  milestoneName: string;
};

export function toggleMemberMilestone(
  memberId: string,
  milestoneId: string,
  completed: boolean,
  date?: string
): StageSuggestion | null {
  const member = getMemberById(memberId);
  if (!member) return null;

  const existingMs = member.milestones || [];
  let updatedMs: MemberMilestone[];

  if (existingMs.some((m) => m.milestoneId === milestoneId)) {
    updatedMs = existingMs.map((m) =>
      m.milestoneId === milestoneId ? { ...m, completed, date: date || m.date } : m
    );
  } else {
    updatedMs = [...existingMs, { milestoneId, completed, date }];
  }

  updateMember(memberId, { milestones: updatedMs });

  // Auto-suggest stage advance evaluation (PO Question 1 resolved)
  if (completed) {
    const branch = getBranchById(member.branch);
    if (branch) {
      const msDef = branch.milestones.find((m: MilestoneDefinition) => m.id === milestoneId);
      if (msDef?.suggestedStage && msDef.suggestedStage !== member.stage) {
        // Check if member is at an earlier stage in the branch sequence
        const currentIdx = branch.stages.indexOf(member.stage);
        const suggestedIdx = branch.stages.indexOf(msDef.suggestedStage);
        if (suggestedIdx > currentIdx) {
          return {
            memberId,
            suggestedStage: msDef.suggestedStage,
            milestoneName: msDef.name,
          };
        }
      }
    }
  }

  return null;
}

export function updateMemberRole(memberId: string, role: Role) {
  updateMember(memberId, { role });
}

export function updateMemberStage(memberId: string, stage: string) {
  updateMember(memberId, { stage });
}

export function subscribeMembers(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
