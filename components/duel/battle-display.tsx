"use client";

import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

import type {
  BattleCreature,
  BattleAction,
  BattleResult,
  BattleReport,
} from "@/lib/battle-engine";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import BattleLog from "./battle-log";

const ACTION_DELAY_MS = 800;

type BattleCreatureCardProps = {
  creature: BattleCreature;
  currentHp: number;
  isAttacking: boolean;
  isTargeted: boolean;
  damageReceived: number | null;
};

function BattleCreatureCard({
  creature,
  currentHp,
  isAttacking,
  isTargeted,
  damageReceived,
}: BattleCreatureCardProps) {
  const hpPercent = (currentHp / creature.maxHp) * 100;
  const isKnockedOut = currentHp <= 0;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-300",
        isAttacking && "border-yellow-500 bg-yellow-500/10 scale-105",
        isTargeted && !isKnockedOut && "border-red-500 bg-red-500/10",
        isKnockedOut && "opacity-50 grayscale",
        !isAttacking && !isTargeted && !isKnockedOut && "border-border"
      )}
    >
      {/* Damage popup */}
      {damageReceived !== null && (
        <div className="absolute -top-2 right-0 animate-bounce text-red-500 font-bold text-lg z-10">
          -{damageReceived}
        </div>
      )}

      {/* Knockout badge */}
      {isKnockedOut && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Badge variant="destructive" className="text-sm font-bold">
            KO
          </Badge>
        </div>
      )}

      {/* Creature image */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden">
        <Image
          src={creature.image}
          alt={creature.name}
          width={80}
          height={80}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Name */}
      <p className="text-xs font-semibold truncate max-w-[80px] text-center">
        {creature.name}
      </p>

      {/* HP bar */}
      <div className="w-full space-y-1">
        <div className="flex justify-between text-xs">
          <span>HP</span>
          <span>
            {currentHp}/{creature.maxHp}
          </span>
        </div>
        <Progress
          value={hpPercent}
          className={cn(
            "h-2",
            hpPercent > 50
              ? "[&>div]:bg-green-500"
              : hpPercent > 25
                ? "[&>div]:bg-yellow-500"
                : "[&>div]:bg-red-500"
          )}
        />
      </div>

      {/* Stats */}
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span title="Attack">ATK {creature.atk}</span>
        <span title="Defense">DEF {creature.def}</span>
      </div>
    </div>
  );
}

type TeamDisplayProps = {
  creatures: BattleCreature[];
  hpMap: Map<string, number>;
  attackerId: string | null;
  targetId: string | null;
  damageMap: Map<string, number>;
  label: string;
  isLeft: boolean;
};

function TeamDisplay({
  creatures,
  hpMap,
  attackerId,
  targetId,
  damageMap,
  label,
  isLeft,
}: TeamDisplayProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isLeft ? "items-start" : "items-end"
      )}
    >
      <Badge variant="outline" className="text-sm font-semibold">
        {label}
      </Badge>
      <div
        className={cn(
          "flex gap-2 sm:gap-3",
          isLeft ? "flex-row" : "flex-row-reverse"
        )}
      >
        {creatures.map((creature) => (
          <BattleCreatureCard
            key={creature.id}
            creature={creature}
            currentHp={hpMap.get(creature.id) ?? creature.maxHp}
            isAttacking={attackerId === creature.id}
            isTargeted={targetId === creature.id}
            damageReceived={damageMap.get(creature.id) ?? null}
          />
        ))}
      </div>
    </div>
  );
}

type BattleDisplayProps = {
  battleResult: BattleResult;
  battleReport: BattleReport;
  playerTeam: BattleCreature[];
  opponentTeam: BattleCreature[];
  onBattleComplete: () => void;
  battleMode: "auto" | "manual";
  onModeChange: (mode: "auto" | "manual") => void;
};

