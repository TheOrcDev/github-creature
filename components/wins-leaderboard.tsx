import Link from "next/link";

import { getWinsLeaderboard } from "@/server/creatures";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default async function WinsLeaderboard() {
  const leaderboard = await getWinsLeaderboard();

  if (leaderboard.length === 0) {
    return (
      <Card size="sm" className="w-full">
        <CardHeader className="border-b">
          <CardTitle>Battle Wins</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No battles recorded yet. Be the first to battle!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="sm" className="w-full">
      <CardHeader className="border-b">
        <CardTitle>Battle Wins</CardTitle>
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
                  {index + 1}. {creature.name} ({creature.wins}{" "}
                  {creature.wins === 1 ? "win" : "wins"})
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
