import { Github } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { ModeSwitcher } from "./mode-switcher";
import { buttonVariants } from "./ui/button";

const navItems = [
  {
    href: "/summon",
    label: "Summon",
  },
  {
    href: "/leaderboard",
    label: "Leaderboard",
  },
];

export default function Header() {
  return (
    <header className="absolute top-0 flex w-full min-w-0 items-center justify-between gap-2 p-2 sm:gap-4 sm:p-4">
      <div className="flex min-w-0 items-center gap-2 sm:gap-5">
        <Link className="shrink-0" href="/">
          <Image
            alt="GitHub Creature home"
            className="size-8 sm:size-[50px]"
            height={50}
            src="/github-creature-logo.png"
            width={50}
          />
        </Link>

        {navItems.map((item) => (
          <Link className="truncate text-sm" key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Link
          aria-label="GitHub repository"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "size-8 px-0 sm:h-8 sm:w-auto sm:gap-2 sm:px-2"
          )}
          href="https://github.com/theorcdev/github-creature"
          rel="noopener noreferrer"
          target="_blank"
        >
          <HugeiconsIcon icon={Github} />
          <StarsCount />
        </Link>
        <ModeSwitcher />
      </div>
    </header>
  );
}

export async function StarsCount() {
  "use cache";

  const data = await fetch(
    "https://api.github.com/repos/theorcdev/github-creature"
  );
  const json = await data.json();
  const stars = json.stargazers_count;

  return (
    <span className="hidden w-12 text-muted-foreground text-xs tabular-nums sm:inline">
      {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString()}
    </span>
  );
}
