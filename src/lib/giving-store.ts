export type GivingType = "Tithe" | "Offering" | "Project" | "Partnership" | "Seed";

export type GivingRecord = {
  id: string;
  date: string;
  type: GivingType;
  source: string;
  amount: number;
  branch: string;
  giver?: string;
};

let store: GivingRecord[] = [
  { id: "g1", date: "2026-05-17", type: "Tithe", source: "Sunday Service", amount: 18420, branch: "Lagos Central" },
  { id: "g2", date: "2026-05-17", type: "Offering", source: "Sunday Service", amount: 6240, branch: "Lagos Central" },
  { id: "g3", date: "2026-05-14", type: "Project", source: "Building Fund", amount: 12300, branch: "Abuja Hub" },
  { id: "g4", date: "2026-05-10", type: "Tithe", source: "Sunday Service", amount: 14820, branch: "Accra Sanctuary" },
  { id: "g5", date: "2026-05-10", type: "Offering", source: "Sunday Service", amount: 4720, branch: "Houston Citadel" },
  { id: "g6", date: "2026-05-08", type: "Partnership", source: "Monthly Partner", amount: 8500, branch: "Lagos Central", giver: "Anonymous" },
];

const listeners = new Set<() => void>();

export function getGiving() {
  return store;
}

export function addGiving(r: Omit<GivingRecord, "id">) {
  const rec: GivingRecord = { id: `g${Date.now()}`, ...r };
  store = [rec, ...store];
  listeners.forEach((l) => l());
  return rec;
}

export function deleteGiving(id: string) {
  store = store.filter((r) => r.id !== id);
  listeners.forEach((l) => l());
}

export function subscribeGiving(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export const GIVING_TYPES: GivingType[] = ["Tithe", "Offering", "Project", "Partnership", "Seed"];
