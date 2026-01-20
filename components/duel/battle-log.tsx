"use client";

import { useEffect, useRef } from "react";

import type { BattleReport, BattleLogEntry } from "@/lib/battle-engine";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type BattleLogProps = {
  report: BattleReport;
  currentActionIndex: number;
  isComplete: boolean;
};

function LogEntry({
  entry,
  isVisible,
}: {
  entry: BattleLogEntry;
  isVisible: boolean;
}) {
  if (!isVisible) return null;

  const isPlayerAction = entry.attackerTeam === "player";
  const hpPercent = (entry.targetHpAfter / entry.targetMaxHp) * 100;

  return (
    <div
      className={cn(
        "flex items-start gap-2 py-1.5 px-2 rounded text-sm transition-opacity",
        isPlayerAction ? "bg-blue-500/10" : "bg-red-500/10",
        entry.isKnockout && "ring-1 ring-yellow-500/50"
      )}
    >
      <span
        className={cn(
          "font-semibold shrink-0",
          isPlayerAction ? "text-blue-500" : "text-red-500"
        )}
      >
        {entry.attackerName}
      </span>
      <span className="text-muted-foreground">attacks</span>
      <span
        className={cn(
          "font-semibold",
          entry.targetTeam === "player" ? "text-blue-500" : "text-red-500"
        )}
      >
        {entry.targetName}
      </span>
      <span className="text-muted-foreground">for</span>
      <span className="font-bold text-orange-500">{entry.damage}</span>
      <span className="text-muted-foreground">damage</span>
      <span
        className={cn(
          "text-xs ml-auto shrink-0",
          hpPercent > 50
            ? "text-green-500"
            : hpPercent > 25
              ? "text-yellow-500"
              : "text-red-500"
        )}
      >
        ({entry.targetHpAfter}/{entry.targetMaxHp})
      </span>
      {entry.isKnockout && (
        <Badge variant="destructive" className="text-xs ml-1 shrink-0">
          KO
        </Badge>
      )}
    </div>
  );
}

export default function BattleLog({
  report,
  currentActionIndex,
  isComplete,
}: BattleLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest action
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [currentActionIndex]);

  // Group log entries by round
  const groupedByRound = report.log.reduce(
    (acc, entry) => {
      if (!acc[entry.round]) {
        acc[entry.round] = [];
      }
      acc[entry.round].push(entry);
      return acc;
    },
    {} as Record<number, BattleLogEntry[]>
  );

  const rounds = Object.keys(groupedByRound)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="flex flex-col h-full border rounded-lg bg-background/50 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b bg-muted/30">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1">
            <span className="text-blue-500 font-semibold">You:</span>
            <span className="text-muted-foreground truncate">
              {report.playerTeamNames.join(", ")}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-red-500 font-semibold">Foe:</span>
            <span className="text-muted-foreground truncate">
              {report.opponentTeamNames.join(", ")}
            </span>
          </div>
        </div>
      </div>

      {/* Log entries */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-3">
        {rounds.map((round) => {
          const entries = groupedByRound[round];
          const firstEntryTimestamp = entries[0]?.timestamp ?? 0;

          // Only show round if at least one entry is visible
          const hasVisibleEntry = entries.some(
            (e) => isComplete || e.timestamp <= currentActionIndex
          );

          if (!hasVisibleEntry) return null;

          return (
            <div key={round} className="space-y-1">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Round {round}
              </div>
              {entries.map((entry) => (
                <LogEntry
                  key={entry.timestamp}
                  entry={entry}
                  isVisible={isComplete || entry.timestamp <= currentActionIndex}
                />
              ))}
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Footer */}
      <div className="p-2 border-t bg-muted/30">
        {isComplete ? (
          <div
            className={cn(
              "text-center text-sm font-semibold",
              report.winner === "player" ? "text-green-500" : "text-red-500"
            )}
          >
            {report.winner === "player" ? "Victory!" : "Defeat!"} -{" "}
            {report.totalRounds} rounds, {report.totalActions} actions
          </div>
        ) : (
          <div className="text-center text-xs text-muted-foreground">
            Action {currentActionIndex + 1} of {report.totalActions}
          </div>
        )}
      </div>
    </div>
  );
}
