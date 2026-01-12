import { Suspense } from "react";

import CreatureCard from "@/components/creature-card";
import { SubmitGithubForm } from "@/components/forms/github-form";

export default async function Page() {
  return (
    <main className="flex flex-col items-center justify-center gap-5 px-2 mt-20">
      <Suspense>
        <SubmitGithubForm />
      </Suspense>

      <Suspense>
        <div className="flex flex-wrap gap-2">
          <div className="hidden lg:block">
            <CreatureCard username={"webdevcody"} />
          </div>
          <CreatureCard username={"shadcn"} />
          <div className="hidden xl:block">
            <CreatureCard username={"jnsahaj"} />
          </div>
        </div>
      </Suspense>
    </main>
  );
}
