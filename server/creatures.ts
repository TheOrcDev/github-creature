"use server";

import { db } from "@/db/drizzle";
import { creatures, InsertCreature } from "@/db/schema";

export async function getCreature(creatureId: string) {
    try {
        const creature = await db.query.creatures.findFirst({
            where: (creatures, { eq }) => eq(creatures.id, creatureId),
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