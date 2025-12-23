"use client";

import * as React from "react";
import { toPng } from "html-to-image";

import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon, Loading03Icon } from "@hugeicons/core-free-icons";

type DownloadCardButtonProps = {
  targetId: string;
  fileName?: string;
  pixelRatio?: number;
};

export default function DownloadCardButton({
  targetId,
  fileName = "github-creature.png",
  pixelRatio = 2,
}: DownloadCardButtonProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const onDownload = React.useCallback(async () => {
    const node = document.getElementById(targetId);
    if (!node) return;

    setIsDownloading(true);
    try {
      // Ensure webfonts have a chance to load before snapshotting.
      // (Avoids font fallback changing text metrics in the export.)
      try {
        await document.fonts?.ready;
      } catch {
        // ignore
      }

      const options = {
        cacheBust: true,
        pixelRatio,
        // Avoid html-to-image font embedding (can change fonts + can crash on some stylesheets).
        // We rely on the already-loaded page fonts instead.
        skipFonts: true,
        fontEmbedCSS: "",
        onClone: (doc: Document) => {
          const cloned = doc.getElementById(targetId) as HTMLElement | null;
          if (!cloned) return;

          // Flatten 3D transforms for export; html-to-image can mis-handle
          // perspective/translateZ and inflate text metrics.
          cloned.style.transform = "none";
          cloned.style.transformStyle = "flat";
          cloned.style.boxShadow = "none";

          const transformed = cloned.querySelectorAll<HTMLElement>(
            '[style*="translateZ"], [style*="perspective"], [style*="rotateX"], [style*="rotateY"]'
          );
          transformed.forEach((el) => {
            el.style.transform = "none";
            el.style.transformStyle = "flat";
          });

          // Prevent unexpected wrapping in the export without forcing a specific font.
          const clonedTitle = cloned.querySelector<HTMLElement>(
            '[data-export="title"]'
          );
          if (clonedTitle) clonedTitle.style.whiteSpace = "nowrap";
        },
      };

      const dataUrl = await toPng(
        node,
        options as unknown as Parameters<typeof toPng>[1]
      );

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = fileName;
      link.click();
    } catch (err) {
      console.error("Failed to download card image", err);
    } finally {
      setIsDownloading(false);
    }
  }, [fileName, pixelRatio, targetId]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onDownload}
      disabled={isDownloading}
    >
      {isDownloading ? (
        <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
      ) : (
        <HugeiconsIcon icon={Download01Icon} />
      )}
    </Button>
  );
}
