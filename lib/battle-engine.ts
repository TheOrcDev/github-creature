import type { SelectCreature } from "@/db/schema";

import {
  type CreatureSubtype,
  getTypeEffectivenessMultiplier,
  parseSubtypes,
} from "@/lib/type-effectiveness";

export type BattleCreature = {
  id: string;
  name: string;
  image: string;
  hp: number;
  maxHp: number;
  atk: number;
  def: number;
  isKnockedOut: boolean;
  team: "player" | "opponent";
  subtypes: CreatureSubtype[];
};

export type BattleAction = {
  round: number;
  attacker: BattleCreature;
  target: BattleCreature;
  damage: number;
  targetHpAfter: number;
  isKnockout: boolean;
  isSuperEffective: boolean;
};

export type BattleResult = {
  winner: "player" | "opponent";
  actions: BattleAction[];
  playerTeamFinal: BattleCreature[];
  opponentTeamFinal: BattleCreature[];
};

export type BattleStats = {
  hp: number;
  atk: number;
  def: number;
};

/**
 * Calculate battle stats from creature data
 * HP: 100 + (powerLevel * 30) + (contributions / 50)
 * ATK: 10 + (powerLevel * 8) + (stars / 100)
 * DEF: 5 + (powerLevel * 4) + (followers / 200)
 */
export function calculateBattleStats(creature: SelectCreature): BattleStats {
  const hp = Math.floor(
    100 + creature.powerLevel * 30 + creature.contributions / 50
  );
  const atk = Math.floor(10 + creature.powerLevel * 8 + creature.stars / 100);
  const def = Math.floor(
    5 + creature.powerLevel * 4 + creature.followers / 200
  );

  return { hp, atk, def };
}

/**
 * Convert a SelectCreature to a BattleCreature with stats
 */
export function createBattleCreature(
  creature: SelectCreature,
  team: "player" | "opponent"
): BattleCreature {
  const stats = calculateBattleStats(creature);

  return {
    id: creature.id,
    name: creature.name,
    image: creature.image,
    hp: stats.hp,
    maxHp: stats.hp,
    atk: stats.atk,
    def: stats.def,
    isKnockedOut: false,
    team,
    subtypes: parseSubtypes(creature.subtypes),
  };
}

/**
 * Get all living (non-knocked out) creatures from a list
 */
function getLivingCreatures(creatures: BattleCreature[]): BattleCreature[] {
  return creatures.filter((c) => !c.isKnockedOut);
}

/**
 * Calculate damage dealt by attacker to defender
 * Formula: max(1, floor(attackerATK - defenderDEF * 0.5)) * typeMultiplier
 * Returns damage amount and whether the attack was super effective
 */
function calculateDamage(
  attacker: BattleCreature,
  defender: BattleCreature
): { damage: number; isSuperEffective: boolean } {
  const baseDamage = Math.max(1, Math.floor(attacker.atk - defender.def * 0.5));
  const multiplier = getTypeEffectivenessMultiplier(
    attacker.subtypes,
    defender.subtypes
  );
  return {
    damage: Math.floor(baseDamage * multiplier),
    isSuperEffective: multiplier > 1,
  };
}

/**
 * Select a random living enemy creature as target
 */
function selectTarget(
  attacker: BattleCreature,
  allCreatures: BattleCreature[]
): BattleCreature | null {
  const enemies = allCreatures.filter(
    (c) => c.team !== attacker.team && !c.isKnockedOut
  );

  if (enemies.length === 0) return null;

  return enemies[Math.floor(Math.random() * enemies.length)];
}

/**
 * Check if a team has won (all enemies knocked out)
 */
function checkVictory(
  allCreatures: BattleCreature[]
): "player" | "opponent" | null {
  const playerLiving = allCreatures.filter(
    (c) => c.team === "player" && !c.isKnockedOut
  );
  const opponentLiving = allCreatures.filter(
    (c) => c.team === "opponent" && !c.isKnockedOut
  );

  if (opponentLiving.length === 0) return "player";
  if (playerLiving.length === 0) return "opponent";
  return null;
}

