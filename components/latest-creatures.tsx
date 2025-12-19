import { SelectCreature } from "@/db/schema";
import { Button } from "./ui/button";
import Link from "next/link";

type LatestCreaturesProps = {
  creatures: SelectCreature[];
};

export default function LatestCreatures({ creatures }: LatestCreaturesProps) {
  return (
    <div className="flex flex-col w-full sm:max-w-lg">
      <h2 className="text-sm">Latest Creatures</h2>
      <div className="flex flex-wrap gap-2">
        {creatures.map((creature) => (
          <Link key={creature.id} href={`/creature/${creature.id}`}>
            <Button className="min-w-24">
              {creature.githubProfileUrl.split("/").pop()}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
