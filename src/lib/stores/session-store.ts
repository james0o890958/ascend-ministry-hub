import { SessionState, Role } from "@/types/domain";
import { INITIAL_SESSION, initializeSeedData } from "./seed-data";

const KEY = "soultracer:currentSession";
const listeners = new Set<() => void>();
let cachedSession: SessionState | null = null;

function notify() {
  listeners.forEach((l) => l());
}

export function getSession(): SessionState {
  if (typeof window === "undefined") return INITIAL_SESSION;
  if (!cachedSession) {
    initializeSeedData();
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      cachedSession = INITIAL_SESSION;
    } else {
      try {
        cachedSession = JSON.parse(raw);
      } catch {
        cachedSession = INITIAL_SESSION;
      }
    }
  }
  return cachedSession!;
}

export function setSessionRole(role: Role) {
  const current = getSession();
  cachedSession = { ...current, role };
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(cachedSession));
  }
  notify();
}

export function setSessionBranch(branch: string) {
  const current = getSession();
  cachedSession = { ...current, branch };
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(cachedSession));
  }
  notify();
}

export function setSession(session: SessionState) {
  cachedSession = session;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(session));
  }
  notify();
}

export function subscribeSession(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
