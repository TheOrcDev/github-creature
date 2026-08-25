"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid h-screen w-full place-content-center gap-5 bg-background px-4 text-center">
      <h1 className="font-bold text-2xl tracking-tight sm:text-4xl">
        Something went wrong
      </h1>
      <p className="text-muted-foreground">
        The creature could not be summoned. Try again in a moment.
      </p>
      <Button onClick={reset} variant="outline">
        Try again
      </Button>
    </main>
  );
}
