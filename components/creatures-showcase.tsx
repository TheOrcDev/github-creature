"use cache";

import { cn } from "@/lib/utils";

import CreatureCard from "./creature-card";

const showcaseSlotClassName =
  "relative min-w-0 origin-bottom [transform-style:preserve-3d] motion-reduce:rotate-0";

// Next.js `"use cache"` requires an async function even without await.
// oxlint-disable-next-line require-await
export default async function CreaturesShowcase() {
  return (
    <div className="w-full min-w-0 overflow-x-clip px-1">
      <div className="relative mx-auto flex w-full max-w-5xl items-end justify-center pt-6 pb-4 [perspective:1400px]">
        <div
          className={cn(
            showcaseSlotClassName,
            "z-0 w-[36%] -mr-[10%] -rotate-6 scale-[0.86] -rotate-y-12",
            "motion-reduce:scale-90"
          )}
        >
          <CreatureCard username="webdevcody" />
        </div>
        <div
          className={cn(
            showcaseSlotClassName,
            "z-10 w-[46%] scale-[1.08] drop-shadow-xl",
            "motion-reduce:scale-100 motion-reduce:drop-shadow-none"
          )}
        >
          <CreatureCard username="shadcn" />
        </div>
        <div
          className={cn(
            showcaseSlotClassName,
            "z-0 w-[36%] -ml-[10%] rotate-6 scale-[0.86] rotate-y-12",
            "motion-reduce:scale-90"
          )}
        >
          <CreatureCard username="franky47" />
        </div>
      </div>
    </div>
  );
}
