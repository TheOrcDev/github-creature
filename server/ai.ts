"use server";

import { db } from '@/db/drizzle';
import { put } from '@vercel/blob';
import { generateObject, generateText } from 'ai';
import { redirect } from 'next/navigation';
import z from 'zod/v3';
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

            Fantasy aesthetic: like from a D&D 5e Monster Manual, in natural habitat.
            Low-tier creatures should look pathetic, frail, cursed, or barely surviving
            Higher-tier creatures should progressively look more dominant, intimidating, majestic, and powerful
            Power must be visually obvious: posture, size, armor, aura, magic effects, environment
            No “cute” low-level creatures — weakness should be visible and uncomfortable
            High-level creatures should feel ancient, feared, or godlike

            GitHub user: ${githubProfileUrl} - if this user name has some name that can reference some monster, use it.
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

            Visual Power Scaling Rules:

            Creature size, armor, weapons, wings, horns, glow, and environment must scale with tier
            Weak creatures should:
            - Look injured, starving, cursed, or malformed
            - Wear broken gear or none at all

            Powerful creatures (CR 8–10 and above) should:
            - Emit magical auras, elemental effects, or divine corruption
            - Control their surroundings (storms, fire, void, light, shadows)
            - Appear confident, dominant, or terrifying

            Requirements for the image:
            - Creature can come from any fantasy realm: forests, dungeons, nether, oceans, mountains, mythic planes
            - In your TEXT OUTPUT (not on the image), START with: "Base creature: <Monster Manual creature name> (CR <CR>)"
            - Then add 2–4 sentences of vivid notes (pose, gear, aura, habitat) for downstream prompt generation.
            - Image should reflect creature tier, commander potential, and magical abilities
            - Be creative, but keep the base creature aligned to the D&D 5e Monster Manual choice for the tier
            - Make the creature visually striking, detailed, unique, and clearly tiered
            - Don't put any text on the image.
            `,
    });

    return result;
}

export async function generateCreatureDescriptionAndName(contributions: number, promptDescription: string) {
    const result = await generateObject({
        model: 'google/gemini-2.5-flash',
        schema: z.object({
            name: z.string(),
            description: z.string(),
        }),
        prompt: `You are generating a "GitHub Creature" card.

        Return:
        - name: a unique fantasy creature name (2–5 words, title case, no quotes)
        - description: a dev-friendly card blurb that explains what kind of developer this person seems to be, grounded in the stats + creature concept.

        Inputs:
        - Contributions (activity signal): ${contributions}
        - Creature notes (from the image prompt): ${promptDescription}

        Description requirements:
        - Based on the CR of the creature, describe the creature in a way that is appropriate for the tier. If it's a CR 0 creature, describe it as a harmless/vermin-tier creature and roast the developer for not contributing enough. As it gets stronger, describe the creature in a way that is appropriate for the tier.
        - 2–4 sentences total, concise and punchy.
        - Sentence 1: what the creature is / looks like (use the creature notes).
        - Sentence 2: the developer archetype inferred from contributions (e.g., "steady shipper", "burst contributor", "marathon maintainer", etc.). Be honest and avoid over-claiming; use "seems/likely" when needed.
        - Sentence 3 (optional): map creature traits → dev traits (e.g., "armored" → "reliable", "storm magic" → "fast iteration under pressure").
        - Mention the contribution count once, naturally.
        - Avoid: emojis, cringe marketing, judging language, and guessing specific languages/frameworks/companies.
        `,
    });

    return result.object;
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
    const { name, description } = await generateCreatureDescriptionAndName(stats.total_count, image.text);

    for (const result of image.content) {
        if (result.type === 'file') {
            const blob = await put(`${username}.png`, Buffer.from(result.file.uint8Array), {
                access: 'public',
            });

            await saveCreature({
                githubProfileUrl: githubProfileUrl.toLowerCase(),
                contributions: stats.total_count,
                image: blob.url,
                description: description,
                name: name,
            });

            redirect(`/creature/${username}`);
        }
    }
}

