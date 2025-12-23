import Image from "next/image";
import Link from "next/link";
import { ModeSwitcher } from "./mode-switcher";

const navItems = [
  {
    label: "Summon",
    href: "/",
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

      <ModeSwitcher />
    </header>
  );
}