/**
 * Simulate a full 3v3 battle between player and opponent teams
 * Returns all actions and the final result
 */
export function simulateBattle(
  playerTeam: SelectCreature[],
  opponentTeam: SelectCreature[]
): BattleResult {
  // Create battle creatures with stats
  const playerBattleTeam = playerTeam.map((c) =>
    createBattleCreature(c, "player")
  );
  const opponentBattleTeam = opponentTeam.map((c) =>
    createBattleCreature(c, "opponent")
  );

  const allCreatures = [...playerBattleTeam, ...opponentBattleTeam];
  const actions: BattleAction[] = [];

  let round = 1;
  const MAX_ROUNDS = 100; // Safety limit

  while (round <= MAX_ROUNDS) {
    // Get initiative order: sort all living creatures by ATK (highest first)
    const livingCreatures = getLivingCreatures(allCreatures);
    const turnOrder = [...livingCreatures].sort((a, b) => b.atk - a.atk);

    // Each living creature takes a turn
    for (const attacker of turnOrder) {
      // Skip if knocked out (could have been knocked out this round)
      if (attacker.isKnockedOut) continue;

      // Select target
      const target = selectTarget(attacker, allCreatures);
      if (!target) continue;

      // Calculate and apply damage
      const { damage, isSuperEffective } = calculateDamage(attacker, target);
      target.hp = Math.max(0, target.hp - damage);

      // Check for knockout
      const isKnockout = target.hp <= 0;
      if (isKnockout) {
        target.isKnockedOut = true;
      }

      // Record action
      actions.push({
        round,
        attacker: { ...attacker },
        target: { ...target },
        damage,
        targetHpAfter: target.hp,
        isKnockout,
        isSuperEffective,
      });

      // Check for victory
      const winner = checkVictory(allCreatures);
      if (winner) {
        return {
          winner,
          actions,
          playerTeamFinal: playerBattleTeam.map((c) => ({ ...c })),
          opponentTeamFinal: opponentBattleTeam.map((c) => ({ ...c })),
        };
      }
    }

    round++;
  }

  // If we hit max rounds, player with more living creatures wins
  const playerLiving = getLivingCreatures(playerBattleTeam).length;
  const opponentLiving = getLivingCreatures(opponentBattleTeam).length;

  return {
    winner: playerLiving >= opponentLiving ? "player" : "opponent",
    actions,
    playerTeamFinal: playerBattleTeam.map((c) => ({ ...c })),
    opponentTeamFinal: opponentBattleTeam.map((c) => ({ ...c })),
  };
}

export type BattleLogEntry = {
  round: number;
  attackerName: string;
  attackerTeam: "player" | "opponent";
  targetName: string;
  targetTeam: "player" | "opponent";
  damage: number;
  targetHpAfter: number;
  targetMaxHp: number;
  isKnockout: boolean;
  isSuperEffective: boolean;
  timestamp: number;
};

export type BattleReport = {
  playerTeamNames: string[];
  opponentTeamNames: string[];
  winner: "player" | "opponent";
  totalRounds: number;
  totalActions: number;
  log: BattleLogEntry[];
};

/**
 * Generate a battle report from a battle result
 * Converts BattleActions to BattleLogEntries for display and storage
 */
export function generateBattleReport(
  result: BattleResult,
  playerTeamNames: string[],
  opponentTeamNames: string[]
): BattleReport {
  const log: BattleLogEntry[] = result.actions.map((action, index) => ({
    round: action.round,
    attackerName: action.attacker.name,
    attackerTeam: action.attacker.team,
    targetName: action.target.name,
    targetTeam: action.target.team,
    damage: action.damage,
    targetHpAfter: action.targetHpAfter,
    targetMaxHp: action.target.maxHp,
    isKnockout: action.isKnockout,
    isSuperEffective: action.isSuperEffective,
    timestamp: index,
  }));

  const totalRounds =
    result.actions.length > 0
      ? result.actions[result.actions.length - 1].round
      : 0;

  return {
    playerTeamNames,
    opponentTeamNames,
    winner: result.winner,
    totalRounds,
    totalActions: result.actions.length,
    log,
  };
}
