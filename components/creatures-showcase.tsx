"use cache";

import CreatureCard from "./creature-card";

export default async function CreaturesShowcase() {
  return (
    <div className="flex flex-wrap gap-2">
      <div className="hidden lg:block">
        <CreatureCard username={"webdevcody"} />
      </div>
      <CreatureCard username={"shadcn"} />
      <div className="hidden xl:block">
        <CreatureCard username={"franky47"} />
      </div>
    </div>
  );
}
