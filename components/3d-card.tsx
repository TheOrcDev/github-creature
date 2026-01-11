"use client";

import React, {
  useState,
  useRef,
  useCallback,
  ReactNode,
  CSSProperties,
  useEffect,
} from "react";

interface ThreeDCardProps {
  children: ReactNode;
  className?: string;
  innerId?: string;
  maxRotation?: number;
  glowOpacity?: number;
  shadowBlur?: number;
  parallaxOffset?: number;
  transitionDuration?: string;
  backgroundImage?: string | null;
  enableGlow?: boolean;
  enableShadow?: boolean;
  enableParallax?: boolean;
  hoverPadding?: number;
  trackOnWindow?: boolean;
}

function ThreeDCard({
  children,
  className = "",
  innerId,
  maxRotation = 10,
  glowOpacity = 0.2,
  shadowBlur = 30,
  parallaxOffset = 40,
  transitionDuration = "0.6s",
  backgroundImage = null,
  enableGlow = true,
  enableShadow = true,
  enableParallax = true,
  hoverPadding = 12,
  trackOnWindow = false,
}: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
    shadowX: 0,
    shadowY: 20,
    isHovered: false,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (trackOnWindow) return;
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const { width, height, left, top } = rect;

      // Mouse events are attached to a padded "hit area" wrapper to avoid
      // enter/leave jitter when the card tilts away from the cursor.
      // Clamp so motion in the padding doesn't create extreme rotations.
      const mouseX = Math.min(width, Math.max(0, e.clientX - left));
      const mouseY = Math.min(height, Math.max(0, e.clientY - top));

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      const newRotateX = yPct * -1 * maxRotation;
      const newRotateY = xPct * maxRotation;

      setTransform((prev) => ({
        ...prev,
        rotateX: newRotateX,
        rotateY: newRotateY,
        glowX: (mouseX / width) * 100,
        glowY: (mouseY / height) * 100,
        shadowX: enableShadow ? newRotateY * 0.8 : 0,
        shadowY: enableShadow ? 20 - newRotateX * 0.6 : 20,
      }));
    },
    [maxRotation, enableShadow, trackOnWindow]
  );

  const handleMouseEnter = useCallback(() => {
    setTransform((prev) => ({ ...prev, isHovered: true }));
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      glowX: 50,
      glowY: 50,
      shadowX: 0,
      shadowY: 20,
      isHovered: false,
    });
  }, []);

  const handleWindowMouseMove = useCallback(
    (e: MouseEvent) => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      const mouseX = Math.min(width, Math.max(0, e.clientX));
      const mouseY = Math.min(height, Math.max(0, e.clientY));

      const xPct = mouseX / width - 0.5;
      const yPct = mouseY / height - 0.5;

      const newRotateX = yPct * -1 * maxRotation;
      const newRotateY = xPct * maxRotation;

      setTransform((prev) => ({
        ...prev,
        rotateX: newRotateX,
        rotateY: newRotateY,
        glowX: (mouseX / width) * 100,
        glowY: (mouseY / height) * 100,
        shadowX: enableShadow ? newRotateY * 0.8 : 0,
        shadowY: enableShadow ? 20 - newRotateX * 0.6 : 20,
      }));
    },
    [maxRotation, enableShadow]
  );

  useEffect(() => {
    if (!trackOnWindow) return;
    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, [trackOnWindow, handleWindowMouseMove]);

  const cardStyle: CSSProperties = {
    transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(1, 1, 1)`,
    boxShadow: enableShadow
      ? `${transform.shadowX}px ${transform.shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.4)`
      : "none",
    transition: `transform ${transitionDuration} cubic-bezier(0.23, 1, 0.32, 1), box-shadow ${transitionDuration} cubic-bezier(0.23, 1, 0.32, 1)`,
    transformStyle: "preserve-3d",
  };

  const backgroundStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: transform.isHovered ? 1 : 0,
        transition: `opacity 0.5s ease-in-out`,
      }
    : {};

  const glowStyle = enableGlow
    ? {
        background: `radial-gradient(circle at ${transform.glowX}% ${transform.glowY}%, rgba(255, 255, 255, ${glowOpacity}), transparent)`,
        opacity: transform.isHovered ? 1 : 0,
        transition: "opacity 0.5s ease-in-out",
      }
    : {};

  const contentStyle: CSSProperties = enableParallax
    ? {
        transform: `translateZ(${parallaxOffset}px)`,
        transformStyle: "preserve-3d",
      }
    : {};

  return (
    <div
      style={{ perspective: "1000px", padding: hoverPadding }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        id={innerId}
        style={cardStyle}
        className="relative bg-gray-800 rounded-2xl overflow-hidden"
        role="img"
        tabIndex={0}
        onFocus={handleMouseEnter}
        onBlur={handleMouseLeave}
      >
        {backgroundImage && (
          <div
            className="absolute inset-0 rounded-2xl"
            style={backgroundStyle}
            aria-hidden="true"
          />
        )}

        <div
          className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none"
          aria-hidden="true"
        />

        {enableGlow && (
          <div
            className="absolute inset-0 z-0 rounded-2xl pointer-events-none"
            style={glowStyle}
            aria-hidden="true"
          />
        )}

        <div style={contentStyle} className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export default ThreeDCard;
