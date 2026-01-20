"use server";

import { and, avg, between, count, gt, ilike, sql } from "drizzle-orm";

import { asc, desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { battles, creatures, InsertCreature, SelectCreature } from "@/db/schema";

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

export async function getRandomCreatures(limit: number = 20) {
  try {
    const creaturesList = await db.query.creatures.findMany({
      orderBy: sql`RANDOM()`,
      limit: limit,
    });
    return creaturesList;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get random creatures");
  }
}

export async function getCreaturesStats() {
  try {
    const [stats] = await db
      .select({
        count: count(),
        avgPowerLevel: avg(creatures.powerLevel),
      })
      .from(creatures);

    const topContributor = await db.query.creatures.findFirst({
      orderBy: (creatures, { desc }) => desc(creatures.contributions),
    });

    return {
      totalCount: Number(stats.count ?? 0),
      averagePowerLevel: Number(stats.avgPowerLevel ?? 0).toFixed(1),
      topContributor,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get creatures stats");
  }
}

export async function getCreaturesByPowerLevelRange(
  minPower: number,
  maxPower: number,
  excludeIds: string[] = [],
  limit: number = 10
) {
  try {
    const creaturesList = await db.query.creatures.findMany({
      where: (creatures, { and, between, notInArray }) => {
        const conditions = [between(creatures.powerLevel, minPower, maxPower)];
        if (excludeIds.length > 0) {
          conditions.push(notInArray(creatures.id, excludeIds));
        }
        return and(...conditions);
      },
      orderBy: sql`RANDOM()`,
      limit: limit,
    });
    return creaturesList;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get creatures by power level range");
  }
}

export async function findOpponentByPowerLevel(
  targetPowerLevel: number,
  excludeIds: string[] = []
) {
  // Define tolerance range for matching - wider range for better match finding
  const tolerance = 1.0;
  const minPower = Math.max(0, targetPowerLevel - tolerance);
  const maxPower = Math.min(10, targetPowerLevel + tolerance);

  try {
    const candidates = await getCreaturesByPowerLevelRange(
      minPower,
      maxPower,
      excludeIds,
      5
    );

    if (candidates.length === 0) {
      // Fallback: get any random creature not in excludeIds
      const fallback = await db.query.creatures.findMany({
        where: (creatures, { notInArray }) =>
          excludeIds.length > 0
            ? notInArray(creatures.id, excludeIds)
            : undefined,
        orderBy: sql`RANDOM()`,
        limit: 1,
      });
      return fallback[0] || null;
    }

    // Sort by closest power level and pick the closest one
    candidates.sort(
      (a, b) =>
        Math.abs(a.powerLevel - targetPowerLevel) -
        Math.abs(b.powerLevel - targetPowerLevel)
    );

    return candidates[0];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to find opponent");
  }
}

export async function getAllCreatures(limit: number = 50) {
  try {
    const creaturesList = await db.query.creatures.findMany({
      orderBy: (creatures, { desc }) => desc(creatures.powerLevel),
      limit: limit,
    });
    return creaturesList;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get all creatures");
  }
}

export async function getFilteredCreatures(options: {
  search?: string;
  powerMin?: number;
  powerMax?: number;
  sortField?: "powerLevel" | "contributions" | "followers" | "stars";
  sortDirection?: "asc" | "desc";
  page?: number;
  limit?: number;
}): Promise<{
  creatures: SelectCreature[];
  totalCount: number;
}> {
  const {
    search = "",
    powerMin = 0,
    powerMax = 10,
    sortField = "powerLevel",
    sortDirection = "desc",
    page = 1,
    limit = 20,
  } = options;

  try {
    // Build conditions
    const conditions = [];

    // Power level range filter
    conditions.push(between(creatures.powerLevel, powerMin, powerMax));

    // Search by GitHub username
    if (search && search.length > 0) {
      conditions.push(ilike(creatures.githubProfileUrl, `%github.com/${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count for pagination
    const [{ count: totalCountRaw }] = await db
      .select({ count: count() })
      .from(creatures)
      .where(whereClause);

    const totalCount = Number(totalCountRaw ?? 0);

    // Build order clause
    const sortColumn = creatures[sortField];
    const orderClause = sortDirection === "asc" ? asc(sortColumn) : desc(sortColumn);

    // Get paginated creatures
    const offset = (page - 1) * limit;
    const creaturesList = await db
      .select()
      .from(creatures)
      .where(whereClause)
      .orderBy(orderClause)
      .limit(limit)
      .offset(offset);

    return {
      creatures: creaturesList,
      totalCount,
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get filtered creatures");
  }
}

export async function saveBattleResult(data: {
  winnerCreatureId: string;
  loserCreatureId: string;
  playerTeamIds: string[];
  opponentTeamIds: string[];
  totalRounds: number;
  battleReport?: string;
}) {
  try {
    const [newBattle] = await db
      .insert(battles)
      .values({
        winnerCreatureId: data.winnerCreatureId,
        loserCreatureId: data.loserCreatureId,
        playerTeamIds: JSON.stringify(data.playerTeamIds),
        opponentTeamIds: JSON.stringify(data.opponentTeamIds),
        totalRounds: data.totalRounds,
        battleReport: data.battleReport,
      })
      .returning();
    return newBattle;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to save battle result");
  }
}

export async function getWinsLeaderboard() {
  try {
    // Get all battles and count wins per creature
    const allBattles = await db.select().from(battles);

    // Count wins for each creature
    const winCounts = new Map<string, number>();
    for (const battle of allBattles) {
      const currentWins = winCounts.get(battle.winnerCreatureId) || 0;
      winCounts.set(battle.winnerCreatureId, currentWins + 1);
    }

    // Sort by wins and get top 10
    const sortedWinners = Array.from(winCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Fetch creature details for top winners
    const leaderboard = await Promise.all(
      sortedWinners.map(async ([creatureId, wins]) => {
        const creature = await db.query.creatures.findFirst({
          where: eq(creatures.id, creatureId),
        });
        return creature ? { ...creature, wins } : null;
      })
    );

    return leaderboard.filter(Boolean) as (typeof creatures.$inferSelect & {
      wins: number;
    })[];
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get wins leaderboard");
  }
}
