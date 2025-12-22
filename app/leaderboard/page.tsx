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
    <main className="flex flex-col items-center justify-center h-screen gap-5 max-w-2xl mx-auto px-2">
      <Suspense
        fallback={
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-4 w-42" />
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full" />
            ))}
          </div>
        }
      >
        <Leaderboard />
      </Suspense>
    </main>
  );
}
