"use server";

import { db } from '@/db/drizzle';
import { put } from '@vercel/blob';
import { generateText } from 'ai';
import { redirect } from 'next/navigation';
import { saveCreature } from './creatures';

export async function fetchGithubStats(username: string) {
    const response = await fetch(`https://api.github.com/search/commits?q=author:${username}`);
    const data = await response.json();

    return data;
}

export async function generateCreatureImage(githubProfileUrl: string, contributions: number) {
    const result = await generateText({
        model: 'google/gemini-2.5-flash-image',
        prompt:
            `
            Generate a fantasy creature image based on a GitHub user's contributions. Use the following rules:

            Style & Tone (IMPORTANT):

            Dark fantasy aesthetic: grim, moody, mystical, slightly ominous
            Low-tier creatures should look pathetic, frail, cursed, or barely surviving
            Higher-tier creatures should progressively look more dominant, intimidating, majestic, and powerful
            Power must be visually obvious: posture, size, armor, aura, magic effects, environment
            No “cute” low-level creatures — weakness should be visible and uncomfortable
            High-level creatures should feel ancient, feared, or godlike

            GitHub user: ${githubProfileUrl}
            Contributions: ${contributions}

            Contributions determine base tier / strength:

            - 0–9 contributions: Tiny, weak creatures (Rat, Slime, Goblin Hatchling, Shadow Sprite)
            - 10–49 contributions: Weak creatures (Kobold, Small Goblin, Pixie, Nether Imp)
            - 50–99 contributions: Low-tier beings (Apprentice, Forest Scout, Cave Lurker, Young Elemental)
            - 100–499 contributions: Regular creatures (Villager, Footman, Ranger, Dungeon Bat, Woodland Spirit)
            - 500–999 contributions: Notable creatures (Orc Warrior, Mage Apprentice, Griffin Hatchling, Fire Sprite)
            - 1000–1999 contributions: Heroic creatures (Knight, Paladin, Battle Mage, Elite Archer, Storm Drake)
            - 2000–2999 contributions: Elite creatures (Dragon Rider, Champion, Sorcerer, Beastmaster, Nether Fiend)
            - 3000–4999 contributions: Legendary creatures (Dragon, Phoenix, Hydra, Ancient Elemental, Celestial Wyrm)
            - 5000+ contributions: Godlike / Mythic beings (Titan, Archangel, Elder God, Primordial Dragon, Nether Lord)

            Visual Power Scaling Rules:

            Creature size, armor, weapons, wings, horns, glow, and environment must scale with tier
            Weak creatures should:
            - Look injured, starving, cursed, or malformed
            - Wear broken gear or none at all
            - Stand in dark, hostile environments

            Powerful creatures should:
            - Emit magical auras, elemental effects, or divine corruption
            - Control their surroundings (storms, fire, void, light, shadows)
            - Appear confident, dominant, or terrifying

            Requirements for image and description:
            - Creature can come from any fantasy realm: forests, dungeons, nether, oceans, mountains, mythic planes
            Include a fantasy name
            - Include a short description reflecting contributions, followers, and stars
            - Image should reflect creature tier, commander potential, and magical abilities
            - Be creative — don’t limit to humans, knights, or dragons
            - Make the creature visually striking, detailed, unique, and clearly tiered
            `,
    });

    return result;
}

export async function submitGithubForm(githubProfileUrl: string) {

    const check = await db.query.creatures.findFirst({
        where: (creatures, { eq }) => eq(creatures.githubProfileUrl, githubProfileUrl),
    });

    if (check) {
        return { success: true, message: "Creature already exists." };
    }

    const username = githubProfileUrl.split("/").pop();

    if (!username) {
        throw new Error("Invalid GitHub profile URL");
    }

    const stats = await fetchGithubStats(username);

    if (stats.total_count == null || Number.isNaN(stats.total_count)) {
        return { success: false, message: "Failed to fetch GitHub stats. Is the username valid?" };
    }

    const image = await generateCreatureImage(githubProfileUrl, stats.total_count);

    for (const result of image.content) {
        if (result.type === 'file') {
            const blob = await put(`generated-img-${username}.png`, Buffer.from(result.file.uint8Array), {
                access: 'public',
            });

            await saveCreature({
                githubProfileUrl: githubProfileUrl.toLowerCase(),
                contributions: stats.total_count,
                image: blob.url,
                description: image.text,
            });

            redirect(`/creature/${username}`);
        }
    }
}

