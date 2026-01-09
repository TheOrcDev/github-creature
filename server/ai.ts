"use server";

import { put } from "@vercel/blob";
import { generateObject, generateText } from "ai";
import { redirect } from "next/navigation";
import z from "zod/v3";

import { db } from "@/db/drizzle";

import { saveCreature } from "./creatures";

const GITHUB_HOSTS = new Set(["github.com", "www.github.com"]);
// GitHub username rules (practical subset):
// - 1..39 chars
// - alphanumeric or hyphen
// - cannot start or end with hyphen
const GITHUB_USERNAME_REGEX = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

function parseGithubUsernameFromInput(input: string): string {
  const trimmed = input.trim();

  // Check if it's a URL
  if (trimmed.includes("://")) {
    let url: URL;
    try {
      url = new URL(trimmed);
    } catch {
      throw new Error("Invalid GitHub profile URL");
    }

    if (!GITHUB_HOSTS.has(url.hostname)) {
      throw new Error("Invalid GitHub profile URL (must be github.com)");
    }

    const segments = url.pathname.split("/").filter(Boolean);
    // Only allow `https://github.com/<username>` (optional trailing slash is fine)
    if (segments.length !== 1) {
      throw new Error(
        "Invalid GitHub profile URL (must be a profile URL like https://github.com/username)"
      );
    }

    const username = decodeURIComponent(segments[0] ?? "").trim();
    if (!username || !GITHUB_USERNAME_REGEX.test(username)) {
      throw new Error("Invalid GitHub username");
    }

    return username.toLowerCase();
  }

  // Otherwise treat as a username
  if (!trimmed || !GITHUB_USERNAME_REGEX.test(trimmed)) {
    throw new Error("Invalid GitHub username");
  }

  return trimmed.toLowerCase();
}

export async function fetchGithubStats(username: string) {
  const query = `
      query($login: String!) {
        user(login: $login) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
            }
          }
          followers {
            totalCount
          }
        }
      }
    `;

  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    },
    body: JSON.stringify({
      query,
      variables: { login: username },
    }),
  });

  const json = await res.json();

  if (!res.ok || json?.errors?.length) {
    const details =
      json?.errors
        ?.map((e: { message?: string }) => e?.message)
        .filter(Boolean)
        .join("; ") || `HTTP ${res.status}`;
    throw new Error(
      `Failed to fetch GitHub stats for "${username}": ${details}`
    );
  }

  if (!json?.data?.user) {
    throw new Error(`GitHub user "${username}" not found (or inaccessible).`);
  }

  const repos = await fetch(
    `https://api.github.com/users/${encodeURIComponent(
      username
    )}/repos?per_page=100&page=1`
  );

  const totalStars = (await repos.json()).reduce(
    (acc: number, repo: { stargazers_count: number }) =>
      acc + repo.stargazers_count,
    0
  );

  return {
    contributions:
      json.data.user.contributionsCollection.contributionCalendar
        .totalContributions,
    followers: json.data.user.followers.totalCount,
    stars: totalStars,
  };
}

