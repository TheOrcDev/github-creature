import { Suspense } from "react";

import CreaturesShowcase from "@/components/creatures-showcase";
import { SubmitGithubForm } from "@/components/forms/github-form";

export default async function Page() {
  return (
    <main className="flex flex-col items-center justify-center gap-5 px-2 mt-20">
      <Suspense>
        <SubmitGithubForm />
      </Suspense>

      <CreaturesShowcase />
    </main>
  );
}
