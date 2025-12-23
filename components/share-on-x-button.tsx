"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { NewTwitterFreeIcons } from "@hugeicons/core-free-icons";

type ShareOnXButtonProps = {
  text: string;
  className?: string;
};

export default function ShareOnXButton({
  text,
  className,
}: ShareOnXButtonProps) {
  const [shareUrl, setShareUrl] = React.useState("");

  React.useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  const onClick = React.useCallback(() => {
    const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(shareUrl)}`;
    window.open(intentUrl, "_blank", "noopener,noreferrer");
  }, [shareUrl, text]);

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={onClick}
      disabled={!shareUrl}
    >
      <HugeiconsIcon icon={NewTwitterFreeIcons} />
    </Button>
  );
}
