import { Github } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

import { Button } from "./ui/button";

type CreatureButtonsProps = {
  githubProfileUrl: string;
};

export default function CreatureButtons({
  githubProfileUrl,
}: CreatureButtonsProps) {
  return (
    <div className="flex px-2 gap-2">
      <Link href={githubProfileUrl} target="_blank" rel="noopener noreferrer">
        <Button size="icon">
          <HugeiconsIcon icon={Github} />
        </Button>
      </Link>
    </div>
  );
}
