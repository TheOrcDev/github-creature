import Link from "next/link";

import type { SelectCreature } from "@/db/schema";

import DownloadDropdown from "@/components/download-dropdown";
import ShareOnXButton from "@/components/share-on-x-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCreatureTopPercentage } from "@/server/creatures";

interface CreatureStatsProps {
  creature: SelectCreature;
  downloadTargetId?: string;
}

export default async function CreatureStats({
  creature,
  downloadTargetId,
}: CreatureStatsProps) {
  const topPercentage = await getCreatureTopPercentage(creature.id);

  return (
    <Card className="flex w-full max-w-92 min-h-[600px] flex-col justify-between bg-linear-to-b from-primary/6 to-background">
      <CardHeader className="border-b">
        <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">
          {creature.name}
        </CardTitle>
        <CardDescription className="text-sm text-foreground/75">
          {creature.description}
        </CardDescription>
        <CardAction>
          <Badge variant="secondary" className="whitespace-nowrap">
            Top {topPercentage}%
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex flex-col gap-2">
          <Link
            className={buttonVariants({ size: "sm", variant: "outline" })}
            href={creature.githubProfileUrl}
            rel="noreferrer"
            target="_blank"
          >
            View on GitHub
          </Link>
          <div className="rounded-none border border-border/70 bg-background/40 p-3">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Contributions
            </div>
            <div className="mt-1 text-base font-semibold tabular-nums">
              {creature.contributions}
            </div>
          </div>

          <div className="rounded-none border border-border/70 bg-background/40 p-3">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Followers
            </div>
            <div className="mt-1 text-base font-semibold tabular-nums">
              {creature.followers}
            </div>
          </div>

          <div className="rounded-none border border-border/70 bg-background/40 p-3">
            <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
              Stars
            </div>
            <div className="mt-1 text-base font-semibold tabular-nums">
              {creature.stars}
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="justify-between gap-3">
        <p className="text-sm text-muted-foreground">Share:</p>
        <div className="flex items-center gap-2">
          <ShareOnXButton
            text={`Check out ${creature.name} — my GitHub Creature`}
          />
          {downloadTargetId ? (
            <DownloadDropdown
              targetId={downloadTargetId}
              originalImageUrl={creature.image}
              fileName={creature.name}
            />
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
