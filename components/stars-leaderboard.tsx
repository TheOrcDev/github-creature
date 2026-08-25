import Link from "next/link";

import { getStarsLeaderboard } from "@/server/creatures";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default async function StarsLeaderboard() {
  const leaderboard = await getStarsLeaderboard();

  return (
    <Card size="sm" className="w-full">
      <CardHeader className="border-b">
        <CardTitle>Stars</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {leaderboard.map((creature, index) => (
            <Link
              key={creature.id}
              className="flex h-9 items-center justify-between gap-2 bg-primary/10 px-2 transition-all duration-300 hover:bg-primary/20"
              href={`/${creature.githubProfileUrl.split("/").pop()}`}
            >
              <p className="min-w-0 flex-1 truncate text-xs">
                {index + 1}. {creature.name} ({creature.stars} stars)
              </p>
              <span className="text-xs font-medium">View</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
