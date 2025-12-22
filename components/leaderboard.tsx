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
          <div
            className="bg-primary/10 p-4 flex gap-2 items-center justify-between"
            key={creature.id}
          >
            <p>
              {index + 1}. {creature.name}
            </p>
            <Link href={`/${creature.githubProfileUrl.split("/").pop()}`}>
              <Button>View</Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
