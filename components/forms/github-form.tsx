"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod/v3";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { submitGithubForm } from "@/server/ai";

import { useInitialUsername } from "./github-form-url-state";

const usernameRegex = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;

const formSchema = z.object({
  githubProfileUrl: z
    .string()
    .min(1, "Please enter a GitHub username or profile URL")
    .refine((value) => {
      const trimmed = value.trim();

      // Check if it's a URL
      if (trimmed.includes("://")) {
        try {
          const url = new URL(trimmed);
          if (
            url.hostname !== "github.com" &&
            url.hostname !== "www.github.com"
          )
            return false;
          const segments = url.pathname.split("/").filter(Boolean);
          if (segments.length !== 1) return false;
          const username = decodeURIComponent(segments[0] ?? "").trim();
          return usernameRegex.test(username);
        } catch {
          return false;
        }
      }

      // Otherwise validate as a username
      return usernameRegex.test(trimmed);
    }, "Please enter a valid GitHub username or profile URL"),
});

export function SubmitGithubForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const username = useInitialUsername();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubProfileUrl: username ? `https://github.com/${username}` : "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const result = await submitGithubForm(data.githubProfileUrl);

      if (result && result.success) {
        toast.success(result.message);
        if (result.redirectUrl) {
          router.push(result.redirectUrl);
        }
      } else if (result && !result.success) {
        toast.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading ? (
        <div className="flex gap-2 items-center">
          <h2 className="lg:text-4xl text-2xl font-bold">
            Summoning your code creature
          </h2>
          <HugeiconsIcon className="animate-spin" icon={Loading03Icon} />
        </div>
      ) : (
        <h1 className="lg:text-4xl text-2xl font-bold">
          Summon the Creature Behind Your Code
        </h1>
      )}

      <form
        className="w-full max-w-lg"
        id="form-rhf-demo"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name="githubProfileUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <div className="flex items-center gap-2">
                  <Input
                    {...field}
                    id="form-rhf-demo-github-profile-url"
                    aria-invalid={fieldState.invalid}
                    placeholder="username or https://github.com/username"
                    autoComplete="off"
                  />
                  <Button type="submit" form="form-rhf-demo" disabled={loading}>
                    {loading ? (
                      <HugeiconsIcon
                        className="animate-spin"
                        icon={Loading03Icon}
                      />
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>

                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </>
  );
}
