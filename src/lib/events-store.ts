import { events as seed, type ChurchEvent } from "./data";

let store: ChurchEvent[] = [...seed];
const listeners = new Set<() => void>();

export function getEvents() {
  return store;
}

export function getEventById(id: string) {
  return store.find((e) => e.id === id);
}

export function addEvent(e: Omit<ChurchEvent, "id" | "attendees"> & { attendees?: number }) {
  const rec: ChurchEvent = {
    id: `e${Date.now()}`,
    attendees: e.attendees ?? 0,
    ...e,
  };
  store = [rec, ...store];
  listeners.forEach((l) => l());
  return rec;
}

export function subscribeEvents(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
