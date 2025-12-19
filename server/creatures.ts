"use server";

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
        const [newCreature] = await db.insert(creatures).values(creature).returning();
        return newCreature;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to save creature");
    }
}

export async function getSixLatestCreatures() {
    try {
        const creatures = await db.query.creatures.findMany({
            orderBy: (creatures, { desc }) => desc(creatures.createdAt),
            limit: 6,
        });

        return creatures;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to get creatures");
    }
}