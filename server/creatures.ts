"use server";

import { count, gt, ilike } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { creatures, InsertCreature } from "@/db/schema";

export async function getCreatureByGithubUsername(githubUsername: string) {
  const githubUrl = `https://github.com/${githubUsername}`;
  console.log(githubUrl);
  try {
    const creature = await db.query.creatures.findFirst({
      where: (creatures, { eq }) => eq(creatures.githubProfileUrl, githubUrl),
    });
    return creature;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get creature");
  }
}

export async function saveCreature(creature: InsertCreature) {
  try {
    const [newCreature] = await db
      .insert(creatures)
      .values(creature)
      .returning();
    return newCreature;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save creature");
  }
}

export async function getTenLatestCreatures() {
  try {
    const creatures = await db.query.creatures.findMany({
      orderBy: (creatures, { desc }) => desc(creatures.createdAt),
      limit: 10,
    });

    return creatures;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get creatures");
  }
}

export async function getLeaderboard() {
  try {
    const creatures = await db.query.creatures.findMany({
      orderBy: (creatures, { desc }) => desc(creatures.contributions),
      limit: 10,
    });
    return creatures;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get leaderboard");
  }
}

export async function getFollowersLeaderboard() {
  try {
    const creatures = await db.query.creatures.findMany({
      orderBy: (creatures, { desc }) => desc(creatures.followers),
      limit: 10,
    });
    return creatures;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get followers leaderboard");
  }
}

export async function getStarsLeaderboard() {
  try {
    const creatures = await db.query.creatures.findMany({
      orderBy: (creatures, { desc }) => desc(creatures.stars),
      limit: 10,
    });
    return creatures;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get stars leaderboard");
  }
}

export async function getCreatureTopPercentage(id: string) {
  try {
    const creature = await db.query.creatures.findFirst({
      where: (creatures, { eq }) => eq(creatures.id, id),
    });

    if (!creature) {
      throw new Error("Creature not found");
    }

    const [{ count: totalCreaturesRaw }] = await db
      .select({ count: count() })
      .from(creatures);

    const totalCreatures = Number(totalCreaturesRaw ?? 0);
    if (totalCreatures === 0) return 0;

    const [{ count: betterCreaturesRaw }] = await db
      .select({ count: count() })
      .from(creatures)
      .where(gt(creatures.contributions, creature.contributions));

    const betterCreatures = Number(betterCreaturesRaw ?? 0);
    const rank = betterCreatures + 1;

    return Math.round((rank / totalCreatures) * 100);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get creature top percentage");
  }
}

export async function searchCreaturesByUsername(query: string) {
  if (!query || query.length < 1) return [];

  try {
    const results = await db.query.creatures.findMany({
      where: ilike(creatures.githubProfileUrl, `%github.com/${query}%`),
      limit: 5,
      orderBy: (creatures, { desc }) => desc(creatures.contributions),
    });

    return results.map((c) => ({
      username: c.githubProfileUrl.split("/").pop() ?? "",
      name: c.name,
      image: c.image,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}
