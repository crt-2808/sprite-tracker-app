export const VariantColors = {
  base: ["#2369B3", "#2B4766", "#007bff"],
  gold: ["#B8B140", "#FFD700", "#9C8C34"],
  cheatmaster: ["#345F36", "#20BF2B", "#287D2D"],
  hacker: ["#B14AED", "#2E1A63", "#B14AED"],
  reaper: ["#6C2584", "#782F90", "#4A1B57"],
  tricktreat: ["#FD8700", "#FFC100", "#FF7100"],

  default:["#E4F4EE","#E0F3F2","#CEF1DE"]
} satisfies Record<string, [string, string, string]>;

export type Variant = keyof typeof VariantColors;
