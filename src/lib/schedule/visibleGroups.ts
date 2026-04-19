const VISIBLE_GROUPS: Record<string, string[]> = {
  "wedding-party": ["all", "family", "wedding-party"],
  family: ["all", "family"],
  general: ["all"],
  admin: ["all", "family", "wedding-party"],
};

export function getVisibleGroups(scheduleGroup: string | undefined): string[] {
  return VISIBLE_GROUPS[scheduleGroup ?? "general"] ?? ["all"];
}
