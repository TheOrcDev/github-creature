import Link from "next/link";

import { getTenLatestCreatures } from "@/server/creatures";

import { Button } from "./ui/button";

export default async function LatestCreatures() {
  const creatures = await getTenLatestCreatures();

  return (
    <div className="flex flex-col w-full sm:max-w-lg min-h-30">
      <h2 className="text-sm">Latest Creatures</h2>
      <div className="flex flex-wrap gap-2">
        {creatures.map((creature) => (
          <Link
            key={creature.id}
            href={`/${creature.githubProfileUrl.split("/").pop()}`}
          >
            <Button className="w-24">
              <span className="truncate">
                {creature.githubProfileUrl.split("/").pop()}
              </span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
