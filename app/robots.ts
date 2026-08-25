import { type MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    host: "https://www.githubcreature.com",
    rules: {
      allow: "/",
      userAgent: "*",
    },
    sitemap: "https://www.githubcreature.com/sitemap.xml",
  };
}
