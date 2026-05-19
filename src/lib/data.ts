// Realistic dummy data for the ministry tracking platform

export const stats = {
  totalMembers: 12480,
  firstTimers: 342,
  baptized: 8920,
  foundationStudents: 1240,
  cellMembers: 9870,
  leaders: 624,
  pastors: 48,
  branches: 36,
};

export const STAGES = [
  "Invitee",
  "First Timer",
  "Regular Attendee",
  "Baptized Member",
  "Foundation School Student",
  "Foundation School Graduate",
  "Cell Member",
  "Workforce Member",
  "Leader",
  "Pastor",
] as const;

export type Stage = (typeof STAGES)[number];

export const branches = [
  { id: "b1", name: "Lagos Central", country: "Nigeria", members: 2340, leaders: 86, pastor: "Pst. Daniel Okafor", growth: 12.4 },
  { id: "b2", name: "Abuja Hub", country: "Nigeria", members: 1870, leaders: 64, pastor: "Pst. Grace Adeyemi", growth: 9.8 },
  { id: "b3", name: "Accra Sanctuary", country: "Ghana", members: 1240, leaders: 42, pastor: "Pst. Kwame Mensah", growth: 14.2 },
  { id: "b4", name: "London Bridge", country: "United Kingdom", members: 980, leaders: 38, pastor: "Pst. Ruth Akande", growth: 7.6 },
  { id: "b5", name: "Houston Citadel", country: "United States", members: 1420, leaders: 51, pastor: "Pst. Michael Eze", growth: 11.1 },
  { id: "b6", name: "Johannesburg", country: "South Africa", members: 860, leaders: 29, pastor: "Pst. Thando Dlamini", growth: 8.9 },
  { id: "b7", name: "Nairobi Light", country: "Kenya", members: 1120, leaders: 36, pastor: "Pst. Faith Wanjiru", growth: 15.6 },
  { id: "b8", name: "Toronto North", country: "Canada", members: 690, leaders: 22, pastor: "Pst. Samuel Idowu", growth: 6.3 },
];

const firstNames = ["Daniel","Grace","Michael","Esther","Joshua","Ruth","David","Sarah","Emmanuel","Mercy","Peter","Hannah","John","Deborah","Paul","Faith","Samuel","Joy","Caleb","Naomi"];
const lastNames = ["Okafor","Adeyemi","Mensah","Akande","Eze","Dlamini","Wanjiru","Idowu","Adebayo","Nwosu","Bello","Olawale","Chukwu","Obi","Afolabi","Balogun","Ibrahim","Okonkwo","Lawal","Salami"];

function pick<T>(arr: readonly T[], i: number): T { return arr[i % arr.length]; }

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  stage: Stage;
  joinedAt: string;
  mentor: string;
  attendance: number; // %
  cell: string;
  avatar: string;
  status: "active" | "inactive";
};

export const members: Member[] = Array.from({ length: 28 }).map((_, i) => {
  const first = pick(firstNames, i * 3 + 1);
  const last = pick(lastNames, i * 7 + 2);
  const stage = STAGES[(i * 5) % STAGES.length];
  const branch = branches[i % branches.length].name;
  return {
    id: `m${1000 + i}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@ministry.org`,
    phone: `+234 80${String(1000000 + i * 137).slice(0, 7)}`,
    branch,
    stage,
    joinedAt: new Date(2022, (i * 2) % 12, ((i * 5) % 27) + 1).toISOString(),
    mentor: `${pick(firstNames, i + 4)} ${pick(lastNames, i + 9)}`,
    attendance: 60 + ((i * 13) % 40),
    cell: `Cell ${String.fromCharCode(65 + (i % 12))}-${(i % 6) + 1}`,
    avatar: `https://i.pravatar.cc/120?img=${(i % 70) + 1}`,
    status: i % 11 === 0 ? "inactive" : "active",
  };
});

