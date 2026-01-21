import {
  ArrowRight01Icon,
  Github,
  FavouriteIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

import type { SelectCreature } from "@/db/schema";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

type CreatureGridCardProps = {
  creature: SelectCreature;
};

export default function CreatureGridCard({ creature }: CreatureGridCardProps) {
  const username = creature.githubProfileUrl.split("/").pop() || "";
  const truncatedDescription =
    creature.description.length > 120
      ? `${creature.description.slice(0, 120)}...`
      : creature.description;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
        getPowerLevelBorder(creature.powerLevel)
      )}
    >
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
            width={400}
            height={400}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div>
          <CardTitle className="text-lg font-bold leading-tight mb-1">
            {creature.name}
          </CardTitle>
          <p className="text-xs text-muted-foreground font-mono">@{username}</p>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {truncatedDescription}
        </p>

        {/* Quick Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground pt-2">
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={UserGroupIcon} className="w-3.5 h-3.5" />
            <span>{creature.followers.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <HugeiconsIcon icon={FavouriteIcon} className="w-3.5 h-3.5" />
            <span>{creature.stars.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-semibold">
              {creature.contributions.toLocaleString()}
            </span>
            <span>contrib</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link href={`/${username}`} className="flex-1">
          <Button variant="default" size="sm" className="w-full group/btn">
            <span>View Details</span>
            <HugeiconsIcon
              icon={ArrowRight01Icon}
              className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5"
            />
          </Button>
        </Link>
        <Link href={creature.githubProfileUrl} target="_blank" rel="noreferrer">
          <Button variant="outline" size="sm">
            <HugeiconsIcon icon={Github} className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
