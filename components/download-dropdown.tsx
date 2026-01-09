"use client";

import { Download01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { domToPng } from "modern-screenshot";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type DownloadDropdownProps = {
  targetId: string;
  originalImageUrl: string;
  fileName?: string;
  pixelRatio?: number;
};

export default function DownloadDropdown({
  targetId,
  originalImageUrl,
  fileName = "github-creature",
  pixelRatio = 2,
}: DownloadDropdownProps) {
  const [isDownloading, setIsDownloading] = React.useState(false);

  const downloadCardWithEffects = React.useCallback(async () => {
    const node = document.getElementById(targetId);
    if (!node) return;

    setIsDownloading(true);
    try {
      try {
        await document.fonts?.ready;
      } catch {
        // ignore
      }

      const dataUrl = await domToPng(node, {
        scale: pixelRatio,
        onCloneNode: (cloned) => {
          if (cloned instanceof HTMLElement) {
            cloned.style.transform = "none";
            cloned.style.transformStyle = "flat";
            cloned.style.boxShadow = "none";
          }
        },
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName}-card.png`;
      link.click();
    } catch (err) {
      console.error("Failed to download card image", err);
    } finally {
      setIsDownloading(false);
    }
  }, [fileName, pixelRatio, targetId]);

  const downloadOriginalImage = React.useCallback(async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(originalImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.png`;
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download original image", err);
    } finally {
      setIsDownloading(false);
    }
  }, [fileName, originalImageUrl]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="outline" size="sm" disabled={isDownloading}>
            {isDownloading ? (
              <HugeiconsIcon icon={Loading03Icon} className="animate-spin" />
            ) : (
              <HugeiconsIcon icon={Download01Icon} />
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={downloadCardWithEffects}>
          Card with effects
        </DropdownMenuItem>
        <DropdownMenuItem onClick={downloadOriginalImage}>
          Original image
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