export async function generateCreature(contributions: number) {
  const result = await generateObject({
    model: "google/gemini-2.5-flash",
    schema: z.object({
      name: z.string(),
      description: z.string(),
      imagePrompt: z.string(),
      powerLevel: z.number(),
    }),
    prompt: `
        Generate a fantasy creature based on a GitHub user's contributions. Use the following rules:

        Contributions: ${contributions}

        Contributions determine base tier / strength:

        Instead of using generic examples, select an appropriate creature from the D&D 5e Monster Manual based on Challenge Rating (CR).
        - Pick a Monster Manual creature whose CR falls in the tier’s CR band.
        - The visual power should clearly match the tier.
        - You may add original cosmetic details (scars, armor style, aura, environment) to fit the fantasy vibe.
        
        Anti-repetition / randomness rules (CRITICAL):
        - Do NOT default to the same "iconic" monster for the tier.
        - Always pick a DIFFERENT Monster Manual creature each time you run this prompt, even if the inputs are identical.
        - Before deciding, silently list 12 valid Monster Manual candidates in the tier's CR band, then choose ONE uniformly at random from that list.
        - If you are unsure of a monster's CR, discard it and choose a different Monster Manual creature whose CR you are confident is within band.
        - Prioritize variety across monster types: beasts, undead, fiends, constructs, humanoids, monstrosities, oozes, elementals, giants, etc.

        Contribution tier → suggested CR band:
        - 0–49 contributions: CR 0 (harmless/vermin-tier)
        - 50–150 contributions: CR 1/8–1/4 (minor threats)
        - 151–300 contributions: CR 1/2–1 (trained/low-tier combatants)
        - 301–750 contributions: CR 2–4 (dangerous but grounded threats)
        - 751–1500 contributions: CR 5–7 (notable foes; clearly deadly)
        - 1501–2500 contributions: CR 8–10 (heroic-level threats)
        - 2501–4000 contributions: CR 11–13 (elite threats; battlefield-warping)
        - 4001–5000 contributions: CR 14–17 (legendary threats; apex monsters)
        - 5001+ contributions: CR 18–30 (mythic-scale; world-ending)

        Followers increase chance the creature is a commander / leader:
        * 0–99 followers: Most creatures are solo or minor; very small chance of being a commander
        * 100–499 followers: Moderate chance of being a squad leader, pack alpha, or small commander
        * 500–999 followers: High chance of being a commander, captain, or elite leader
        * 1000+ followers: Very high chance of being a legendary commander, general, or godlike leader

        Stars increase chance the creature has magical or supernatural abilities:
        * 0–49 stars: Mostly natural abilities; minor magic possible
        * 50–199 stars: Moderate chance of magical abilities (fire, ice, elemental skills)
        * 200–499 stars: High chance of strong magical powers (arcane, necromancy, elemental mastery)
        * 1000+ stars: Very high chance of unique, godlike magical abilities (reality-warping, ancient spells, legendary artifacts)

        Power level is a number between 1 and 10, based on the CR band.

        Visual Power Scaling Rules:

        Creature size, armor, weapons, wings, horns, glow, and environment must scale with tier
        Weak creatures should:
        - Look injured, starving, cursed, or malformed
        - Wear broken gear or none at all

        Powerful creatures (CR 8–10 and above) should:
        - Emit magical auras, elemental effects, or divine corruption
        - Control their surroundings (storms, fire, void, light, shadows)
        - Appear confident, dominant, or terrifying

        Requirements for the name:
        - The name should be a creature name.

        Requirements for the description:
        - The description should be a short description of the creature, with some details about its abilities and powers.

        Requirements for the image prompt:
        - Creature can come from any fantasy realm: forests, dungeons, nether, oceans, mountains, mythic planes
        - In your TEXT OUTPUT (not on the image), START with: "Base creature: <Monster Manual creature name> (CR <CR>)"
        - Then add 2–4 sentences of vivid notes (pose, gear, aura, habitat) for downstream prompt generation.
        - Image should reflect creature tier, commander potential, and magical abilities
        - Be creative, but keep the base creature aligned to the D&D 5e Monster Manual choice for the tier
        - Make the creature visually striking, detailed, unique, and clearly tiered
        - Don't put any text on the image.
        `,
  });

  return result.object;
}

export async function generateCreatureImage(
  imagePrompt: string,
  powerLevel: number
) {
  const result = await generateText({
    model: "google/gemini-2.5-flash-image",
    prompt: `
        Generate a fantasy creature image based on the following prompt:

        ${imagePrompt}

        Power Level (1-10): ${powerLevel}

        Visual Power Scaling Rules:

        Creature size, armor, weapons, wings, horns, glow, and environment must scale with power level
        Weak creatures should:
        - Look injured, starving, cursed, or malformed
        - Wear broken gear or none at all

        Powerful creatures (Power Level 8 or above) should:
        - Emit magical auras, elemental effects, or divine corruption
        - Control their surroundings (storms, fire, void, light, shadows)
        - Appear confident, dominant, or terrifying

        Requirements for the image:
        - Creature can come from any fantasy realm: forests, dungeons, nether, oceans, mountains, mythic planes
        - Image should reflect creature tier, commander potential, and magical abilities
        - Be creative, but keep the base creature aligned to the D&D 5e Monster Manual choice for the tier
        - Make the creature visually striking, detailed, unique, and clearly tiered
        - Don't put any text on the image.
        `,
  });

  return result;
}

export async function submitGithubForm(githubProfileUrl: string) {
  let username: string;
  try {
    username = parseGithubUsernameFromInput(githubProfileUrl);
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "Invalid GitHub profile URL",
    };
  }

  const canonicalGithubProfileUrl = `https://github.com/${username}`;

  const check = await db.query.creatures.findFirst({
    where: (creatures, { eq }) =>
      eq(creatures.githubProfileUrl, canonicalGithubProfileUrl),
  });

  if (check) {
    return {
      success: true,
      message: "Creature already exists.",
      redirectUrl: `/${username}`,
    };
  }

  let stats: { contributions: number; followers: number; stars: number };
  try {
    stats = await fetchGithubStats(username);
  } catch (err) {
    return {
      success: false,
      message:
        err instanceof Error ? err.message : "Failed to fetch GitHub stats.",
    };
  }

  if (stats.contributions == null || Number.isNaN(stats.contributions)) {
    return {
      success: false,
      message: "Failed to fetch GitHub stats. Is the username valid?",
    };
  }

  const { name, description, imagePrompt, powerLevel } = await generateCreature(
    stats.contributions
  );
  const image = await generateCreatureImage(imagePrompt, powerLevel);

  for (const result of image.content) {
    if (result.type === "file") {
      const blob = await put(
        `${username}-generated-creature.png`,
        Buffer.from(result.file.uint8Array),
        {
          access: "public",
        }
      );

      await saveCreature({
        githubProfileUrl: canonicalGithubProfileUrl,
        contributions: stats.contributions,
        image: blob.url,
        description: description,
        followers: stats.followers,
        stars: stats.stars,
        name: name,
        powerLevel: +powerLevel,
      });

      redirect(`/${username}`);
    }
  }
}
