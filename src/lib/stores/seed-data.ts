import {
  Branch,
  Member,
  Soul,
  CellGroup,
  ChurchEvent,
  GivingRecord,
  GivingTypeConfig,
  PartnershipPledge,
  ChurchBankDetail,
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
      {
        id: "ms-b1-1",
        branchId: "b1",
        name: "Water Baptism",
        status: "active",
        suggestedStage: "Baptized Member",
      },
      {
        id: "ms-b1-2",
        branchId: "b1",
        name: "Foundation School Module 1",
        status: "active",
        suggestedStage: "Foundation School Student",
      },
      {
        id: "ms-b1-3",
        branchId: "b1",
        name: "Foundation School Graduation",
        status: "active",
        suggestedStage: "Foundation School Graduate",
      },
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
      {
        id: "ms-b2-1",
        branchId: "b2",
        name: "Water Baptism",
        status: "active",
        suggestedStage: "Baptized Member",
      },
      {
        id: "ms-b2-2",
        branchId: "b2",
        name: "Foundation School Graduation",
        status: "active",
        suggestedStage: "Foundation School Graduate",
      },
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
      {
        id: "ms-b3-1",
        branchId: "b3",
        name: "Water Baptism",
        status: "active",
        suggestedStage: "Baptized Member",
      },
      {
        id: "ms-b3-2",
        branchId: "b3",
        name: "Foundation School Graduation",
        status: "active",
        suggestedStage: "Foundation School Graduate",
      },
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
      {
        id: "ms-b4-1",
        branchId: "b4",
        name: "Water Baptism",
        status: "active",
        suggestedStage: "Baptized Member",
      },
      {
        id: "ms-b4-2",
        branchId: "b4",
        name: "Foundation School Graduation",
        status: "active",
        suggestedStage: "Foundation School Graduate",
      },
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
      {
        id: "ms-b5-1",
        branchId: "b5",
        name: "Water Baptism",
        status: "active",
        suggestedStage: "Baptized Member",
      },
      {
        id: "ms-b5-2",
        branchId: "b5",
        name: "Foundation School Graduation",
        status: "active",
        suggestedStage: "Foundation School Graduate",
      },
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
    soulTracerId: "ST-M-2020-1000",
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
    originType: "direct",
    attendance: 95,
  },
  {
    id: "m1001",
    soulTracerId: "ST-M-2022-1001",
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
    originType: "direct",
    attendance: 88,
  },
  {
    id: "m1002",
    soulTracerId: "ST-M-2023-1002",
    name: "Michael Bello",
    email: "michael.bello@christembassy.org",
    phone: "+234 805 987 6543",
    branch: "Abuja Hub",
    role: "Member",
    stage: "Regular Attendee",
    milestones: [{ milestoneId: "ms-b2-1", completed: true, date: "2023-04-12" }],
    cell: "Cell B-2",
    mentor: "Pst. Grace Adeyemi",
    joinedAt: "2023-01-15T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=33",
    status: "active",
    originType: "transfer",
    originBranch: "Lagos Central",
    attendance: 75,
  },
  {
    id: "m1003",
    name: "Grace Mensah",
    email: "grace.mensah@christembassy.org",
    phone: "+233 24 123 4567",
    branch: "Accra Sanctuary",
    role: "Branch Admin",
    stage: "Workforce Member",
    milestones: [{ milestoneId: "ms-b3-1", completed: true, date: "2022-07-10" }],
    mentor: "Pst. Kwame Mensah",
    joinedAt: "2022-06-01T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=47",
    status: "active",
    attendance: 92,
  },
  {
    id: "m1004",
    soulTracerId: "ST-M-2024-1004",
    name: "David Adeleke",
    email: "david.adeleke@christembassy.org",
    phone: "+234 801 234 5678",
    branch: "Lagos Central",
    role: "Member",
    stage: "Regular Attendee",
    milestones: [{ milestoneId: "ms-b1-1", completed: true, date: "2024-01-10" }],
    cell: "Cell A-1",
    mentor: "Esther Adebayo",
    joinedAt: "2024-01-05T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=12",
    status: "active",
    attendance: 82,
  },
  {
    id: "m1005",
    soulTracerId: "ST-M-2023-1005",
    name: "Chioma Nnamdi",
    email: "chioma.nnamdi@christembassy.org",
    phone: "+234 809 876 5432",
    branch: "Lagos Central",
    role: "PCF Leader",
    stage: "Workforce Member",
    milestones: [
      { milestoneId: "ms-b1-1", completed: true, date: "2021-02-14" },
      { milestoneId: "ms-b1-3", completed: true, date: "2021-07-20" },
    ],
    mentor: "Pst. Daniel Okafor",
    joinedAt: "2021-01-15T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=32",
    status: "active",
    attendance: 94,
  },
  {
    id: "m1006",
    soulTracerId: "ST-M-2022-1006",
    name: "Victoria Johnson",
    email: "victoria.johnson@christembassy.org",
    phone: "+234 807 654 3210",
    branch: "Lagos Central",
    role: "Branch Admin",
    stage: "Workforce Member",
    milestones: [
      { milestoneId: "ms-b1-1", completed: true, date: "2022-01-10" },
      { milestoneId: "ms-b1-3", completed: true, date: "2022-05-18" },
    ],
    mentor: "Pst. Daniel Okafor",
    joinedAt: "2022-01-01T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=44",
    status: "active",
    attendance: 96,
  },
  {
    id: "m1007",
    soulTracerId: "ST-M-2020-1007",
    name: "Super Admin User",
    email: "admin@christembassy.org",
    phone: "+234 800 000 0000",
    branch: "Lagos Central",
    role: "Admin",
    stage: "Workforce Member",
    milestones: [
      { milestoneId: "ms-b1-1", completed: true, date: "2020-01-01" },
      { milestoneId: "ms-b1-3", completed: true, date: "2020-04-01" },
    ],
    mentor: "Global Council",
    joinedAt: "2020-01-01T00:00:00.000Z",
    avatar: "https://i.pravatar.cc/120?img=60",
    status: "active",
    attendance: 99,
  },
];

