import { SubmitGithubForm } from "@/components/forms/github-form";
import LatestCreatures from "@/components/latest-creatures";
import { Skeleton } from "@/components/ui/skeleton";
import { getSixLatestCreatures } from "@/server/creatures";
import { Suspense } from "react";

export default async function Page() {
  const creatures = await getSixLatestCreatures();

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-5">
      <h1>Summon the Creature Behind Your Code</h1>
      <SubmitGithubForm />

      <Suspense
        fallback={
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-20" />
          </div>
        }
      >
        <LatestCreatures creatures={creatures} />
      </Suspense>
    </main>
  );
}
