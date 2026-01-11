import { Metadata } from "next";
import { Suspense } from "react";

import CreatureCard from "@/components/creature-card";
import { Skeleton } from "@/components/ui/skeleton";
import { getCreatureByGithubUsername } from "@/server/creatures";

type Params = Promise<{ username: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { username } = await params;

  const creature = await getCreatureByGithubUsername(username.toLowerCase());

  const ogImage = creature?.image ?? "/github-creature-logo.png";
  const title = creature?.name
    ? `${creature.name} - ${creature.githubProfileUrl
        .split("/")
        .pop()}'s GitHub Creature`
    : "GitHub Creature";

  return {
    title,
    description:
      creature?.description ??
      "Generate a creature based on your GitHub profile.",
    openGraph: {
      title,
      description:
        creature?.description ??
        "Generate a creature based on your GitHub profile.",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: creature?.name
            ? `${creature.name} (GitHub Creature)`
            : "GitHub Creature",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description:
        creature?.description ??
        "Generate a creature based on your GitHub profile.",
      images: [ogImage],
    },
  };
}

export default async function CreaturePage({ params }: { params: Params }) {
  const { username } = await params;

  return (
    <main className="flex p-5 max-w-2xl mt-20 w-full mx-auto flex-col items-center justify-center gap-5 h-[90vh]">
      <Suspense fallback={<Skeleton className="h-96 w-72" />}>
        <CreatureCard username={username} />
      </Suspense>
    </main>
  );
}
