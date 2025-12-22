import Leaderboard from "@/components/leaderboard";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "GitHub Creature - Leaderboard",
  description: "View the leaderboard of the most powerful creatures on GitHub.",
};

export default function LeaderboardPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-5 max-w-2xl mx-auto">
      <Suspense
        fallback={
          <div className="flex flex-col gap-2 w-full mt-14">
            <Skeleton className="h-4 w-42" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        }
      >
        <Leaderboard />
      </Suspense>
    </main>
  );
}
