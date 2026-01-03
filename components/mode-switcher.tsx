"use client";

import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  return (
    <Button
      className="group/toggle size-8 px-0"
      onClick={toggleTheme}
      variant="ghost"
    >
      <HugeiconsIcon icon={Sun02Icon} className="hidden [html.dark_&]:block" />
      <HugeiconsIcon
        icon={Moon02Icon}
        className="hidden [html.light_&]:block"
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
