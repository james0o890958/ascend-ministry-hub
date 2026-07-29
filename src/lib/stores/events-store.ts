import { ChurchEvent } from "@/types/domain";
import { INITIAL_EVENTS, initializeSeedData } from "./seed-data";

const KEY = "soultracer:events";
const listeners = new Set<() => void>();
let cachedEvents: ChurchEvent[] | null = null;

function notify() {
  listeners.forEach((l) => l());
}

export function getEvents(): ChurchEvent[] {
  if (typeof window === "undefined") return INITIAL_EVENTS;
  if (!cachedEvents) {
    initializeSeedData();
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      cachedEvents = INITIAL_EVENTS;
    } else {
      try {
        cachedEvents = JSON.parse(raw);
      } catch {
        cachedEvents = INITIAL_EVENTS;
      }
    }
  }
  return cachedEvents!;
}

export function getEventById(id: string): ChurchEvent | undefined {
  return getEvents().find((e) => e.id === id);
}

export function getVisibleEventsForMember(memberBranch: string): ChurchEvent[] {
  return getEvents().filter(
    (e) => e.scope === "global" || e.branch === memberBranch
  );
}

export function saveEvents(events: ChurchEvent[]) {
  cachedEvents = events;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(events));
  }
  notify();
}

export function addEvent(event: ChurchEvent) {
  const current = getEvents();
  saveEvents([event, ...current]);
}

export function updateEvent(id: string, patch: Partial<ChurchEvent>) {
  const current = getEvents();
  const updated = current.map((e) => (e.id === id ? { ...e, ...patch } : e));
  saveEvents(updated);
}

export function registerForEvent(eventId: string, memberId: string) {
  const event = getEventById(eventId);
  if (!event) return;
  const currentRegistered = event.registeredMemberIds || [];
  if (currentRegistered.includes(memberId)) return;

  const updatedRegistered = [...currentRegistered, memberId];
  updateEvent(eventId, {
    registeredMemberIds: updatedRegistered,
    attendees: (event.attendees || 0) + 1,
  });
}

export function subscribeEvents(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
