import statsData from "@/data/stats.json";
import type { StatsJson } from "./types";

export const SITE_URL = "https://jayrajadeja.github.io";
export const RESUME_URL =
  "https://drive.google.com/file/d/1tleUFEbGJ4Se847v0RVS3qQ_4kZL-dS0/view?usp=sharing";

export const stats: StatsJson = statsData;

export function statValue(label: string): number {
  return stats.headline.find((h) => h.label === label)?.value ?? 0;
}
