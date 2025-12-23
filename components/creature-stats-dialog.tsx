"use client";

import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Analytics01Icon } from "@hugeicons/core-free-icons";

type CreatureStatsDialogProps = {
  title?: string;
  triggerText?: string;
  children: React.ReactNode;
};

export default function CreatureStatsDialog({
  title = "Creature stats",
  triggerText = "Stats",
  children,
}: CreatureStatsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2">
            <HugeiconsIcon icon={Analytics01Icon} />
            {triggerText}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md p-0">
        <div className="p-4 border-b">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        </div>
        <div className="p-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
