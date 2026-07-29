import {
  Branch,
  Member,
  Soul,
  CellGroup,
  ChurchEvent,
  GivingRecord,
  GivingTypeConfig,
  SessionState,
  DEFAULT_MEMBER_STAGES,
} from "@/types/domain";

export const INITIAL_BRANCHES: Branch[] = [
  {
    id: "b1",
    name: "Lagos Central",
    country: "Nigeria",
    location: "Ikeja, Lagos",
    pastor: "Pst. Daniel Okafor",
    createdAt: "2022-01-10",
    status: "active",
    membersCount: 2340,
    leadersCount: 86,
    growth: 12.4,
    stages: [...DEFAULT_MEMBER_STAGES],
    milestones: [
      { id: "ms-b1-1", branchId: "b1", name: "Water Baptism", status: "active", suggestedStage: "Baptized Member" },
      { id: "ms-b1-2", branchId: "b1", name: "Foundation School Module 1", status: "active", suggestedStage: "Foundation School Student" },
      { id: "ms-b1-3", branchId: "b1", name: "Foundation School Graduation", status: "active", suggestedStage: "Foundation School Graduate" },
      { id: "ms-b1-4", branchId: "b1", name: "Evangelism Training", status: "active" },
      { id: "ms-b1-5", branchId: "b1", name: "School of Ministry", status: "active" },
    ],
  },
  {
    id: "b2",
    name: "Abuja Hub",
    country: "Nigeria",
    location: "Wuse 2, Abuja",
    pastor: "Pst. Grace Adeyemi",
    createdAt: "2022-03-15",
    status: "active",
    membersCount: 1870,
    leadersCount: 64,
    growth: 9.8,
    stages: [...DEFAULT_MEMBER_STAGES],
    milestones: [
      { id: "ms-b2-1", branchId: "b2", name: "Water Baptism", status: "active", suggestedStage: "Baptized Member" },
      { id: "ms-b2-2", branchId: "b2", name: "Foundation School Graduation", status: "active", suggestedStage: "Foundation School Graduate" },
      { id: "ms-b2-3", branchId: "b2", name: "Leadership Institute", status: "active" },
    ],
  },
  {
    id: "b3",
    name: "Accra Sanctuary",
    country: "Ghana",
    location: "Osu, Accra",
    pastor: "Pst. Kwame Mensah",
    createdAt: "2022-06-20",
    status: "active",
    membersCount: 1240,
    leadersCount: 42,
    growth: 14.2,
    stages: [...DEFAULT_MEMBER_STAGES],
    milestones: [
      { id: "ms-b3-1", branchId: "b3", name: "Water Baptism", status: "active", suggestedStage: "Baptized Member" },
      { id: "ms-b3-2", branchId: "b3", name: "Foundation School Graduation", status: "active", suggestedStage: "Foundation School Graduate" },
    ],
  },
  {
    id: "b4",
    name: "London Bridge",
    country: "United Kingdom",
    location: "Southwark, London",
    pastor: "Pst. Ruth Akande",
    createdAt: "2023-01-11",
    status: "active",
    membersCount: 980,
    leadersCount: 38,
    growth: 7.6,
    stages: [...DEFAULT_MEMBER_STAGES],
    milestones: [
      { id: "ms-b4-1", branchId: "b4", name: "Water Baptism", status: "active", suggestedStage: "Baptized Member" },
      { id: "ms-b4-2", branchId: "b4", name: "Foundation School Graduation", status: "active", suggestedStage: "Foundation School Graduate" },
    ],
  },
  {
    id: "b5",
    name: "Houston Citadel",
    country: "United States",
    location: "Houston, TX",
    pastor: "Pst. Michael Eze",
    createdAt: "2023-04-05",
    status: "active",
    membersCount: 1420,
    leadersCount: 51,
    growth: 11.1,
    stages: [...DEFAULT_MEMBER_STAGES],
    milestones: [
      { id: "ms-b5-1", branchId: "b5", name: "Water Baptism", status: "active", suggestedStage: "Baptized Member" },
      { id: "ms-b5-2", branchId: "b5", name: "Foundation School Graduation", status: "active", suggestedStage: "Foundation School Graduate" },
    ],
  },
];

