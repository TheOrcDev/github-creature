import { SelectCreature } from "@/db/schema";
import { Button } from "./ui/button";
import Link from "next/link";

type LatestCreaturesProps = {
  creatures: SelectCreature[];
};

export default function LatestCreatures({ creatures }: LatestCreaturesProps) {
  return (
    <div className="w-full sm:max-w-lg">
      <h2>Latest Creatures</h2>
      <div className="flex flex-wrap gap-2">
        {creatures.map((creature) => (
          <Button
            key={creature.id}
            nativeButton={false}
            render={
              <Link href={`/creature/${creature.id}`}>
                {creature.githubProfileUrl.split("/").pop()}
              </Link>
            }
          />
        ))}
      </div>
    </div>
  );
}
