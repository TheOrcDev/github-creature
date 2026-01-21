"use client";

import { Sword01Icon, UserMultiple02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState, useCallback } from "react";

import type { SelectCreature } from "@/db/schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  simulateBattle,
  createBattleCreature,
  generateBattleReport,
  type BattleResult,
  type BattleCreature,
  type BattleReport,
} from "@/lib/battle-engine";
import { saveBattleResult } from "@/server/creatures";

import BattleDisplay from "./battle-display";
import BattleMatchupCard from "./battle-matchup-card";
import SelectableCreatureCard from "./selectable-creature-card";

const MAX_SELECTION = 3;

type DuelArenaProps = {
  creatures: SelectCreature[];
};

type Matchup = {
  playerCreature: SelectCreature;
  opponentCreature: SelectCreature;
};

export default function DuelArena({ creatures }: DuelArenaProps) {
  const [selectedCreatures, setSelectedCreatures] = useState<SelectCreature[]>(
    []
  );
  const [matchups, setMatchups] = useState<Matchup[]>([]);
  const [phase, setPhase] = useState<
    "selection" | "battle" | "battling" | "results"
  >("selection");
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const [battleReport, setBattleReport] = useState<BattleReport | null>(null);
  const [playerBattleTeam, setPlayerBattleTeam] = useState<BattleCreature[]>(
    []
  );
  const [opponentBattleTeam, setOpponentBattleTeam] = useState<
    BattleCreature[]
  >([]);
  const [battleMode, setBattleMode] = useState<"auto" | "manual">("manual");

  const handleCreatureSelect = (creature: SelectCreature) => {
    setSelectedCreatures((prev) => {
      const isAlreadySelected = prev.some((c) => c.id === creature.id);

      if (isAlreadySelected) {
        return prev.filter((c) => c.id !== creature.id);
      }

      if (prev.length >= MAX_SELECTION) {
        return prev;
      }

      return [...prev, creature];
    });
  };

  const findOpponentForPowerLevel = (
    targetPowerLevel: number,
    excludeIds: string[]
  ): SelectCreature | null => {
    // Find creatures within a tolerance range of the target power level
    const tolerance = 1.5;
    const candidates = creatures.filter(
      (c) =>
        !excludeIds.includes(c.id) &&
        Math.abs(c.powerLevel - targetPowerLevel) <= tolerance
    );

    if (candidates.length === 0) {
      // Fallback: get any creature not in excludeIds
      const fallbackCandidates = creatures.filter(
        (c) => !excludeIds.includes(c.id)
      );
      if (fallbackCandidates.length === 0) return null;
      return fallbackCandidates[
        Math.floor(Math.random() * fallbackCandidates.length)
      ];
    }

    // Sort by closest power level and pick randomly from top matches
    candidates.sort(
      (a, b) =>
        Math.abs(a.powerLevel - targetPowerLevel) -
        Math.abs(b.powerLevel - targetPowerLevel)
    );

    // Pick randomly from the closest 3 matches
    const topMatches = candidates.slice(0, Math.min(3, candidates.length));
    return topMatches[Math.floor(Math.random() * topMatches.length)];
  };

  const startBattle = () => {
    if (selectedCreatures.length !== MAX_SELECTION) return;

    const excludeIds = selectedCreatures.map((c) => c.id);
    const newMatchups: Matchup[] = [];
    const opponents: SelectCreature[] = [];

    for (const playerCreature of selectedCreatures) {
      const opponent = findOpponentForPowerLevel(
        playerCreature.powerLevel,
        excludeIds
      );

      if (opponent) {
        excludeIds.push(opponent.id);
        opponents.push(opponent);
        newMatchups.push({
          playerCreature,
          opponentCreature: opponent,
        });
      }
    }

    setMatchups(newMatchups);
    setPhase("battle");

    // Create battle creatures for stats display
    const playerTeam = selectedCreatures.map((c) =>
      createBattleCreature(c, "player")
    );
    const opponentTeam = opponents.map((c) =>
      createBattleCreature(c, "opponent")
    );
    setPlayerBattleTeam(playerTeam);
    setOpponentBattleTeam(opponentTeam);
  };

  const beginBattle = () => {
    // Run battle simulation
    const opponentCreatures = matchups.map((m) => m.opponentCreature);
    const result = simulateBattle(selectedCreatures, opponentCreatures);
    setBattleResult(result);

    // Generate battle report
    const report = generateBattleReport(
      result,
      selectedCreatures.map((c) => c.name),
      opponentCreatures.map((c) => c.name)
    );
    setBattleReport(report);

    setPhase("battling");
  };

  const handleBattleComplete = useCallback(async () => {
    setPhase("results");

    // Save battle result to database
    if (battleResult && battleReport) {
      const winnerTeam =
        battleResult.winner === "player"
          ? playerBattleTeam
          : opponentBattleTeam;
      const loserTeam =
        battleResult.winner === "player"
          ? opponentBattleTeam
          : playerBattleTeam;

      // Get the last round number from actions
      const totalRounds =
        battleResult.actions.length > 0
          ? battleResult.actions[battleResult.actions.length - 1].round
          : 1;

      try {
        await saveBattleResult({
          winnerCreatureId: winnerTeam[0].id,
          loserCreatureId: loserTeam[0].id,
          playerTeamIds: playerBattleTeam.map((c) => c.id),
          opponentTeamIds: opponentBattleTeam.map((c) => c.id),
          totalRounds,
          battleReport: JSON.stringify(battleReport),
        });
      } catch (error) {
        console.error("Failed to save battle result:", error);
      }
    }
  }, [battleResult, battleReport, playerBattleTeam, opponentBattleTeam]);

  const resetDuel = () => {
    setSelectedCreatures([]);
    setMatchups([]);
    setPhase("selection");
    setBattleResult(null);
    setBattleReport(null);
    setPlayerBattleTeam([]);
    setOpponentBattleTeam([]);
    setBattleMode("manual");
  };

  // Battling phase - show animated battle
  if (phase === "battling" && battleResult && battleReport) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Battle in Progress</h2>
        </div>

        <BattleDisplay
          battleResult={battleResult}
          battleReport={battleReport}
          playerTeam={playerBattleTeam}
          opponentTeam={opponentBattleTeam}
          onBattleComplete={handleBattleComplete}
          battleMode={battleMode}
          onModeChange={setBattleMode}
        />
      </div>
    );
  }

  // Results phase - show final results with reset option
  if (phase === "results" && battleResult && battleReport) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Battle Complete</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetDuel}>
              Reset & Pick Again
            </Button>
            <Button disabled className="gap-2">
              <HugeiconsIcon icon={UserMultiple02Icon} className="w-4 h-4" />
              Multiplayer
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </Button>
          </div>
        </div>

        <BattleDisplay
          battleResult={battleResult}
          battleReport={battleReport}
          playerTeam={playerBattleTeam}
          opponentTeam={opponentBattleTeam}
          onBattleComplete={handleBattleComplete}
          battleMode={battleMode}
          onModeChange={setBattleMode}
        />
      </div>
    );
  }

  // Battle phase - show matchups and start button
  if (phase === "battle") {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Battle Matchups</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetDuel}>
              Reset & Pick Again
            </Button>
            <Button disabled className="gap-2">
              <HugeiconsIcon icon={UserMultiple02Icon} className="w-4 h-4" />
              Multiplayer
              <Badge variant="secondary" className="text-xs">
                Coming Soon
              </Badge>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {matchups.map((matchup, index) => {
            const playerStats = playerBattleTeam.find(
              (c) => c.id === matchup.playerCreature.id
            );
            const opponentStats = opponentBattleTeam.find(
              (c) => c.id === matchup.opponentCreature.id
            );
            return (
              <BattleMatchupCard
                key={matchup.playerCreature.id}
                playerCreature={matchup.playerCreature}
                opponentCreature={matchup.opponentCreature}
                matchupIndex={index}
                playerStats={playerStats}
                opponentStats={opponentStats}
              />
            );
          })}
        </div>

        <div className="text-center p-6 bg-muted/50 rounded-lg space-y-4">
          <p className="text-muted-foreground">
            Your team is ready! Choose your battle mode and begin.
          </p>

          {/* Battle mode toggle */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Battle Mode:</span>
            <div className="flex rounded-lg border overflow-hidden">
              <Button
                variant={battleMode === "manual" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setBattleMode("manual")}
              >
                Manual
              </Button>
              <Button
                variant={battleMode === "auto" ? "default" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setBattleMode("auto")}
              >
                Auto
              </Button>
            </div>
          </div>

          <Button onClick={beginBattle} size="lg" className="gap-2">
            <HugeiconsIcon icon={Sword01Icon} className="w-5 h-5" />
            Begin Battle!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Selection header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {selectedCreatures.length} / {MAX_SELECTION}
          </Badge>
          <span className="text-sm text-muted-foreground">
            creatures selected
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={startBattle}
            disabled={selectedCreatures.length !== MAX_SELECTION}
            className="gap-2"
          >
            <HugeiconsIcon icon={Sword01Icon} className="w-4 h-4" />
            Start Battle
          </Button>
          <Button disabled variant="outline" className="gap-2">
            <HugeiconsIcon icon={UserMultiple02Icon} className="w-4 h-4" />
            Multiplayer
            <Badge variant="secondary" className="text-xs">
              Coming Soon
            </Badge>
          </Button>
        </div>
      </div>

      {/* Selected creatures preview */}
      {selectedCreatures.length > 0 && (
        <div className="p-4 border rounded-lg bg-background">
          <h3 className="text-sm font-medium mb-3 text-muted-foreground">
            Your Team
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedCreatures.map((creature) => (
              <Badge
                key={creature.id}
                variant="secondary"
                className="gap-2 py-1.5 px-3 cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                onClick={() => handleCreatureSelect(creature)}
              >
                <span>{creature.name}</span>
                <span className="text-muted-foreground">
                  ⚡{creature.powerLevel.toFixed(1)}
                </span>
                <span className="text-xs">×</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Creature grid */}
      {creatures.length === 0 ? (
        <div className="text-center p-12 bg-muted/50 rounded-lg w-full">
          <p className="text-muted-foreground">
            No creatures found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {creatures.map((creature) => {
            const isSelected = selectedCreatures.some(
              (c) => c.id === creature.id
            );
            const isDisabled =
              !isSelected && selectedCreatures.length >= MAX_SELECTION;

            return (
              <SelectableCreatureCard
                key={creature.id}
                creature={creature}
                isSelected={isSelected}
                onSelect={handleCreatureSelect}
                disabled={isDisabled}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
