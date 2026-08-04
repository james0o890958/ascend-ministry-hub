export type Role = "Admin" | "Branch Admin" | "Pastor" | "PCF Leader" | "Cell Leader" | "Member";

export const ROLES: Role[] = [
  "Admin",
  "Branch Admin",
  "Pastor",
  "PCF Leader",
  "Cell Leader",
  "Member",
];

export const DEFAULT_MEMBER_STAGES = [
  "Invitee",
  "First Timer",
  "Regular Attendee",
  "Baptized Member",
  "Foundation School Student",
  "Foundation School Graduate",
  "Cell Member",
  "Workforce Member",
] as const;

export type DefaultMemberStage = (typeof DEFAULT_MEMBER_STAGES)[number];

export type MilestoneDefinition = {
  id: string;
  branchId: string;
  name: string;
  status: "active" | "archived";
  suggestedStage?: string; // Optional stage auto-suggest mapping
};

export type MemberMilestone = {
  milestoneId: string;
  completed: boolean;
  date?: string;
};

export type Branch = {
  id: string;
  name: string;
  location?: string;
  country?: string;
  pastor?: string;
  createdAt: string;
  status: "active" | "archived";
  stages: string[]; // Ordered member stage sequence
  milestones: MilestoneDefinition[]; // Available milestone catalog
  growth?: number;
  membersCount?: number;
  leadersCount?: number;
};

export type SoulStage = "Contacted" | "Visited" | "Following Up" | "Converted";

export type SoulBadge =
  | "Born Again"
  | "Baptized"
  | "Spirit Filled"
  | "New Convert"
  | "Faithful Attender"
  | "Tithing";

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
  answeredAt?: string;
  testimony?: string;
};

export type SoulFollowUp = {
  id: string;
  date: string;
  type: "Call" | "Visit" | "Meeting" | "Message";
  by: string;
  notes: string;
  status: "scheduled" | "completed" | "cancelled";
  completedAt?: string;
  outcome?: string;
};

export type SoulNote = {
  id: string;
  date: string;
  by: string;
  text: string;
};

export type Soul = {
  id: string;
  soulTracerId?: string;
  name: string;
  phone: string;
  email?: string;
  location?: string;
  stage: SoulStage;
  status: "active" | "archived";
  branch: string;
  invitedBy: string;
  mentor: string;
  date: string;
  convertedAt?: string;
  notes?: string;
  convertedMemberId?: string | null;
  avatar?: string;
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

export type MemberOrigin = "evangelism" | "direct" | "transfer";

export type Member = {
  id: string;
  soulTracerId?: string;
  name: string;
  email: string;
  phone: string;
  branch: string;
  role: Role;
  stage: string;
  milestones: MemberMilestone[];
  badges?: SoulBadge[];
  cellId?: string | null;
  cell?: string;
  mentor: string;
  joinedAt: string;
  convertedAt?: string;
  transferredAt?: string;
  avatar: string;
  status: "active" | "inactive";
  originType?: MemberOrigin;
  originSoulId?: string | null;
  originBranch?: string | null;
  attendance?: number;
};

export type CellGroup = {
  id: string;
  name: string;
  branch: string;
  leaderId?: string;
  leader: string;
  members: string[]; // array of Member IDs or count
  status: "active" | "archived";
  attendance?: number;
  growth?: number;
};

export type EventScope = "global" | "branch";

export type ChurchEvent = {
  id: string;
  name: string;
  date: string;
  type: "Service" | "Midweek" | "Cell" | "Crusade" | "Training";
  scope: EventScope;
  branch?: string | null;
  createdBy?: string;
  attendees: number;
  capacity: number;
  registeredMemberIds?: string[];
  description?: string;
};

export type GivingType = "Tithe" | "Offering" | "Project" | "Partnership" | "Seed";

export type GivingRecord = {
  id: string;
  date: string;
  type: GivingType;
  source: string;
  amount: number;
  branch: string;
  memberId?: string | null;
  giverNameIfAnonymous?: string | null;
  rollupScope?: "branch-only" | "ministry-wide";
  status?: "pending" | "verified" | "rejected";
  paymentChannel?: "Bank Transfer" | "Cash" | "POS" | "Cheque";
  receiptRef?: string | null;
  receiptUrl?: string | null;
  pledgeId?: string | null;
  rejectionReason?: string | null;
};

export type PartnershipPledge = {
  id: string;
  memberId: string;
  memberName: string;
  branch: string;
  title: string;
  targetAmount: number;
  fulfilledAmount: number;
  status: "active" | "completed";
  createdAt: string;
};

export type ChurchBankDetail = {
  branch: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
};

export type GivingTypeConfig = {
  type: GivingType;
  isMinistryWideRollup: boolean;
};

export type SessionState = {
  memberId: string;
  role: Role;
  branch: string;
};
