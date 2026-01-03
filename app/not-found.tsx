import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404 | GitHub Creature",
};

export default function NotFound() {
  return (
    <div className="grid h-screen w-full place-content-center gap-5 bg-background px-4 text-center">
      <Image
        alt="GitHub Creature 404"
        height={300}
        src={"/github-creature-logo.png"}
        width={300}
      />

      <h1 className="font-bold text-2xl tracking-tight sm:text-4xl">Uh-oh!</h1>

      <p className="text-gray-500">You are lost.</p>
      <Link href={"/"}>
        <Button variant={"outline"}>Return to Home Page</Button>
      </Link>
    </div>
  );
}
