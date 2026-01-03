"use client";

import { Analytics01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

type CreatureStatsDialogProps = {
  triggerText?: string;
  children: React.ReactNode;
};

export default function CreatureStatsDialog({
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
        <div className="p-4 flex flex-col gap-4 justify-center items-center">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
