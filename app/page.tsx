import { SubmitGithubForm } from "@/components/forms/github-form";
import LatestCreatures from "@/components/latest-creatures";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

export default async function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-5">
      <h1>Summon the Creature Behind Your Code</h1>
      <SubmitGithubForm />

      <Suspense
        fallback={
          <div className="flex flex-col gap-2 min-h-30">
            <Skeleton className="h-2 w-20 mt-3" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-24" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-7 w-24" />
            </div>
          </div>
        }
      >
        <LatestCreatures />
      </Suspense>
    </main>
  );
}
