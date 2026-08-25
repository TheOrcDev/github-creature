import type { Metadata } from "next";

import { Suspense } from "react";

import {
  GithubFormFallback,
  SubmitGithubForm,
} from "@/components/forms/github-form";
import LatestCreatures from "@/components/latest-creatures";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  description:
    "Generate a creature based on your GitHub profile. Just enter your GitHub profile URL and get your inner creature.",
  title: "GitHub Creature - Summon your code creature",
};

export default function Page() {
  return (
    <main className="flex flex-col items-center justify-center h-screen gap-5 px-2">
      <Suspense fallback={<GithubFormFallback />}>
        <SubmitGithubForm />
      </Suspense>

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
