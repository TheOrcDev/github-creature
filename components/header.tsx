import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import Link from "next/link";

export default function Header() {
  return (
    <header className="absolute top-0 p-4 w-full flex items-center justify-between">
      <Link href="/">
        <Image
          src="/github-creature-logo.png"
          alt="Logo"
          width={50}
          height={50}
        />
      </Link>

      <ModeToggle />
    </header>
  );
}
