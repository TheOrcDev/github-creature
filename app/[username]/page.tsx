import CreatureCard from "@/components/creature-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCreatureByGithubUsername } from "@/server/creatures";
import { Metadata } from "next";
import { Suspense } from "react";

type Params = Promise<{ username: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { username } = await params;

  const creature = await getCreatureByGithubUsername(username.toLowerCase());

  return {
    title: `${creature?.name} - ${creature?.githubProfileUrl
      .split("/")
      .pop()}'s GitHub Creature`,
    description: creature?.description,
    openGraph: {
      images: [creature?.image ?? "/github-creature-logo.png"],
    },
  };
}

export default async function CreaturePage({ params }: { params: Params }) {
  return (
    <main className="flex p-5 max-w-2xl mt-10 w-full mx-auto flex-col items-center justify-center gap-5 h-[90vh]">
      <Suspense fallback={<Skeleton className="h-96 w-72" />}>
        <CreatureCard params={params} />
      </Suspense>
    </main>
  );
}
