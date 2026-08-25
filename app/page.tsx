import { Suspense } from "react";

import CreaturesShowcase from "@/components/creatures-showcase";
import {
  GithubFormFallback,
  SubmitGithubForm,
} from "@/components/forms/github-form";

export default function Page() {
  return (
    <main className="mt-20 flex flex-col items-center justify-center gap-5 px-2">
      <Suspense fallback={<GithubFormFallback />}>
        <SubmitGithubForm />
      </Suspense>

      <CreaturesShowcase />
    </main>
  );
}
