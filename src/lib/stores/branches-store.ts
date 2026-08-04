import { Branch, MilestoneDefinition } from "@/types/domain";
import { INITIAL_BRANCHES, initializeSeedData } from "./seed-data";

const KEY = "soultracer:branches";
const listeners = new Set<() => void>();
let cachedBranches: Branch[] | null = null;

function notify() {
  listeners.forEach((l) => l());
}

export function getBranches(): Branch[] {
  if (typeof window === "undefined") return INITIAL_BRANCHES;
  if (!cachedBranches) {
    initializeSeedData();
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      cachedBranches = INITIAL_BRANCHES;
    } else {
      try {
        cachedBranches = JSON.parse(raw);
      } catch {
        cachedBranches = INITIAL_BRANCHES;
      }
    }
  }
  return cachedBranches!;
}

export function getBranchById(id: string): Branch | undefined {
  return getBranches().find((b) => b.id === id || b.name === id);
}

export function saveBranches(branches: Branch[]) {
  cachedBranches = branches;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(branches));
  }
  notify();
}

export function addBranch(branch: Branch) {
  const current = getBranches();
  saveBranches([branch, ...current]);
}

export function updateBranch(id: string, patch: Partial<Branch>) {
  const current = getBranches();
  const updated = current.map((b) => (b.id === id ? { ...b, ...patch } : b));
  saveBranches(updated);
}

export function archiveBranch(id: string) {
  updateBranch(id, { status: "archived" });
}

export function updateBranchStages(branchId: string, stages: string[]) {
  updateBranch(branchId, { stages });
}

export function addBranchMilestone(branchId: string, milestone: MilestoneDefinition) {
  const branch = getBranchById(branchId);
  if (!branch) return;
  const milestones = [...branch.milestones, milestone];
  updateBranch(branchId, { milestones });
}

export function updateBranchMilestone(
  branchId: string,
  milestoneId: string,
  patch: Partial<MilestoneDefinition>,
) {
  const branch = getBranchById(branchId);
  if (!branch) return;
  const milestones = branch.milestones.map((m) => (m.id === milestoneId ? { ...m, ...patch } : m));
  updateBranch(branchId, { milestones });
}

export function archiveBranchMilestone(branchId: string, milestoneId: string) {
  updateBranchMilestone(branchId, milestoneId, { status: "archived" });
}

export function subscribeBranches(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
