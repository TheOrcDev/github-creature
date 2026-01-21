/**
 * Migration script to assign subtypes to existing creatures
 *
 * Subtypes are assigned based on:
 * 1. Power level determines count (1-3 → 1, 4-8 → 2, 9-10 → 3)
 * 2. Keywords in name/description are used to infer appropriate subtypes
 * 3. Random assignment for remaining slots
 *
 * Run with: npx tsx scripts/assign-subtypes.ts
 */

import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "../db/schema";
import {
  CREATURE_SUBTYPES,
  type CreatureSubtype,
  getSubtypeCountForPowerLevel,
  stringifySubtypes,
} from "../lib/type-effectiveness";

config({ path: ".env" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

// Keywords that suggest specific subtypes
const SUBTYPE_KEYWORDS: Record<CreatureSubtype, string[]> = {
  fire: [
    "fire",
    "flame",
    "burn",
    "inferno",
    "ember",
    "blaze",
    "magma",
    "lava",
    "phoenix",
    "salamander",
    "ifrit",
  ],
  water: [
    "water",
    "aqua",
    "ocean",
    "sea",
    "wave",
    "river",
    "lake",
    "mermaid",
    "kraken",
    "leviathan",
    "fish",
    "shark",
  ],
  earth: [
    "earth",
    "stone",
    "rock",
    "mountain",
    "golem",
    "terra",
    "clay",
    "boulder",
    "cavern",
    "sand",
  ],
  air: [
    "air",
    "wind",
    "sky",
    "cloud",
    "storm",
    "breeze",
    "gale",
    "tornado",
    "hurricane",
    "aerial",
    "flying",
  ],
  lightning: [
    "lightning",
    "thunder",
    "electric",
    "bolt",
    "spark",
    "storm",
    "voltage",
    "shock",
  ],
  ice: [
    "ice",
    "frost",
    "frozen",
    "cold",
    "snow",
    "glacier",
    "winter",
    "blizzard",
    "arctic",
    "chill",
  ],
  nature: [
    "nature",
    "plant",
    "tree",
    "forest",
    "vine",
    "leaf",
    "flower",
    "druid",
    "dryad",
    "treant",
    "green",
  ],
  light: [
    "light",
    "radiant",
    "bright",
    "sun",
    "solar",
    "luminous",
    "celestial",
    "angel",
    "seraph",
  ],
  dark: [
    "dark",
    "shadow",
    "night",
    "void",
    "abyss",
    "nightmare",
    "demon",
    "devil",
    "fiend",
  ],
  arcane: [
    "arcane",
    "magic",
    "mage",
    "wizard",
    "sorcerer",
    "spell",
    "enchant",
    "mystic",
    "ethereal",
  ],
  poison: [
    "poison",
    "toxic",
    "venom",
    "acid",
    "plague",
    "disease",
    "spider",
    "snake",
    "scorpion",
  ],
  steel: [
    "steel",
    "iron",
    "metal",
    "armor",
    "blade",
    "sword",
    "knight",
    "war",
    "machine",
  ],
  psychic: [
    "psychic",
    "mind",
    "mental",
    "psi",
    "telepathy",
    "telekinesis",
    "illusion",
    "dream",
  ],
  ghost: [
    "ghost",
    "spirit",
    "spectral",
    "phantom",
    "wraith",
    "specter",
    "haunt",
    "ethereal",
  ],
  dragon: [
    "dragon",
    "drake",
    "wyvern",
    "wyrm",
    "serpent",
    "draconic",
    "scaled",
  ],
  undead: [
    "undead",
    "zombie",
    "skeleton",
    "lich",
    "vampire",
    "ghoul",
    "wight",
    "revenant",
    "necro",
  ],
  holy: [
    "holy",
    "divine",
    "sacred",
    "blessed",
    "paladin",
    "cleric",
    "priest",
    "angel",
    "seraph",
  ],
  void: [
    "void",
    "null",
    "empty",
    "nether",
    "eldritch",
    "cosmic",
    "aberration",
    "lovecraft",
  ],
  beast: [
    "beast",
    "wolf",
    "bear",
    "lion",
    "tiger",
    "animal",
    "primal",
    "feral",
    "wild",
    "creature",
    "monster",
  ],
  construct: [
    "construct",
    "golem",
    "automaton",
    "robot",
    "machine",
    "mechanical",
    "artificial",
  ],
  chaos: [
    "chaos",
    "entropy",
    "disorder",
    "random",
    "wild",
    "unstable",
    "mutant",
    "aberrant",
  ],
  crystal: [
    "crystal",
    "gem",
    "jewel",
    "diamond",
    "quartz",
    "prism",
    "shard",
    "crystalline",
  ],
};

/**
 * Infer subtypes from creature name and description
 */
function inferSubtypes(
  name: string,
  description: string,
  count: number
): CreatureSubtype[] {
  const text = `${name} ${description}`.toLowerCase();
  const matchedSubtypes: CreatureSubtype[] = [];

  // Check each subtype for keyword matches
  for (const subtype of CREATURE_SUBTYPES) {
    const keywords = SUBTYPE_KEYWORDS[subtype];
    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        if (!matchedSubtypes.includes(subtype)) {
          matchedSubtypes.push(subtype);
        }
        break;
      }
    }
    // Stop if we have enough matches
    if (matchedSubtypes.length >= count) {
      break;
    }
  }

  // Fill remaining slots with random subtypes
  while (matchedSubtypes.length < count) {
    const available = CREATURE_SUBTYPES.filter(
      (s) => !matchedSubtypes.includes(s)
    );
    const randomIndex = Math.floor(Math.random() * available.length);
    matchedSubtypes.push(available[randomIndex]);
  }

  return matchedSubtypes.slice(0, count);
}

async function main() {
  console.log("Fetching all creatures...");
  const creatures = await db.query.creatures.findMany();

  console.log(`Found ${creatures.length} creatures to process`);

  let updated = 0;
  let skipped = 0;

  for (const creature of creatures) {
    // Skip if subtypes already assigned (not default)
    if (creature.subtypes && creature.subtypes !== '["beast"]') {
      console.log(`Skipping ${creature.name} - already has subtypes`);
      skipped++;
      continue;
    }

    const subtypeCount = getSubtypeCountForPowerLevel(creature.powerLevel);
    const subtypes = inferSubtypes(
      creature.name,
      creature.description,
      subtypeCount
    );
    const subtypesJson = stringifySubtypes(subtypes);

    await db
      .update(schema.creatures)
      .set({ subtypes: subtypesJson })
      .where(eq(schema.creatures.id, creature.id));

    console.log(
      `Updated ${creature.name} (PL: ${creature.powerLevel.toFixed(1)}) → [${subtypes.join(", ")}]`
    );
    updated++;
  }

  console.log(`\nDone! Updated: ${updated}, Skipped: ${skipped}`);
}

main().catch(console.error);
