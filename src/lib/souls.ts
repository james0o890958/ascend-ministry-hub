import {
  Soul,
  SoulBadge,
  SoulStage,
  SoulMilestone,
  SoulPrayer,
  SoulFollowUp,
  SoulNote,
} from "@/types/domain";

export type { Soul, SoulBadge, SoulStage, SoulMilestone, SoulPrayer, SoulFollowUp, SoulNote };

export * from "@/lib/stores/souls-store";

export const ALL_BADGES: SoulBadge[] = [
  "Born Again",
  "Baptized",
  "Spirit Filled",
  "New Convert",
  "Faithful Attender",
  "Tithing",
];
