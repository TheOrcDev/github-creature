import Image from "next/image";
import Link from "next/link";
import { ModeSwitcher } from "./mode-switcher";

export default function Header() {
  return (
    <header className="absolute top-0 p-4 w-full flex justify-between">
      <Link href="/">
        <Image
          src="/github-creature-logo.png"
          alt="Logo"
          width={50}
          height={50}
        />
      </Link>

      <ModeSwitcher />
    </header>
  );
}
