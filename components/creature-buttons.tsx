import { Github } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { buttonVariants } from "./ui/button";

interface CreatureButtonsProps {
  githubProfileUrl: string;
}

export default function CreatureButtons({
  githubProfileUrl,
}: CreatureButtonsProps) {
  return (
    <div className="flex gap-2 px-2">
      <Link
        aria-label="Open GitHub profile"
        className={buttonVariants({ size: "icon" })}
        href={githubProfileUrl}
        rel="noopener noreferrer"
        target="_blank"
      >
        <HugeiconsIcon icon={Github} />
      </Link>
    </div>
  );
}