export default function BattleDisplay({
  battleResult,
  battleReport,
  playerTeam,
  opponentTeam,
  onBattleComplete,
  battleMode,
  onModeChange,
}: BattleDisplayProps) {
  const [currentActionIndex, setCurrentActionIndex] = useState(-1);
  const [hpMap, setHpMap] = useState<Map<string, number>>(() => {
    const map = new Map<string, number>();
    [...playerTeam, ...opponentTeam].forEach((c) => map.set(c.id, c.maxHp));
    return map;
  });
  const [attackerId, setAttackerId] = useState<string | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);
  const [damageMap, setDamageMap] = useState<Map<string, number>>(new Map());
  const [battleComplete, setBattleComplete] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [showLog, setShowLog] = useState(true);

  const processAction = useCallback((action: BattleAction) => {
    // Set attacker and target highlights
    setAttackerId(action.attacker.id);
    setTargetId(action.target.id);
    setCurrentRound(action.round);

    // Show damage
    setDamageMap(new Map([[action.target.id, action.damage]]));

    // Update HP after a short delay for visual effect
    setTimeout(() => {
      setHpMap((prev) => {
        const newMap = new Map(prev);
        newMap.set(action.target.id, action.targetHpAfter);
        return newMap;
      });
    }, 200);

    // Clear highlights after showing
    setTimeout(() => {
      setDamageMap(new Map());
    }, 600);
  }, []);

  const stepNextAction = useCallback(() => {
    if (battleComplete) return;

    const nextIndex = currentActionIndex + 1;

    if (nextIndex >= battleResult.actions.length) {
      setAttackerId(null);
      setTargetId(null);
      setBattleComplete(true);
      onBattleComplete();
      return;
    }

    setCurrentActionIndex(nextIndex);
    processAction(battleResult.actions[nextIndex]);
  }, [
    currentActionIndex,
    battleResult.actions,
    battleComplete,
    processAction,
    onBattleComplete,
  ]);

  useEffect(() => {
    if (battleComplete || battleMode === "manual" || isPaused) return;

    const timer = setTimeout(
      () => {
        stepNextAction();
      },
      currentActionIndex === -1 ? 500 : ACTION_DELAY_MS
    );

    return () => clearTimeout(timer);
  }, [
    currentActionIndex,
    battleComplete,
    battleMode,
    isPaused,
    stepNextAction,
  ]);

  return (
    <div className="w-full space-y-6">
      {/* Round indicator */}
      <div className="text-center">
        <Badge variant="secondary" className="text-lg px-4 py-1">
          {battleComplete
            ? `${battleResult.winner === "player" ? "Victory!" : "Defeat!"}`
            : `Round ${currentRound}`}
        </Badge>
      </div>

      {/* Battle arena */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-8 p-4 bg-muted/30 rounded-lg">
        <TeamDisplay
          creatures={playerTeam}
          hpMap={hpMap}
          attackerId={attackerId}
          targetId={targetId}
          damageMap={damageMap}
          label="Your Team"
          isLeft={true}
        />

        {/* VS indicator */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-xl font-bold">VS</span>
          </div>
        </div>

        <TeamDisplay
          creatures={opponentTeam}
          hpMap={hpMap}
          attackerId={attackerId}
          targetId={targetId}
          damageMap={damageMap}
          label="Opponents"
          isLeft={false}
        />
      </div>

      {/* Battle log / current action */}
      {!battleComplete && currentActionIndex >= 0 && (
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <p className="text-sm">
            <span className="font-semibold">
              {battleResult.actions[currentActionIndex].attacker.name}
            </span>{" "}
            attacks{" "}
            <span className="font-semibold">
              {battleResult.actions[currentActionIndex].target.name}
            </span>{" "}
            for{" "}
            <span className="text-red-500 font-bold">
              {battleResult.actions[currentActionIndex].damage}
            </span>{" "}
            damage!
            {battleResult.actions[currentActionIndex].isKnockout && (
              <span className="text-destructive font-bold ml-2">KNOCKOUT!</span>
            )}
          </p>
        </div>
      )}

      {/* Victory message */}
      {battleComplete && (
        <div
          className={cn(
            "text-center p-6 rounded-lg",
            battleResult.winner === "player"
              ? "bg-green-500/10 border border-green-500/30"
              : "bg-red-500/10 border border-red-500/30"
          )}
        >
          <h3
            className={cn(
              "text-2xl font-bold mb-2",
              battleResult.winner === "player"
                ? "text-green-500"
                : "text-red-500"
            )}
          >
            {battleResult.winner === "player" ? "Victory!" : "Defeat!"}
          </h3>
          <p className="text-muted-foreground">
            {battleResult.winner === "player"
              ? "Your team has defeated all opponents!"
              : "Your team has been defeated!"}
          </p>
        </div>
      )}

      {/* Battle controls */}
      {!battleComplete && (
        <div className="flex items-center justify-center gap-3">
          {battleMode === "manual" ? (
            <>
              <Button onClick={stepNextAction} size="sm">
                Next Action
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onModeChange("auto")}
              >
                Auto-Play
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsPaused(false);
                  onModeChange("manual");
                }}
              >
                Manual Mode
              </Button>
            </>
          )}
        </div>
      )}

      {/* Progress indicator */}
      {!battleComplete && (
        <div className="text-center text-xs text-muted-foreground">
          Action {currentActionIndex + 1} of {battleResult.actions.length}
        </div>
      )}

      {/* Battle Log */}
      <div className="space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLog(!showLog)}
          className="w-full justify-between"
        >
          <span>Battle Log</span>
          <span className="text-muted-foreground">{showLog ? "▼" : "▶"}</span>
        </Button>
        {showLog && (
          <div className="h-64">
            <BattleLog
              report={battleReport}
              currentActionIndex={currentActionIndex}
              isComplete={battleComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
