"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod/v3";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { submitGithubForm } from "@/server/ai";

import { useInitialUsername } from "./github-form-url-state";

const formSchema = z.object({
  githubProfileUrl: z
    .string()
    .url("Please enter a valid URL")
    .refine((value) => {
      try {
        const url = new URL(value);
        if (url.hostname !== "github.com" && url.hostname !== "www.github.com")
          return false;
        const segments = url.pathname.split("/").filter(Boolean);
        if (segments.length !== 1) return false;
        const username = decodeURIComponent(segments[0] ?? "").trim();
        return /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,37}[A-Za-z0-9])?$/.test(username);
      } catch {
        return false;
      }
    }, "Please enter a GitHub profile URL like https://github.com/username"),
});

export function SubmitGithubForm() {
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
        <>
          <h2>Summoning your code creature</h2>
          <HugeiconsIcon className="animate-spin" icon={Loading03Icon} />
        </>
      ) : (
        <h1>Summon the Creature Behind Your Code</h1>
      )}
      <Card className="w-full sm:max-w-lg">
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
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
                        placeholder="https://github.com/username"
                        autoComplete="off"
                      />
                      <Button
                        type="submit"
                        form="form-rhf-demo"
                        disabled={loading}
                      >
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
        </CardContent>
      </Card>
    </>
  );
}
