import { Github } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import DownloadCardButton from "@/components/download-card-button";
import ShareOnXButton from "@/components/share-on-x-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SelectCreature } from "@/db/schema";
import { getCreatureTopPercentage } from "@/server/creatures";

type CreatureStatsProps = {
  creature: SelectCreature;
  downloadTargetId?: string;
};

export default async function CreatureStats({
  creature,
  downloadTargetId,
}: CreatureStatsProps) {
  const topPercentage = await getCreatureTopPercentage(creature.id);

  return (
    <Card className="w-92 bg-linear-to-b from-primary/6 to-background flex flex-col justify-between min-h-[600px]">
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
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link
                href={creature.githubProfileUrl}
                target="_blank"
                rel="noreferrer"
              >
                <HugeiconsIcon icon={Github} />
              </Link>
            }
          />
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
            <DownloadCardButton
              targetId={downloadTargetId}
              fileName={`${creature.name}.png`}
            />
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
