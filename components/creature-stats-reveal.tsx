"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import CreatureStatsDialog from "@/components/creature-stats-dialog";

type CreatureStatsRevealProps = {
  creatureName: string;
  card: React.ReactNode;
  stats: React.ReactNode;
};

export default function CreatureStatsReveal({
  creatureName,
  card,
  stats,
}: CreatureStatsRevealProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div
          className={cn(
            "relative transition-transform duration-500 ease-out",
            open ? "sm:-translate-x-1" : "sm:translate-x-0"
          )}
        >
          {/* Button sits above the card's top-right corner (doesn't affect layout height) */}
          <div className="absolute -top-10 right-0 z-10 flex justify-end">
            <div className="lg:hidden w-full">
              <CreatureStatsDialog
                title={`${creatureName} stats`}
                triggerText="View stats"
              >
                {stats}
              </CreatureStatsDialog>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex mr-3"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Hide stats" : "Reveal stats"}
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className={cn(
                  "transition-transform duration-300",
                  open ? "rotate-180" : "rotate-0"
                )}
              />
            </Button>
          </div>

          {card}
        </div>

        {/* Desktop slide-in panel */}
        <div
          className={cn(
            "hidden lg:block overflow-hidden",
            "transition-[max-width,opacity,transform] duration-500 ease-out will-change-[max-width,opacity,transform]",
            open
              ? "max-w-[24rem] opacity-100 translate-x-0 pointer-events-auto"
              : "max-w-0 opacity-0 translate-x-2 pointer-events-none"
          )}
        >
          {/* Match `ThreeDCard` hoverPadding so the two panels align */}
          <div className="p-3">{stats}</div>
        </div>
      </div>
    </div>
  );
}
