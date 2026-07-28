import { members as seedMembers, type Member } from "@/lib/data";

let membersList: Member[] = [...seedMembers];
const listeners = new Set<() => void>();

export function getMembers(): Member[] {
  return membersList;
}

export function getMemberById(id: string): Member | undefined {
  return membersList.find((m) => m.id === id);
}

export function addMember(member: Member) {
  membersList = [member, ...membersList];
  listeners.forEach((fn) => fn());
}

export function importMembers(newMembers: Member[]) {
  membersList = [...newMembers, ...membersList];
  listeners.forEach((fn) => fn());
}

export function updateMember(id: string, patch: Partial<Member>) {
  membersList = membersList.map((m) => (m.id === id ? { ...m, ...patch } : m));
  listeners.forEach((fn) => fn());
}

export function subscribeMembers(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
