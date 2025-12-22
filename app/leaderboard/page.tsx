import ContributionLeaderboard from "@/components/contribution-leaderboard";
import FollowersLeaderboard from "@/components/followers-leaderboard";
import StarsLeaderboard from "@/components/stars-leaderboard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "GitHub Creature - Leaderboard",
  description: "View the leaderboard of the most powerful creatures on GitHub.",
};

function LeaderboardSkeleton() {
  return (
    <Card size="sm" className="w-full">
      <CardHeader className="border-b">
        <Skeleton className="h-4 w-42" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 w-full">
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} className="h-9 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function LeaderboardPage() {
  return (
    <main className="flex flex-col items-center justify-start min-h-screen gap-6 max-w-6xl mx-auto px-2 py-10 w-full mt-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full items-start">
        <Suspense fallback={<LeaderboardSkeleton />}>
          <ContributionLeaderboard />
        </Suspense>

        <Suspense fallback={<LeaderboardSkeleton />}>
          <FollowersLeaderboard />
        </Suspense>

        <Suspense fallback={<LeaderboardSkeleton />}>
          <StarsLeaderboard />
        </Suspense>
      </div>
    </main>
  );
}
