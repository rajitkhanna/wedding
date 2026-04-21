const GROUP_VISIBILITY: Record<string, string[]> = {
  general: ["welcome", "ceremony", "cocktails", "reception", "farewell"],
  bride: ["welcome", "ceremony", "cocktails", "reception", "farewell"],
  groom: ["welcome", "ceremony", "cocktails", "reception", "farewell"],
  family: [
    "welcome",
    "ceremony",
    "family-dinner",
    "cocktails",
    "reception",
    "farewell",
  ],
};

export function getVisibleGroups(scheduleGroup: string): string[] {
  return GROUP_VISIBILITY[scheduleGroup] ?? GROUP_VISIBILITY.general;
}
