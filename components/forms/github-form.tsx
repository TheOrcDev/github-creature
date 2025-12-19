"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod/v3";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { submitGithubForm } from "@/server/ai";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon } from "@hugeicons/core-free-icons";

const formSchema = z.object({
  githubProfileUrl: z.string().startsWith("https://github.com/"),
});

export function SubmitGithubForm() {
  const [loading, setLoading] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubProfileUrl: "",
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

      toast.success("Creature created successfully");
    } finally {
      setLoading(false);
    }
  }

  return (
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
  );
}
