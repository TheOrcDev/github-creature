import { Github } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

import { ModeSwitcher } from "./mode-switcher";
import { Button } from "./ui/button";

const navItems = [
  {
    label: "Summon",
    href: "/summon",
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
  },
];

export default function Header() {
  return (
    <header className="absolute top-0 p-4 w-full flex justify-between">
      <div className="flex items-center gap-5">
        <Link href="/">
          <Image
            src="/github-creature-logo.png"
            alt="Logo"
            width={50}
            height={50}
          />
        </Link>

        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/theorcdev/github-creature"
        >
          <Button
            variant="ghost"
            size="icon"
            className="flex items-center gap-2 px-6"
          >
            <HugeiconsIcon icon={Github} />
            <StarsCount />
          </Button>
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
    <span className="w-12 text-muted-foreground text-xs tabular-nums">
      {stars >= 1000 ? `${(stars / 1000).toFixed(1)}k` : stars.toLocaleString()}
    </span>
  );
}
