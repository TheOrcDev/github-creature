import { type MetadataRoute } from "next";

const origin = "https://www.githubcreature.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "weekly",
      priority: 1,
      url: origin,
    },
    {
      changeFrequency: "weekly",
      priority: 0.9,
      url: `${origin}/summon`,
    },
    {
      changeFrequency: "daily",
      priority: 0.8,
      url: `${origin}/leaderboard`,
    },
  ];
}
