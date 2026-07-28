export type AdminRecord = {
  id: string;
  name: string;
  email: string;
  scope: string;
  invitedBy: string;
  status: "Active" | "Pending Invite";
  date: string;
};

let store: AdminRecord[] = [
  {
    id: "a1",
    name: "Pst. Daniel Okafor",
    email: "daniel@ministry.org",
    scope: "Global",
    invitedBy: "System",
    status: "Active",
    date: "2024-01-15",
  },
  {
    id: "a2",
    name: "Pst. Grace Adeyemi",
    email: "grace@ministry.org",
    scope: "West Africa",
    invitedBy: "Pst. Daniel Okafor",
    status: "Active",
    date: "2024-06-02",
  },
];

const listeners = new Set<() => void>();

export function getAdmins() {
  return store;
}

export function inviteAdmin(a: Omit<AdminRecord, "id" | "status" | "date">) {
  const rec: AdminRecord = {
    id: `a${Date.now()}`,
    status: "Pending Invite",
    date: new Date().toISOString().slice(0, 10),
    ...a,
  };
  store = [rec, ...store];
  listeners.forEach((l) => l());
  return rec;
}

export function removeAdmin(id: string) {
  store = store.filter((a) => a.id !== id);
  listeners.forEach((l) => l());
}

export function subscribeAdmins(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}
