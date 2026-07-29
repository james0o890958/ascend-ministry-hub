import { CellGroup } from "@/types/domain";
import { INITIAL_CELLS, initializeSeedData } from "./seed-data";

const KEY = "soultracer:cells";
const listeners = new Set<() => void>();
let cachedCells: CellGroup[] | null = null;

function notify() {
  listeners.forEach((l) => l());
}

export function getCells(): CellGroup[] {
  if (typeof window === "undefined") return INITIAL_CELLS;
  if (!cachedCells) {
    initializeSeedData();
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      cachedCells = INITIAL_CELLS;
    } else {
      try {
        cachedCells = JSON.parse(raw);
      } catch {
        cachedCells = INITIAL_CELLS;
      }
    }
  }
  return cachedCells!;
}

export function getCellById(id: string): CellGroup | undefined {
  return getCells().find((c) => c.id === id);
}

export function saveCells(cells: CellGroup[]) {
  cachedCells = cells;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(cells));
  }
  notify();
}

export function addCell(cell: CellGroup) {
  const current = getCells();
  saveCells([cell, ...current]);
}

export function updateCell(id: string, patch: Partial<CellGroup>) {
  const current = getCells();
  const updated = current.map((c) => (c.id === id ? { ...c, ...patch } : c));
  saveCells(updated);
}

export function archiveCell(id: string) {
  updateCell(id, { status: "archived" });
}

export function subscribeCells(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
