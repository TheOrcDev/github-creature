import {
  createSearchParamsCache,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";

export const POWER_LEVEL_RANGES = {
  all: { min: 0, max: 10, label: "All Levels" },
  "0-3": { min: 0, max: 3, label: "Beginner (0-3)" },
  "3-6": { min: 3, max: 6, label: "Intermediate (3-6)" },
  "6-9": { min: 6, max: 9, label: "Advanced (6-9)" },
  "9-10": { min: 9, max: 10, label: "Legendary (9-10)" },
} as const;

export type PowerLevelRange = keyof typeof POWER_LEVEL_RANGES;

export const SORT_OPTIONS = {
  powerLevel: { field: "powerLevel", direction: "desc", label: "Power Level" },
  contributions: {
    field: "contributions",
    direction: "desc",
    label: "Contributions",
  },
  followers: { field: "followers", direction: "desc", label: "Followers" },
  stars: { field: "stars", direction: "desc", label: "Stars" },
} as const;

export type SortOption = keyof typeof SORT_OPTIONS;

export const duelSearchParams = {
  search: parseAsString.withDefault(""),
  power: parseAsStringEnum<PowerLevelRange>([
    "all",
    "0-3",
    "3-6",
    "6-9",
    "9-10",
  ]).withDefault("all"),
  sort: parseAsStringEnum<SortOption>([
    "powerLevel",
    "contributions",
    "followers",
    "stars",
  ]).withDefault("powerLevel"),
  page: parseAsInteger.withDefault(1),
};

export const duelSearchParamsCache = createSearchParamsCache(duelSearchParams);
export const CREATURES_PER_PAGE = 20;
