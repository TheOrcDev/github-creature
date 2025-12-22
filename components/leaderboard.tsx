import { getLeaderboard } from "@/server/creatures";
import Link from "next/link";
import { Button } from "./ui/button";

export default async function Leaderboard() {
  const leaderboard = await getLeaderboard();

  return (
    <div className="w-full">
      <h1>Leaderboard</h1>
      <div className="flex flex-col gap-2">
        {leaderboard.map((creature, index) => (
          <Link
            key={creature.id}
            href={`/${creature.githubProfileUrl.split("/").pop()}`}
          >
            <div className="bg-primary/10 hover:bg-primary/20 transition-all duration-300 p-4 flex gap-2 items-center justify-between">
              <p>
                {index + 1}. {creature.name} ({creature.contributions}{" "}
                contributions)
              </p>
              <Button>View</Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