export const attendanceWeekly = [
  { week: "W1", sunday: 8240, midweek: 4120, cell: 5860 },
  { week: "W2", sunday: 8520, midweek: 4380, cell: 6020 },
  { week: "W3", sunday: 8890, midweek: 4510, cell: 6240 },
  { week: "W4", sunday: 9120, midweek: 4690, cell: 6480 },
  { week: "W5", sunday: 9380, midweek: 4820, cell: 6710 },
  { week: "W6", sunday: 9640, midweek: 5020, cell: 6920 },
  { week: "W7", sunday: 9920, midweek: 5180, cell: 7180 },
  { week: "W8", sunday: 10240, midweek: 5340, cell: 7420 },
];

export const stageDistribution = [
  { stage: "Invitee", count: 420 },
  { stage: "First Timer", count: 342 },
  { stage: "Regular", count: 1860 },
  { stage: "Baptized", count: 8920 },
  { stage: "Foundation", count: 1240 },
  { stage: "Cell", count: 9870 },
  { stage: "Workforce", count: 1840 },
  { stage: "Leader", count: 624 },
  { stage: "Pastor", count: 48 },
];

export const growthMonthly = [
  { month: "Jan", members: 9800, baptisms: 120 },
  { month: "Feb", members: 10120, baptisms: 145 },
  { month: "Mar", members: 10480, baptisms: 168 },
  { month: "Apr", members: 10820, baptisms: 192 },
  { month: "May", members: 11240, baptisms: 210 },
  { month: "Jun", members: 11580, baptisms: 224 },
  { month: "Jul", members: 11920, baptisms: 248 },
  { month: "Aug", members: 12240, baptisms: 271 },
  { month: "Sep", members: 12480, baptisms: 296 },
];

export const cellGroups = Array.from({ length: 10 }).map((_, i) => ({
  id: `c${i + 1}`,
  name: `Cell ${String.fromCharCode(65 + i)}-${(i % 4) + 1}`,
  leader: `${pick(firstNames, i + 2)} ${pick(lastNames, i + 5)}`,
  branch: branches[i % branches.length].name,
  members: 12 + ((i * 7) % 30),
  attendance: 70 + ((i * 11) % 28),
  growth: ((i * 3) % 18) - 4,
}));

export const recentActivity = [
  { id: 1, type: "baptism", who: "Esther Adebayo", when: "2h ago", branch: "Lagos Central" },
  { id: 2, type: "first-timer", who: "Michael Bello", when: "3h ago", branch: "Abuja Hub" },
  { id: 3, type: "foundation", who: "Grace Mensah", when: "5h ago", branch: "Accra Sanctuary" },
  { id: 4, type: "leader", who: "Daniel Okafor", when: "1d ago", branch: "Houston Citadel" },
  { id: 5, type: "cell-join", who: "Ruth Wanjiru", when: "1d ago", branch: "Nairobi Light" },
  { id: 6, type: "ordination", who: "Pst. Samuel Idowu", when: "2d ago", branch: "Toronto North" },
  { id: 7, type: "first-timer", who: "Joy Salami", when: "2d ago", branch: "London Bridge" },
];

export const notifications = [
  { id: 1, title: "12 first-timers this Sunday", desc: "Lagos Central recorded a new high", time: "10m" },
  { id: 2, title: "Foundation School graduation", desc: "84 students ready for cell placement", time: "1h" },
  { id: 3, title: "Cell B-2 attendance dropped", desc: "Below 70% for 2 weeks", time: "3h" },
  { id: 4, title: "Ordination ceremony scheduled", desc: "Dec 14 — 6 candidates", time: "1d" },
];

// === Events ===
export type ChurchEvent = {
  id: string;
  name: string;
  date: string;
  type: "Service" | "Midweek" | "Cell" | "Crusade" | "Training";
  branch: string;
  attendees: number;
  capacity: number;
};