export const INITIAL_GIVING_CONFIGS: GivingTypeConfig[] = [
  { type: "Tithe", isMinistryWideRollup: false },
  { type: "Offering", isMinistryWideRollup: false },
  { type: "Project", isMinistryWideRollup: false },
  { type: "Seed", isMinistryWideRollup: false },
  { type: "Partnership", isMinistryWideRollup: true }, // Partnership rolls up ministry-wide by default
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: "m1000",
    name: "Pst. Daniel Okafor",
    email: "daniel.okafor@christembassy.org",
    phone: "+234 803 123 4567",
    branch: "Lagos Central",
    role: "Pastor",
    stage: "Workforce Member",
    milestones: [
      { milestoneId: "ms-b1-1", completed: true, date: "2020-01-15" },
      { milestoneId: "ms-b1-3", completed: true, date: "2020-06-20" },
    ],
    mentor: "HQ Council",
    joinedAt: "2020-01-01T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=11",
    status: "active",
    attendance: 95,
  },
  {
    id: "m1001",
    name: "Esther Adebayo",
    email: "esther.adebayo@christembassy.org",
    phone: "+234 802 345 6789",
    branch: "Lagos Central",
    role: "Cell Leader",
    stage: "Workforce Member",
    milestones: [
      { milestoneId: "ms-b1-1", completed: true, date: "2022-03-10" },
      { milestoneId: "ms-b1-3", completed: true, date: "2022-08-15" },
    ],
    cell: "Cell A-1",
    mentor: "Pst. Daniel Okafor",
    joinedAt: "2022-02-01T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=25",
    status: "active",
    attendance: 88,
  },
  {
    id: "m1002",
    name: "Michael Bello",
    email: "michael.bello@christembassy.org",
    phone: "+234 805 987 6543",
    branch: "Abuja Hub",
    role: "Member",
    stage: "Regular Attendee",
    milestones: [
      { milestoneId: "ms-b2-1", completed: true, date: "2023-04-12" },
    ],
    cell: "Cell B-2",
    mentor: "Pst. Grace Adeyemi",
    joinedAt: "2023-01-15T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=33",
    status: "active",
    attendance: 74,
  },
  {
    id: "m1003",
    name: "Grace Mensah",
    email: "grace.mensah@christembassy.org",
    phone: "+233 24 123 4567",
    branch: "Accra Sanctuary",
    role: "Branch Admin",
    stage: "Workforce Member",
    milestones: [
      { milestoneId: "ms-b3-1", completed: true, date: "2022-07-10" },
    ],
    mentor: "Pst. Kwame Mensah",
    joinedAt: "2022-06-01T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=47",
    status: "active",
    attendance: 92,
  },
];

export const INITIAL_SOULS: Soul[] = [
  {
    id: "s1",
    name: "Tunde Adebola",
    phone: "+234 803 111 2233",
    email: "tunde@mail.com",
    location: "Lagos, Nigeria",
    stage: "Visited",
    status: "active",
    branch: "Lagos Central",
    invitedBy: "Grace Adeyemi",
    date: "2026-05-22",
    avatar: "https://i.pravatar.cc/200?img=13",
    mentor: "Pst. Daniel Okafor",
    badges: ["Born Again", "New Convert"],
    milestones: [
      {
        date: "2026-05-22",
        title: "First visit to church",
        detail: "Attended Sunday service for the first time",
        kind: "Moment",
      },
    ],
    prayers: [
      { id: "p1", date: "2026-05-26", text: "Stability in job & family salvation", status: "Active" },
    ],
    followUps: [
      { id: "f1", date: "2026-05-23", type: "Call", by: "Grace Adeyemi", notes: "Welcome call" },
    ],
    noteLog: [
      { id: "n1", date: "2026-05-22", by: "Grace Adeyemi", text: "Soft-hearted, hungry for the Word." },
    ],
    growth: { discipleship: 35, bibleStudy: 55, churchInvolvement: 40, followUpCompletion: 80 },
  },
  {
    id: "s2",
    name: "Ngozi Eze",
    phone: "+234 805 444 7788",
    location: "Abuja, Nigeria",
    stage: "Following Up",
    status: "active",
    branch: "Abuja Hub",
    invitedBy: "Daniel Okafor",
    date: "2026-05-18",
    avatar: "https://i.pravatar.cc/200?img=47",
    mentor: "Pst. Grace Adeyemi",
    badges: ["Born Again"],
    milestones: [
      { date: "2026-05-18", title: "Outreach contact", detail: "Street evangelism in Wuse", kind: "Moment" },
    ],
    prayers: [
      { id: "p1", date: "2026-05-25", text: "Grace to walk in new faith", status: "Active" },
    ],
    followUps: [
      { id: "f1", date: "2026-05-20", type: "Call", by: "Daniel Okafor", notes: "Checked in" },
    ],
    noteLog: [],
    growth: { discipleship: 20, bibleStudy: 30, churchInvolvement: 25, followUpCompletion: 65 },
  },
];

