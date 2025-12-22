import Leaderboard from "@/components/leaderboard";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "GitHub Creature - Leaderboard",
  description: "View the leaderboard of the most powerful creatures on GitHub.",
};

export default function LeaderboardPage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-5 max-w-2xl mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <Leaderboard />
      </Suspense>
    </main>
  );
}
