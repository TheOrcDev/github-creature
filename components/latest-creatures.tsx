import { Button } from "./ui/button";
import Link from "next/link";
import { getTenLatestCreatures } from "@/server/creatures";

export default async function LatestCreatures() {
  const creatures = await getTenLatestCreatures();

  return (
    <div className="flex flex-col w-full sm:max-w-lg min-h-30">
      <h2 className="text-sm">Latest Creatures</h2>
      <div className="flex flex-wrap gap-2">
        {creatures.map((creature) => (
          <Link
            key={creature.id}
            href={`/creature/${creature.githubProfileUrl.split("/").pop()}`}
          >
            <Button className="min-w-24">
              {creature.githubProfileUrl.split("/").pop()}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