export const events: ChurchEvent[] = [
  { id: "e1", name: "Sunday Service", date: "2026-05-17", type: "Service", branch: "Lagos Central", attendees: 2120, capacity: 2500 },
  { id: "e2", name: "Midweek Bible Study", date: "2026-05-14", type: "Midweek", branch: "Lagos Central", attendees: 980, capacity: 1500 },
  { id: "e3", name: "Cell B-2 Meeting", date: "2026-05-16", type: "Cell", branch: "Abuja Hub", attendees: 22, capacity: 30 },
  { id: "e4", name: "Healing Crusade", date: "2026-05-22", type: "Crusade", branch: "Accra Sanctuary", attendees: 0, capacity: 5000 },
  { id: "e5", name: "Foundation Class — Module 3", date: "2026-05-19", type: "Training", branch: "Houston Citadel", attendees: 84, capacity: 120 },
  { id: "e6", name: "Sunday Service", date: "2026-05-10", type: "Service", branch: "Abuja Hub", attendees: 1640, capacity: 1800 },
  { id: "e7", name: "Cell A-1 Meeting", date: "2026-05-15", type: "Cell", branch: "Lagos Central", attendees: 18, capacity: 25 },
];

export type LeaderRequest = {
  id: string;
  candidate: string;
  proposedRole: "Cell Leader" | "Worker" | "Department Head" | "Pastor";
  scope: string;
  proposedBy: string;
  date: string;
  status: "pending" | "approved" | "denied";
};

export const leaderRequests: LeaderRequest[] = [
  { id: "lr1", candidate: "Esther Adebayo", proposedRole: "Cell Leader", scope: "Cell A-1 • Lagos Central", proposedBy: "Pst. D. Okafor", date: "2026-05-12", status: "pending" },
  { id: "lr2", candidate: "Michael Bello", proposedRole: "Worker", scope: "Ushering • Abuja Hub", proposedBy: "Pst. G. Adeyemi", date: "2026-05-11", status: "pending" },
  { id: "lr3", candidate: "Grace Mensah", proposedRole: "Department Head", scope: "Choir • Accra Sanctuary", proposedBy: "Pst. K. Mensah", date: "2026-05-09", status: "pending" },
  { id: "lr4", candidate: "Samuel Idowu", proposedRole: "Pastor", scope: "Toronto North", proposedBy: "HQ Council", date: "2026-05-05", status: "pending" },
];

export type Invitee = {
  id: string;
  name: string;
  event: string;
  invitedBy: string;
  status: "Pending" | "Attended" | "Declined";
  date: string;
};

export const invitees: Invitee[] = [
  { id: "i1", name: "Joy Salami", event: "Sunday Service", invitedBy: "m1000", status: "Attended", date: "2026-05-10" },
  { id: "i2", name: "Caleb Obi", event: "Healing Crusade", invitedBy: "m1000", status: "Pending", date: "2026-05-22" },
  { id: "i3", name: "Naomi Lawal", event: "Cell A-1 Meeting", invitedBy: "m1000", status: "Pending", date: "2026-05-15" },
  { id: "i4", name: "Peter Bello", event: "Sunday Service", invitedBy: "m1000", status: "Declined", date: "2026-05-03" },
];

export type JourneyEvent = {
  date: string;
  kind: "Event Attended" | "Role Held" | "Group Joined" | "Stage";
  label: string;
  detail: string;
};

export function memberJourney(memberId: string): JourneyEvent[] {
  const seed = memberId.charCodeAt(memberId.length - 1);
  return [
    { date: "2024-02-04", kind: "Event Attended", label: "First Timers' Sunday", detail: "Lagos Central" },
    { date: "2024-03-10", kind: "Group Joined", label: "Cell A-1", detail: "Leader: Esther Adebayo" },
    { date: "2024-05-12", kind: "Stage", label: "Baptized Member", detail: "Pastor: D. Okafor" },
    { date: "2024-08-20", kind: "Event Attended", label: "Foundation Module 1", detail: "Completed" },
    { date: "2024-11-02", kind: "Role Held", label: "Ushering Volunteer", detail: "Department: Ushering" },
    { date: "2025-03-15", kind: "Stage", label: "Foundation Graduate", detail: "Cohort: Spring" },
    { date: "2025-09-07", kind: "Role Held", label: seed % 2 ? "Cell Assistant" : "Worker", detail: "Promoted" },
  ];
}

export function attendanceForDate(date: string) {
  const seed = date.split("-").reduce((s, p) => s + parseInt(p, 10), 0);
  return members.filter((_, i) => (i + seed) % 3 !== 0).map((m) => m.id);
}

export const myLedCells = ["c1", "c4", "c7"];
