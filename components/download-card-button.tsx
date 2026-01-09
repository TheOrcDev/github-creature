"use client";

import { Download01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { domToPng } from "modern-screenshot";
import * as React from "react";

import { Button } from "@/components/ui/button";

type DownloadCardButtonProps = {
  targetId: string;
  fileName?: string;
  pixelRatio?: number;
};

function captureWebGLToImage(canvas: HTMLCanvasElement): string | null {
  const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
  if (!gl) {
    try {
      return canvas.toDataURL("image/png");
    } catch {
      return null;
    }
  }

  const width = canvas.width;
  const height = canvas.height;

  const pixels = new Uint8Array(width * height * 4);
  gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = width;
  tempCanvas.height = height;
  const ctx = tempCanvas.getContext("2d");
  if (!ctx) return null;

  const imageData = ctx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const dstIdx = ((height - y - 1) * width + x) * 4;
      imageData.data[dstIdx] = pixels[srcIdx];
      imageData.data[dstIdx + 1] = pixels[srcIdx + 1];
      imageData.data[dstIdx + 2] = pixels[srcIdx + 2];
      imageData.data[dstIdx + 3] = pixels[srcIdx + 3];
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return tempCanvas.toDataURL("image/png");
}

function captureWebGLCanvases(
  container: HTMLElement
): Map<HTMLCanvasElement, string> {
  const captures = new Map<HTMLCanvasElement, string>();
  const canvases = container.querySelectorAll("canvas");

  for (const canvas of canvases) {
    const dataUrl = captureWebGLToImage(canvas);
    if (dataUrl) {
      captures.set(canvas, dataUrl);
    }
  }

  return captures;
}

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
      try {
        await document.fonts?.ready;
      } catch {
        // ignore
      }

      const webglCaptures = captureWebGLCanvases(node);

      const dataUrl = await domToPng(node, {
        scale: pixelRatio,
        features: {
          removeControlCharacter: false,
        },
        onCloneNode: (clonedNode) => {
          if (!(clonedNode instanceof HTMLElement)) return;

          const clonedCanvases = clonedNode.querySelectorAll("canvas");
          const originalCanvases = node.querySelectorAll("canvas");

          clonedCanvases.forEach((clonedCanvas, index) => {
            const originalCanvas = originalCanvases[index];
            const capture = webglCaptures.get(originalCanvas);

            if (capture) {
              const img = document.createElement("img");
              img.src = capture;
              img.style.cssText = clonedCanvas.style.cssText;
              img.style.width =
                clonedCanvas.style.width || `${originalCanvas.offsetWidth}px`;
              img.style.height =
                clonedCanvas.style.height || `${originalCanvas.offsetHeight}px`;
              img.style.position = "absolute";
              img.style.top = "0";
              img.style.left = "0";

              clonedCanvas.parentNode?.replaceChild(img, clonedCanvas);
            }
          });

          if (clonedNode.id === targetId) {
            clonedNode.style.transform = "none";
            clonedNode.style.transformStyle = "flat";
          }
        },
      });

      // Download the image
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
