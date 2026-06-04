export type SoulStage = "Contacted" | "Visited" | "Following Up" | "Converted" | "Discipled";

export type SoulBadge = "Born Again" | "Baptized" | "Spirit Filled" | "New Convert" | "Faithful Attender" | "Tithing";

export type SoulMilestone = {
  date: string;
  title: string;
  detail: string;
  kind: "Salvation" | "Baptism" | "Discipleship" | "Ministry" | "Moment";
};

export type SoulPrayer = {
  id: string;
  date: string;
  text: string;
  status: "Active" | "Answered";
};

export type SoulFollowUp = {
  id: string;
  date: string;
  type: "Call" | "Visit" | "Meeting" | "Message";
  by: string;
  notes: string;
};

export type SoulNote = {
  id: string;
  date: string;
  by: string;
  text: string;
};

export type Soul = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  stage: SoulStage;
  invitedBy: string;
  date: string;
  notes?: string;
  avatar?: string;
  mentor: string;
  badges: SoulBadge[];
  milestones: SoulMilestone[];
  prayers: SoulPrayer[];
  followUps: SoulFollowUp[];
  noteLog: SoulNote[];
  growth: {
    discipleship: number;
    bibleStudy: number;
    churchInvolvement: number;
    followUpCompletion: number;
  };
};

export const souls: Soul[] = [
  {
    id: "s1",
    name: "Tunde Adebola",
    phone: "+234 803 111 2233",
    email: "tunde@mail.com",
    location: "Lagos, Nigeria",
    stage: "Visited",
    invitedBy: "Grace Adeyemi",
    date: "2026-05-22",
    avatar: "https://i.pravatar.cc/200?img=13",
    mentor: "Pst. Daniel Okafor",
    badges: ["Born Again", "New Convert"],
    milestones: [
      { date: "2026-05-22", title: "First visit to church", detail: "Attended Sunday service for the first time", kind: "Moment" },
      { date: "2026-05-26", title: "Received salvation", detail: "Made decision for Christ during altar call", kind: "Salvation" },
      { date: "2026-06-04", title: "Joined Foundation School", detail: "Module 1 — New beginnings", kind: "Discipleship" },
    ],
    prayers: [
      { id: "p1", date: "2026-05-26", text: "Stability in his new job and family salvation", status: "Active" },
      { id: "p2", date: "2026-05-22", text: "Open heart to receive the gospel", status: "Answered" },
    ],
    followUps: [
      { id: "f1", date: "2026-05-23", type: "Call", by: "Grace Adeyemi", notes: "Welcome call, sent service link" },
      { id: "f2", date: "2026-05-27", type: "Visit", by: "Pst. Daniel", notes: "Home visit, prayed with the family" },
      { id: "f3", date: "2026-06-02", type: "Message", by: "Care Team", notes: "Sent weekly devotional" },
    ],
    noteLog: [
      { id: "n1", date: "2026-05-22", by: "Grace Adeyemi", text: "Soft-hearted, hungry for the Word. Lost his father recently." },
      { id: "n2", date: "2026-05-30", by: "Pst. Daniel", text: "Showing consistency, ready for discipleship." },
    ],
    growth: { discipleship: 35, bibleStudy: 55, churchInvolvement: 40, followUpCompletion: 80 },
  },
  {
    id: "s2",
    name: "Ngozi Eze",
    phone: "+234 805 444 7788",
    location: "Abuja, Nigeria",
    stage: "Following Up",
    invitedBy: "Daniel Okafor",
    date: "2026-05-18",
    avatar: "https://i.pravatar.cc/200?img=47",
    mentor: "Pst. Grace Adeyemi",
    badges: ["Born Again"],
    milestones: [
      { date: "2026-05-18", title: "Contacted via outreach", detail: "Street evangelism in Wuse", kind: "Moment" },
      { date: "2026-05-25", title: "Salvation prayer", detail: "Prayed the sinner's prayer", kind: "Salvation" },
    ],
    prayers: [{ id: "p1", date: "2026-05-25", text: "Grace to walk in her new faith", status: "Active" }],
    followUps: [
      { id: "f1", date: "2026-05-20", type: "Call", by: "Daniel Okafor", notes: "Checked in, invited to service" },
      { id: "f2", date: "2026-05-28", type: "Meeting", by: "Care Team", notes: "Coffee meet, discussed next steps" },
    ],
    noteLog: [{ id: "n1", date: "2026-05-25", by: "Daniel Okafor", text: "Very expressive, may join worship team eventually." }],
    growth: { discipleship: 20, bibleStudy: 30, churchInvolvement: 25, followUpCompletion: 65 },
  },
  {
    id: "s3",
    name: "Samuel Bassey",
    phone: "+234 802 998 1212",
    email: "sam@mail.com",
    stage: "Converted",
    invitedBy: "Esther Adebayo",
    date: "2026-04-30",
    avatar: "https://i.pravatar.cc/200?img=33",
    mentor: "Pst. Daniel Okafor",
    badges: ["Born Again", "Baptized", "Spirit Filled"],
    milestones: [
      { date: "2026-03-15", title: "First contact", detail: "Met at workplace fellowship", kind: "Moment" },
      { date: "2026-04-30", title: "Gave his life to Christ", detail: "Sunday altar call", kind: "Salvation" },
      { date: "2026-05-15", title: "Water Baptism", detail: "Baptized at Lagos Central", kind: "Baptism" },
      { date: "2026-05-28", title: "Joined Ushering team", detail: "First service serving", kind: "Ministry" },
    ],
    prayers: [{ id: "p1", date: "2026-05-15", text: "Wisdom in his new role at work", status: "Active" }],
    followUps: [
      { id: "f1", date: "2026-05-02", type: "Call", by: "Esther Adebayo", notes: "Discipleship orientation" },
      { id: "f2", date: "2026-05-10", type: "Meeting", by: "Pst. Daniel", notes: "Prepared for baptism" },
    ],
    noteLog: [{ id: "n1", date: "2026-05-16", by: "Pst. Daniel", text: "Strong character, leadership material." }],
    growth: { discipleship: 80, bibleStudy: 75, churchInvolvement: 70, followUpCompletion: 95 },
  },
  {
    id: "s4",
    name: "Aisha Mohammed",
    phone: "+234 809 222 4455",
    location: "Kaduna, Nigeria",
    stage: "Contacted",
    invitedBy: "Michael Bello",
    date: "2026-05-28",
    avatar: "https://i.pravatar.cc/200?img=49",
    mentor: "Pst. Grace Adeyemi",
    badges: [],
    milestones: [{ date: "2026-05-28", title: "First contact", detail: "Through a friend's invite", kind: "Moment" }],
    prayers: [{ id: "p1", date: "2026-05-28", text: "Open heart and divine encounters", status: "Active" }],
    followUps: [{ id: "f1", date: "2026-05-29", type: "Message", by: "Michael Bello", notes: "Sent welcome message" }],
    noteLog: [{ id: "n1", date: "2026-05-28", by: "Michael Bello", text: "Curious and asking good questions." }],
    growth: { discipleship: 5, bibleStudy: 10, churchInvolvement: 5, followUpCompletion: 40 },
  },
];

export const ALL_BADGES: SoulBadge[] = ["Born Again", "Baptized", "Spirit Filled", "New Convert", "Faithful Attender", "Tithing"];
