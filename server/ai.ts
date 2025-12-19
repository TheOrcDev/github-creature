"use server";

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

            GitHub user: ${githubProfileUrl}
            Contributions: ${contributions}

            Contributions determine base tier / strength:
            * 0–9 contributions: Tiny, weak creatures (Rat, Slime, Goblin Hatchling, Shadow Sprite)
            * 10–49 contributions: Weak creatures (Kobold, Small Goblin, Pixie, Nether Imp)
            * 50–99 contributions: Low-tier beings (Apprentice, Forest Scout, Cave Lurker, Young Elemental)
            * 100–499 contributions: Regular creatures (Villager, Footman, Ranger, Dungeon Bat, Woodland Spirit)
            * 500–999 contributions: Notable creatures (Orc Warrior, Mage Apprentice, Griffin Hatchling, Fire Sprite)
            * 1000–1999 contributions: Heroic creatures (Knight, Paladin, Battle Mage, Elite Archer, Storm Drake)
            * 2000–2999 contributions: Elite creatures (Dragon Rider, Champion, Sorcerer, Beastmaster, Nether Fiend)
            * 3000–4999 contributions: Legendary creatures (Dragon, Phoenix, Hydra, Ancient Elemental, Celestial Wyrm)
            * 5000+ contributions: Godlike / Mythic beings (Titan, Archangel, Elder God, Primordial Dragon, Nether Lord)

            Requirements for image and description:
            * Creature can come from any fantasy realm: forests, dungeons, nether, oceans, mountains, mythic planes
            * Include a fantasy name
            * Include a short description, reflecting contributions, followers, and stars
            * Image should reflect creature tier, commander potential, and magical abilities
            * Be creative—don’t limit to humans, knights, or dragons; any fantasy creature is valid
            * Make the creature visually interesting, detailed, and unique, highlighting its tier, leadership role, and magical traits"
            `,
    });

    return result;
}

export async function submitGithubForm(githubProfileUrl: string) {
    const username = githubProfileUrl.split("/").pop();

    if (!username) {
        throw new Error("Invalid GitHub profile URL");
    }

    const stats = await fetchGithubStats(username);
    const image = await generateCreatureImage(githubProfileUrl, stats.total_count);

    for (const result of image.content) {
        if (result.type === 'file') {
            const blob = await put(`generated-img-${username}.png`, Buffer.from(result.file.uint8Array), {
                access: 'public',
            });

            const creature = await saveCreature({
                githubProfileUrl,
                contributions: stats.total_count,
                image: blob.url,
                description: image.text,
            });

            redirect(`/creature/${creature.id}`);
        }
    }
}

