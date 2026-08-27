"use client";

import { Analytics01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CreatureStatsDialogProps {
  triggerText?: string;
  children: React.ReactNode;
}

export default function CreatureStatsDialog({
  triggerText = "Stats",
  children,
}: CreatureStatsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2 bg-background text-foreground shadow-sm"
          >
            <HugeiconsIcon data-icon="inline-start" icon={Analytics01Icon} />
            {triggerText}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md p-0">
        <DialogTitle className="sr-only">Creature stats</DialogTitle>
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
