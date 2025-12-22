import { getStarsLeaderboard } from "@/server/creatures";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";

export default async function StarsLeaderboard() {
  const leaderboard = await getStarsLeaderboard();

  return (
    <Card size="sm" className="w-full">
      <CardHeader className="border-b">
        <CardTitle>Stars Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {leaderboard.map((creature, index) => (
            <Link
              key={creature.id}
              href={`/${creature.githubProfileUrl.split("/").pop()}`}
            >
              <div className="bg-primary/10 hover:bg-primary/20 transition-all duration-300 h-9 px-2 flex gap-2 items-center justify-between">
                <p className="text-xs flex-1 min-w-0 truncate">
                  {index + 1}. {creature.name} ({creature.stars} stars)
                </p>
                <Button size="xs">View</Button>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
