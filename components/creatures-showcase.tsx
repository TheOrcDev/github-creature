"use cache";

import CreatureCard from "./creature-card";

// Next.js `"use cache"` requires an async function even without await.
// oxlint-disable-next-line require-await
export default async function CreaturesShowcase() {
  return (
    <div className="flex w-full min-w-0 flex-wrap justify-center gap-2">
      <div className="hidden lg:block">
        <CreatureCard username="webdevcody" />
      </div>
      <CreatureCard username="shadcn" />
      <div className="hidden xl:block">
        <CreatureCard username="franky47" />
      </div>
    </div>
  );
}
