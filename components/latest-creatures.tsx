import Link from "next/link";

import { cn } from "@/lib/utils";
import { getTenLatestCreatures } from "@/server/creatures";

import { buttonVariants } from "./ui/button";

export default async function LatestCreatures() {
  const creatures = await getTenLatestCreatures();

  if (creatures.length === 0) {
    return (
      <div className="flex min-h-30 w-full flex-col sm:max-w-lg">
        <h2 className="text-sm">No creatures yet</h2>
      </div>
    );
  }

  return (
    <div className="flex min-h-30 w-full flex-col sm:max-w-lg">
      <h2 className="text-sm">Latest Creatures</h2>
      <div className="flex flex-wrap gap-2">
        {creatures.map((creature) => {
          const username = creature.githubProfileUrl.split("/").pop();

          return (
            <Link
              key={creature.id}
              className={cn(buttonVariants(), "w-24")}
              href={`/${username}`}
            >
              <span className="truncate">{username}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
