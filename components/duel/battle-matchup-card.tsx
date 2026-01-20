"use client";

import { Sword01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

import type { SelectCreature } from "@/db/schema";
import type { BattleCreature } from "@/lib/battle-engine";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function getPowerLevelColor(powerLevel: number): string {
  if (powerLevel >= 10) return "from-purple-500 to-fuchsia-500";
  if (powerLevel >= 9) return "from-gray-400 to-gray-600";
  if (powerLevel >= 6) return "from-red-500 to-rose-500";
  if (powerLevel >= 4) return "from-orange-500 to-amber-500";
  if (powerLevel >= 2) return "from-emerald-500 to-lime-500";
  return "from-slate-400 to-slate-500";
}

type MiniCreatureCardProps = {
  creature: SelectCreature;
  label: string;
  stats?: BattleCreature;
};

function MiniCreatureCard({ creature, label, stats }: MiniCreatureCardProps) {
  const username = creature.githubProfileUrl.split("/").pop() || "";

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="relative">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 border-border">
          <Image
            src={creature.image}
            alt={creature.name}
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
        </div>
        <Badge
          className={cn(
            "absolute -bottom-2 left-1/2 -translate-x-1/2 bg-linear-to-r font-semibold text-white text-xs",
            getPowerLevelColor(creature.powerLevel)
          )}
        >
          ⚡ {creature.powerLevel.toFixed(1)}
        </Badge>
      </div>
      <div className="text-center mt-1">
        <p className="text-sm font-semibold truncate max-w-[100px]">
          {creature.name}
        </p>
        <p className="text-xs text-muted-foreground font-mono">@{username}</p>
      </div>
      {stats && (
        <div className="flex flex-wrap justify-center gap-1 mt-1">
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            HP {stats.maxHp}
          </Badge>
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            ATK {stats.atk}
          </Badge>
          <Badge variant="outline" className="text-xs px-1.5 py-0">
            DEF {stats.def}
          </Badge>
        </div>
      )}
    </div>
  );
}

type BattleMatchupCardProps = {
  playerCreature: SelectCreature;
  opponentCreature: SelectCreature;
  matchupIndex: number;
  playerStats?: BattleCreature;
  opponentStats?: BattleCreature;
};

export default function BattleMatchupCard({
  playerCreature,
  opponentCreature,
  matchupIndex,
  playerStats,
  opponentStats,
}: BattleMatchupCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="text-center mb-3">
          <Badge variant="outline" className="text-xs">
            Match {matchupIndex + 1}
          </Badge>
        </div>
        <div className="flex items-center justify-center gap-4 sm:gap-6">
          <MiniCreatureCard
            creature={playerCreature}
            label="You"
            stats={playerStats}
          />

          <div className="flex flex-col items-center gap-1">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              <HugeiconsIcon
                icon={Sword01Icon}
                className="w-5 h-5 text-muted-foreground"
              />
            </div>
            <span className="text-xs font-bold text-muted-foreground">VS</span>
          </div>

          <MiniCreatureCard
            creature={opponentCreature}
            label="Opponent"
            stats={opponentStats}
          />
        </div>
      </CardContent>
    </Card>
  );
}
