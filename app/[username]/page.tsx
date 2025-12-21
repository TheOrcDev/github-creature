import CreatureCard from "@/components/creature-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";

type Params = Promise<{ username: string }>;

export default async function CreaturePage({ params }: { params: Params }) {
  return (
    <main className="flex p-5 max-w-2xl mt-10 w-full mx-auto flex-col items-center justify-center gap-5">
      <Suspense fallback={<Skeleton className="h-96 w-72" />}>
        <CreatureCard params={params} />
      </Suspense>
    </main>
  );
}