export const INITIAL_CELLS: CellGroup[] = [
  {
    id: "c1",
    name: "Cell A-1",
    branch: "Lagos Central",
    leader: "Esther Adebayo",
    leaderId: "m1001",
    members: ["m1001"],
    status: "active",
    attendance: 85,
    growth: 12,
  },
  {
    id: "c2",
    name: "Cell B-2",
    branch: "Abuja Hub",
    leader: "Michael Bello",
    leaderId: "m1002",
    members: ["m1002"],
    status: "active",
    attendance: 72,
    growth: 8,
  },
];

export const INITIAL_EVENTS: ChurchEvent[] = [
  {
    id: "e1",
    name: "Global Healing Streams",
    date: "2026-06-12",
    type: "Crusade",
    scope: "global",
    branch: null,
    attendees: 42000,
    capacity: 100000,
    registeredMemberIds: ["m1000", "m1001"],
    description: "Global miracle and healing crusade with Pastor Chris.",
  },
  {
    id: "e2",
    name: "Lagos Youth Night",
    date: "2026-05-29",
    type: "Service",
    scope: "branch",
    branch: "Lagos Central",
    attendees: 450,
    capacity: 600,
    registeredMemberIds: ["m1001"],
    description: "Ebute Youth Impact Night.",
  },
];

export const INITIAL_GIVING: GivingRecord[] = [
  {
    id: "g1",
    date: "2026-05-17",
    type: "Tithe",
    source: "Sunday Service",
    amount: 18420,
    branch: "Lagos Central",
    memberId: "m1000",
  },
  {
    id: "g2",
    date: "2026-05-17",
    type: "Partnership",
    source: "Global Rhapsody Partner",
    amount: 25000,
    branch: "Lagos Central",
    memberId: "m1001",
    rollupScope: "ministry-wide",
  },
  {
    id: "g3",
    date: "2026-05-14",
    type: "Offering",
    source: "Midweek Service",
    amount: 3400,
    branch: "Abuja Hub",
    giverNameIfAnonymous: "Anonymous Attendee",
  },
];

export const INITIAL_SESSION: SessionState = {
  memberId: "m1000",
  role: "Admin",
  branch: "Lagos Central",
};

export function initializeSeedData() {
  if (typeof window === "undefined") return;

  if (!localStorage.getItem("soultracer:branches")) {
    localStorage.setItem("soultracer:branches", JSON.stringify(INITIAL_BRANCHES));
  }
  if (!localStorage.getItem("soultracer:giving_configs")) {
    localStorage.setItem("soultracer:giving_configs", JSON.stringify(INITIAL_GIVING_CONFIGS));
  }
  if (!localStorage.getItem("soultracer:members")) {
    localStorage.setItem("soultracer:members", JSON.stringify(INITIAL_MEMBERS));
  }
  if (!localStorage.getItem("soultracer:souls")) {
    localStorage.setItem("soultracer:souls", JSON.stringify(INITIAL_SOULS));
  }
  if (!localStorage.getItem("soultracer:cells")) {
    localStorage.setItem("soultracer:cells", JSON.stringify(INITIAL_CELLS));
  }
  if (!localStorage.getItem("soultracer:events")) {
    localStorage.setItem("soultracer:events", JSON.stringify(INITIAL_EVENTS));
  }
  if (!localStorage.getItem("soultracer:giving")) {
    localStorage.setItem("soultracer:giving", JSON.stringify(INITIAL_GIVING));
  }
  if (!localStorage.getItem("soultracer:currentSession")) {
    localStorage.setItem("soultracer:currentSession", JSON.stringify(INITIAL_SESSION));
  }
}
