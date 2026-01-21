"use client";

import {
  FavouriteIcon,
  UserGroupIcon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

import type { SelectCreature } from "@/db/schema";

import { SubtypeBadgeList } from "@/components/subtype-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseSubtypes } from "@/lib/type-effectiveness";
import { cn } from "@/lib/utils";

function getPowerLevelColor(powerLevel: number): string {
  if (powerLevel >= 10) return "from-purple-500 to-fuchsia-500";
  if (powerLevel >= 9) return "from-gray-400 to-gray-600";
  if (powerLevel >= 6) return "from-red-500 to-rose-500";
  if (powerLevel >= 4) return "from-orange-500 to-amber-500";
  if (powerLevel >= 2) return "from-emerald-500 to-lime-500";
  return "from-slate-400 to-slate-500";
}

function getPowerLevelBorder(powerLevel: number): string {
  if (powerLevel >= 10) return "border-purple-500/50";
  if (powerLevel >= 9) return "border-gray-500/50";
  if (powerLevel >= 6) return "border-red-500/50";
  if (powerLevel >= 4) return "border-orange-500/50";
  if (powerLevel >= 2) return "border-emerald-500/50";
  return "border-border";
}

type SelectableCreatureCardProps = {
  creature: SelectCreature;
  isSelected: boolean;
  onSelect: (creature: SelectCreature) => void;
  disabled?: boolean;
};

export default function SelectableCreatureCard({
  creature,
  isSelected,
  onSelect,
  disabled = false,
}: SelectableCreatureCardProps) {
  const username = creature.githubProfileUrl.split("/").pop() || "";

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 cursor-pointer",
        getPowerLevelBorder(creature.powerLevel),
        isSelected &&
          "ring-2 ring-primary ring-offset-2 ring-offset-background",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "hover:shadow-lg hover:-translate-y-1"
      )}
      onClick={() => !disabled && onSelect(creature)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute left-3 top-3 z-10">
          <div className="bg-primary rounded-full p-1">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="w-5 h-5 text-primary-foreground"
            />
          </div>
        </div>
      )}

      {/* Power Level Badge */}
      <div className="absolute right-3 top-3 z-10">
        <Badge
          className={cn(
            "bg-linear-to-r font-semibold text-white",
            getPowerLevelColor(creature.powerLevel)
          )}
        >
          ⚡ {creature.powerLevel.toFixed(1)}
        </Badge>
      </div>

      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden">
          <Image
            src={creature.image}
            alt={creature.name}
            width={300}
            height={300}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </CardHeader>

      <CardContent className="p-3 space-y-2">
        <div>
          <CardTitle className="text-sm font-bold leading-tight mb-0.5">
            {creature.name}
          </CardTitle>
          <p className="text-xs text-muted-foreground font-mono">@{username}</p>
        </div>

        {/* Subtypes */}
        <SubtypeBadgeList subtypes={parseSubtypes(creature.subtypes)} />

        {/* Quick Stats */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={UserGroupIcon} className="w-3 h-3" />
            <span>{creature.followers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={FavouriteIcon} className="w-3 h-3" />
            <span>{creature.stars.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
