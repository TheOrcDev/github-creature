/**
 * Creature Subtypes and Type Effectiveness System
 *
 * Subtypes scale with power level:
 * - Power 1-3: 1 subtype
 * - Power 4-8: 2 subtypes
 * - Power 9-10: 3 subtypes
 *
 * Type effectiveness grants a 1.5x damage bonus when an attacker's type
 * is strong against any of the defender's types.
 */

export const CREATURE_SUBTYPES = [
  "fire",
  "water",
  "earth",
  "air",
  "lightning",
  "ice",
  "nature",
  "light",
  "dark",
  "arcane",
  "poison",
  "steel",
  "psychic",
  "ghost",
  "dragon",
  "undead",
  "holy",
  "void",
  "beast",
  "construct",
  "chaos",
  "crystal",
] as const;

export type CreatureSubtype = (typeof CREATURE_SUBTYPES)[number];

/**
 * Type effectiveness map: attacker type -> types it's strong against
 * When an attacker has a type that's strong against a defender's type,
 * the attacker deals 1.5x damage.
 */
export const TYPE_EFFECTIVENESS: Record<CreatureSubtype, CreatureSubtype[]> = {
  fire: ["ice", "nature", "steel", "beast"],
  water: ["fire", "earth", "poison", "steel"],
  earth: ["lightning", "fire", "poison", "crystal"],
  air: ["earth", "nature", "poison", "ghost"],
  lightning: ["water", "air", "steel", "dragon"],
  ice: ["nature", "earth", "dragon", "air"],
  nature: ["water", "earth", "light", "crystal"],
  light: ["dark", "undead", "ghost", "chaos"],
  dark: ["light", "psychic", "ghost", "holy"],
  arcane: ["construct", "beast", "chaos", "void"],
  poison: ["nature", "beast", "psychic", "holy"],
  steel: ["ice", "dragon", "nature", "crystal"],
  psychic: ["poison", "beast", "chaos", "construct"],
  ghost: ["psychic", "light", "holy", "arcane"],
  dragon: ["dragon", "beast", "arcane", "fire"],
  undead: ["nature", "beast", "holy", "light"],
  holy: ["undead", "dark", "chaos", "void"],
  void: ["arcane", "psychic", "holy", "light"],
  beast: ["nature", "earth", "psychic", "poison"],
  construct: ["beast", "poison", "nature", "ghost"],
  chaos: ["holy", "light", "arcane", "steel"],
  crystal: ["arcane", "ghost", "psychic", "dark"],
};

/**
 * Get the number of subtypes a creature should have based on power level
 */
export function getSubtypeCountForPowerLevel(powerLevel: number): number {
  if (powerLevel >= 9) return 3;
  if (powerLevel >= 4) return 2;
  return 1;
}

/**
 * Check if any attacker type is super effective against any defender type
 */
export function isSuperEffective(
  attackerTypes: CreatureSubtype[],
  defenderTypes: CreatureSubtype[]
): boolean {
  for (const attackerType of attackerTypes) {
    const strongAgainst = TYPE_EFFECTIVENESS[attackerType];
    for (const defenderType of defenderTypes) {
      if (strongAgainst.includes(defenderType)) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Get the type effectiveness damage multiplier
 * Returns 1.5 if super effective, 1.0 otherwise
 */
export function getTypeEffectivenessMultiplier(
  attackerTypes: CreatureSubtype[],
  defenderTypes: CreatureSubtype[]
): number {
  return isSuperEffective(attackerTypes, defenderTypes) ? 1.5 : 1.0;
}

/**
 * Metadata for displaying subtypes in the UI
 */
export const SUBTYPE_METADATA: Record<
  CreatureSubtype,
  { label: string; color: string; icon: string }
> = {
  fire: { label: "Fire", color: "#ef4444", icon: "flame" },
  water: { label: "Water", color: "#3b82f6", icon: "droplet" },
  earth: { label: "Earth", color: "#a3622a", icon: "mountain" },
  air: { label: "Air", color: "#93c5fd", icon: "wind" },
  lightning: { label: "Lightning", color: "#facc15", icon: "zap" },
  ice: { label: "Ice", color: "#67e8f9", icon: "snowflake" },
  nature: { label: "Nature", color: "#22c55e", icon: "leaf" },
  light: { label: "Light", color: "#fef08a", icon: "sun" },
  dark: { label: "Dark", color: "#581c87", icon: "moon" },
  arcane: { label: "Arcane", color: "#a855f7", icon: "sparkles" },
  poison: { label: "Poison", color: "#84cc16", icon: "skull" },
  steel: { label: "Steel", color: "#9ca3af", icon: "shield" },
  psychic: { label: "Psychic", color: "#ec4899", icon: "brain" },
  ghost: { label: "Ghost", color: "#c4b5fd", icon: "ghost" },
  dragon: { label: "Dragon", color: "#7c3aed", icon: "dragon" },
  undead: { label: "Undead", color: "#4b5563", icon: "skull" },
  holy: { label: "Holy", color: "#fcd34d", icon: "cross" },
  void: { label: "Void", color: "#1e1b4b", icon: "circle" },
  beast: { label: "Beast", color: "#b45309", icon: "paw" },
  construct: { label: "Construct", color: "#78716c", icon: "cog" },
  chaos: { label: "Chaos", color: "#be123c", icon: "tornado" },
  crystal: { label: "Crystal", color: "#06b6d4", icon: "gem" },
};

/**
 * Parse subtypes from JSON string (stored in database)
 */
export function parseSubtypes(subtypesJson: string): CreatureSubtype[] {
  try {
    const parsed = JSON.parse(subtypesJson);
    if (Array.isArray(parsed)) {
      return parsed.filter((s): s is CreatureSubtype =>
        CREATURE_SUBTYPES.includes(s as CreatureSubtype)
      );
    }
  } catch {
    // Fall back to default if parsing fails
  }
  return ["beast"];
}

/**
 * Stringify subtypes to JSON for database storage
 */
export function stringifySubtypes(subtypes: CreatureSubtype[]): string {
  return JSON.stringify(subtypes);
}
