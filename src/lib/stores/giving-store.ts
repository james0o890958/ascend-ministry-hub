import { GivingRecord, GivingTypeConfig, GivingType, PartnershipPledge, ChurchBankDetail } from "@/types/domain";
export type { GivingType };
import {
  INITIAL_GIVING,
  INITIAL_GIVING_CONFIGS,
  INITIAL_PLEDGES,
  INITIAL_BANK_DETAILS,
  initializeSeedData,
} from "./seed-data";

const GIVING_KEY = "soultracer:giving";
const CONFIGS_KEY = "soultracer:giving_configs";
const PLEDGES_KEY = "soultracer:pledges";
const BANK_KEY = "soultracer:bank_details";

const listeners = new Set<() => void>();
let cachedGiving: GivingRecord[] | null = null;
let cachedConfigs: GivingTypeConfig[] | null = null;
let cachedPledges: PartnershipPledge[] | null = null;
let cachedBankDetails: ChurchBankDetail[] | null = null;

function notify() {
  listeners.forEach((l) => l());
}

// ── Giving Configs ────────────────────────────────────────────────────────────

export function getGivingConfigs(): GivingTypeConfig[] {
  if (typeof window === "undefined") return INITIAL_GIVING_CONFIGS;
  if (!cachedConfigs) {
    initializeSeedData();
    const raw = localStorage.getItem(CONFIGS_KEY);
    if (!raw) {
      cachedConfigs = INITIAL_GIVING_CONFIGS;
    } else {
      try {
        cachedConfigs = JSON.parse(raw);
      } catch {
        cachedConfigs = INITIAL_GIVING_CONFIGS;
      }
    }
  }
  return cachedConfigs!;
}

export function saveGivingConfigs(configs: GivingTypeConfig[]) {
  cachedConfigs = configs;
  if (typeof window !== "undefined") {
    localStorage.setItem(CONFIGS_KEY, JSON.stringify(configs));
  }
  notify();
}

export function updateGivingConfig(type: GivingType, isMinistryWideRollup: boolean) {
  const current = getGivingConfigs();
  const updated = current.map((c) => (c.type === type ? { ...c, isMinistryWideRollup } : c));
  saveGivingConfigs(updated);
}

// ── Giving Records ────────────────────────────────────────────────────────────

export function getGiving(): GivingRecord[] {
  if (typeof window === "undefined") return INITIAL_GIVING;
  if (!cachedGiving) {
    initializeSeedData();
    const raw = localStorage.getItem(GIVING_KEY);
    if (!raw) {
      cachedGiving = INITIAL_GIVING;
    } else {
      try {
        cachedGiving = JSON.parse(raw);
      } catch {
        cachedGiving = INITIAL_GIVING;
      }
    }
  }
  return cachedGiving!;
}

export function saveGiving(records: GivingRecord[]) {
  cachedGiving = records;
  if (typeof window !== "undefined") {
    localStorage.setItem(GIVING_KEY, JSON.stringify(records));
  }
  notify();
}

export function addGiving(r: Omit<GivingRecord, "id">) {
  const configs = getGivingConfigs();
  const config = configs.find((c) => c.type === r.type);
  const isMinistryWide = config ? config.isMinistryWideRollup : r.type === "Partnership";

  const rec: GivingRecord = {
    id: `g${Date.now()}`,
    ...r,
    status: r.status ?? "pending",
    rollupScope: isMinistryWide ? "ministry-wide" : "branch-only",
  };

  const current = getGiving();
  saveGiving([rec, ...current]);
  return rec;
}

export function approveGivingRecord(id: string) {
  const current = getGiving();
  const updated = current.map((r) =>
    r.id === id ? { ...r, status: "verified" as const, rejectionReason: null } : r
  );
  saveGiving(updated);

  // If this record is linked to a pledge, update the fulfilled amount
  const record = updated.find((r) => r.id === id);
  if (record?.pledgeId) {
    const pledges = getPledges();
    const pledge = pledges.find((p) => p.id === record.pledgeId);
    if (pledge) {
      // Sum all verified giving records linked to this pledge
      const totalFulfilled = updated
        .filter((r) => r.pledgeId === record.pledgeId && r.status === "verified")
        .reduce((s, r) => s + r.amount, 0);
      updatePledgeFulfilled(record.pledgeId, totalFulfilled);
    }
  }
}

export function rejectGivingRecord(id: string, reason?: string) {
  const current = getGiving();
  const updated = current.map((r) =>
    r.id === id
      ? { ...r, status: "rejected" as const, rejectionReason: reason ?? "Declined by administrator" }
      : r
  );
  saveGiving(updated);
}

export function deleteGiving(id: string) {
  const current = getGiving();
  saveGiving(current.filter((r) => r.id !== id));
}

export function subscribeGiving(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export const GIVING_TYPES: GivingType[] = ["Tithe", "Offering", "Project", "Partnership", "Seed"];

// ── Partnership Pledges ───────────────────────────────────────────────────────

export function getPledges(): PartnershipPledge[] {
  if (typeof window === "undefined") return INITIAL_PLEDGES;
  if (!cachedPledges) {
    initializeSeedData();
    const raw = localStorage.getItem(PLEDGES_KEY);
    if (!raw) {
      cachedPledges = INITIAL_PLEDGES;
    } else {
      try {
        cachedPledges = JSON.parse(raw);
      } catch {
        cachedPledges = INITIAL_PLEDGES;
      }
    }
  }
  return cachedPledges!;
}

export function savePledges(pledges: PartnershipPledge[]) {
  cachedPledges = pledges;
  if (typeof window !== "undefined") {
    localStorage.setItem(PLEDGES_KEY, JSON.stringify(pledges));
  }
  notify();
}

export function addPledge(p: Omit<PartnershipPledge, "id" | "fulfilledAmount" | "status">) {
  const pledge: PartnershipPledge = {
    id: `pl${Date.now()}`,
    ...p,
    fulfilledAmount: 0,
    status: "active",
  };
  const current = getPledges();
  savePledges([pledge, ...current]);
  return pledge;
}

export function updatePledgeFulfilled(id: string, fulfilledAmount: number) {
  const current = getPledges();
  const updated = current.map((p) => {
    if (p.id !== id) return p;
    const status = fulfilledAmount >= p.targetAmount ? "completed" : "active";
    return { ...p, fulfilledAmount, status } as PartnershipPledge;
  });
  savePledges(updated);
}

// ── Church Bank Details ───────────────────────────────────────────────────────

export function getBankDetails(branch: string): ChurchBankDetail | undefined {
  if (typeof window === "undefined") {
    return INITIAL_BANK_DETAILS.find((b) => b.branch === branch);
  }
  if (!cachedBankDetails) {
    initializeSeedData();
    const raw = localStorage.getItem(BANK_KEY);
    if (!raw) {
      cachedBankDetails = INITIAL_BANK_DETAILS;
    } else {
      try {
        cachedBankDetails = JSON.parse(raw);
      } catch {
        cachedBankDetails = INITIAL_BANK_DETAILS;
      }
    }
  }
  return cachedBankDetails!.find((b) => b.branch === branch);
}
