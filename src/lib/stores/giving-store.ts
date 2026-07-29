import { GivingRecord, GivingTypeConfig, GivingType } from "@/types/domain";
export type { GivingType };
import { INITIAL_GIVING, INITIAL_GIVING_CONFIGS, initializeSeedData } from "./seed-data";

const GIVING_KEY = "soultracer:giving";
const CONFIGS_KEY = "soultracer:giving_configs";

const listeners = new Set<() => void>();
let cachedGiving: GivingRecord[] | null = null;
let cachedConfigs: GivingTypeConfig[] | null = null;

function notify() {
  listeners.forEach((l) => l());
}

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
    rollupScope: isMinistryWide ? "ministry-wide" : "branch-only",
  };

  const current = getGiving();
  saveGiving([rec, ...current]);
  return rec;
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
