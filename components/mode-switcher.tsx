"use client";

import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTheme } from "next-themes";
import { useCallback, useEffect } from "react";

import { Button } from "@/components/ui/button";

export function ModeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.target instanceof HTMLElement &&
        (event.target.tagName === "INPUT" ||
          event.target.tagName === "TEXTAREA" ||
          event.target.tagName === "SELECT" ||
          event.target.isContentEditable)
      ) {
        return;
      }

      if (
        !(event.metaKey || event.ctrlKey) ||
        !event.shiftKey ||
        event.key.toLowerCase() !== "d"
      ) {
        return;
      }

      event.preventDefault();
      toggleTheme();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleTheme]);

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
