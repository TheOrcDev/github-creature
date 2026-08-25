"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod/v3";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { submitGithubForm } from "@/server/ai";

import { useInitialUsername } from "./github-form-url-state";

const usernameRegex = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/;
const githubProfileFieldId = "form-rhf-demo-github-profile-url";
const githubProfileErrorId = `${githubProfileFieldId}-error`;

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
          ) {
            return false;
          }
          const segments = url.pathname.split("/").filter(Boolean);
          if (segments.length !== 1) {
            return false;
          }
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

export function GithubFormFallback() {
  return (
    <div className="flex w-full max-w-md flex-col items-center gap-5">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

export function SubmitGithubForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const username = useInitialUsername();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      githubProfileUrl: username ? `https://github.com/${username}` : "",
    },
    resolver: zodResolver(formSchema),
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
        <div className="flex items-center gap-2">
          <h2 className="text-center font-bold text-2xl md:text-xl lg:text-4xl">
            Summoning your code creature
          </h2>
          <HugeiconsIcon
            aria-hidden
            className="motion-reduce:animate-none animate-spin"
            icon={Loading03Icon}
          />
        </div>
      ) : (
        <h1 className="text-center font-bold text-xl md:text-2xl lg:text-4xl">
          Summon the Creature Behind Your Code
        </h1>
      )}

      <form
        className="w-full max-w-md"
        id="form-rhf-demo"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FieldGroup>
          <Controller
            name="githubProfileUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={githubProfileFieldId}>
                  GitHub username or profile URL
                </FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    {...field}
                    id={githubProfileFieldId}
                    aria-describedby={
                      fieldState.invalid ? githubProfileErrorId : undefined
                    }
                    aria-invalid={fieldState.invalid}
                    autoComplete="off"
                    placeholder="username or https://github.com/username"
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      disabled={loading}
                      form="form-rhf-demo"
                      type="submit"
                    >
                      {loading ? (
                        <HugeiconsIcon
                          aria-hidden
                          className="motion-reduce:animate-none animate-spin"
                          icon={Loading03Icon}
                        />
                      ) : (
                        "Summon"
                      )}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>

                {fieldState.invalid && (
                  <FieldError
                    id={githubProfileErrorId}
                    errors={[fieldState.error]}
                  />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    </>
  );
}