export const INITIAL_SOULS: Soul[] = [
  {
    id: "s1",
    soulTracerId: "ST-S-2026-0001",
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
      {
        id: "p1",
        date: "2026-05-26",
        text: "Stability in job & family salvation",
        status: "Active",
      },
    ],
    followUps: [
      {
        id: "f1",
        date: "2026-05-23",
        type: "Call",
        by: "Grace Adeyemi",
        notes: "Welcome call",
        status: "completed",
      },
    ],
    noteLog: [
      {
        id: "n1",
        date: "2026-05-22",
        by: "Grace Adeyemi",
        text: "Soft-hearted, hungry for the Word.",
      },
    ],
    growth: { discipleship: 35, bibleStudy: 55, churchInvolvement: 40, followUpCompletion: 100 },
  },
  {
    id: "s2",
    soulTracerId: "ST-S-2026-0002",
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
      {
        date: "2026-05-18",
        title: "Outreach contact",
        detail: "Street evangelism in Wuse",
        kind: "Moment",
      },
    ],
    prayers: [
      { id: "p1", date: "2026-05-25", text: "Grace to walk in new faith", status: "Active" },
    ],
    followUps: [
      {
        id: "f1",
        date: "2026-05-20",
        type: "Call",
        by: "Daniel Okafor",
        notes: "Checked in",
        status: "completed",
      },
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

export const INITIAL_BANK_DETAILS: ChurchBankDetail[] = [
  {
    branch: "Lagos Central",
    bankName: "Parallex Bank",
    accountNumber: "1020304050",
    accountName: "Christ Embassy Lagos Central",
  },
  {
    branch: "Abuja Hub",
    bankName: "Zenith Bank",
    accountNumber: "2030405060",
    accountName: "Christ Embassy Abuja Hub",
  },
  {
    branch: "Accra Sanctuary",
    bankName: "GCB Bank",
    accountNumber: "3040506070",
    accountName: "Christ Embassy Accra Sanctuary",
  },
];

export const INITIAL_PLEDGES: PartnershipPledge[] = [
  {
    id: "pl1",
    memberId: "m1001",
    memberName: "Esther Adebayo",
    branch: "Lagos Central",
    title: "Rhapsody of Realities Partnership 2026",
    targetAmount: 100000,
    fulfilledAmount: 75000,
    status: "active",
    createdAt: "2026-01-15",
  },
  {
    id: "pl2",
    memberId: "m1004",
    memberName: "David Adeleke",
    branch: "Lagos Central",
    title: "Lagos Central Building Project",
    targetAmount: 50000,
    fulfilledAmount: 20000,
    status: "active",
    createdAt: "2026-02-10",
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
    status: "verified",
    paymentChannel: "Bank Transfer",
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
    status: "verified",
    paymentChannel: "Bank Transfer",
    pledgeId: "pl1",
  },
  {
    id: "g3",
    date: "2026-05-14",
    type: "Offering",
    source: "Midweek Service",
    amount: 3400,
    branch: "Abuja Hub",
    giverNameIfAnonymous: "Anonymous Attendee",
    status: "verified",
    paymentChannel: "Cash",
  },
  {
    id: "g4",
    date: "2026-05-20",
    type: "Partnership",
    source: "Rhapsody Partnership",
    amount: 25000,
    branch: "Lagos Central",
    memberId: "m1004",
    status: "pending",
    paymentChannel: "Bank Transfer",
    receiptRef: "TRX-98234105",
    pledgeId: "pl2",
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
  if (!localStorage.getItem("soultracer:pledges")) {
    localStorage.setItem("soultracer:pledges", JSON.stringify(INITIAL_PLEDGES));
  }
  if (!localStorage.getItem("soultracer:bank_details")) {
    localStorage.setItem("soultracer:bank_details", JSON.stringify(INITIAL_BANK_DETAILS));
  }
  if (!localStorage.getItem("soultracer:currentSession")) {
    localStorage.setItem("soultracer:currentSession", JSON.stringify(INITIAL_SESSION));
  }
}
