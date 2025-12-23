import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "./ui/button";
import { Github } from "@hugeicons/core-free-icons";
import Link from "next/link";

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
