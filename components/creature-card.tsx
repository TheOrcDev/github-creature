import type { ReactNode } from "react";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";

import CreatureStatsDialog from "@/components/creature-stats-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getCreatureByGithubUsername } from "@/server/creatures";

import ThreeDCard from "./3d-card";
import Balatro from "./balatro";
import CreatureStats from "./creature-stats";
import { serializeFormSearchParams } from "./forms/github-form";
import LightPillar from "./light-pillar";
import LiquidChrome from "./liquid-chrome";
import LiquidEther from "./liquid-ether";
import Plasma from "./plasma";
import { Button } from "./ui/button";

function getPowerLevelTheme(powerLevel: number): {
  cardClassName: string;
  frameClassName: string;
  effects: ReactNode;
} {
  if (powerLevel >= 10) {
    return {
      cardClassName: "border-purple-500 dark:bg-purple-500/30 bg-purple-500/40",
      frameClassName: "border-purple-500",
      effects: (
        <LiquidEther
          colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      ),
    };
  }

  if (powerLevel >= 9) {
    return {
      cardClassName: "border-gray-500 dark:bg-gray-500/30 bg-gray-500/40",
      frameClassName: "border-gray-500",
      effects: (
        <LiquidChrome
          baseColor={[0.1, 0.1, 0.1]}
          speed={0.5}
          amplitude={0.6}
          interactive={true}
          opacity={0.5}
        />
      ),
    };
  }

  // Mid tiers
  if (powerLevel >= 6) {
    return {
      cardClassName: "border-red-500 dark:bg-red-500/30 bg-red-500/40",
      frameClassName: "border-red-500",
      effects: (
        <Balatro
          isRotate={false}
          mouseInteraction={true}
          pixelFilter={700}
          opacity={0.3}
        />
      ),
    };
  }

  if (powerLevel >= 4) {
    return {
      cardClassName: "border-orange-500 dark:bg-orange-500/30 bg-orange-500/40",
      frameClassName: "border-orange-500",
      effects: (
        <Plasma
          color={"#ff6b35"}
          speed={0.6}
          direction="forward"
          scale={1.1}
          opacity={0.4}
          mouseInteractive={true}
        />
      ),
    };
  }

  if (powerLevel >= 2) {
    return {
      cardClassName:
        "border-emerald-900 dark:bg-emerald-900/30 bg-emerald-900/40",
      frameClassName: "border-emerald-900",
      effects: (
        <LightPillar
          topColor="#00FF00"
          bottomColor="#FF9FFC"
          intensity={1.0}
          rotationSpeed={0.3}
          glowAmount={0.005}
          pillarWidth={3.0}
          pillarHeight={0.4}
          noiseIntensity={0.5}
          pillarRotation={0}
          interactive={false}
          mixBlendMode="normal"
          opacity={0.4}
        />
      ),
    };
  }

  // Base tier
  return {
    cardClassName: "",
    frameClassName: "",
    effects: null,
  };
}

function getEmblemTheme(powerLevel: number): {
  ringClassName: string;
  glowClassName: string;
  dotClassName: string;
  textClassName: string;
} {
  if (powerLevel >= 10) {
    return {
      ringClassName:
        "bg-linear-to-r from-purple-600 via-fuchsia-500 to-cyan-400",
      glowClassName: "shadow-[0_0_28px_rgba(168,85,247,0.55)]",
      dotClassName:
        "bg-linear-to-r from-fuchsia-300 via-purple-300 to-cyan-200",
      textClassName:
        "bg-linear-to-r from-purple-200 via-white to-cyan-200 bg-clip-text text-transparent",
    };
  }

  if (powerLevel >= 9) {
    return {
      ringClassName: "bg-linear-to-r from-zinc-200 via-slate-400 to-zinc-200",
      glowClassName: "shadow-[0_0_18px_rgba(148,163,184,0.35)]",
      dotClassName: "bg-linear-to-r from-zinc-200 via-slate-300 to-zinc-100",
      textClassName:
        "bg-linear-to-r from-zinc-100 via-white to-zinc-200 bg-clip-text text-transparent",
    };
  }

  if (powerLevel >= 6) {
    return {
      ringClassName: "bg-linear-to-r from-red-600 via-rose-500 to-amber-400",
      glowClassName: "shadow-[0_0_18px_rgba(239,68,68,0.35)]",
      dotClassName: "bg-linear-to-r from-red-400 via-rose-400 to-amber-300",
      textClassName:
        "bg-linear-to-r from-red-200 via-white to-amber-200 bg-clip-text text-transparent",
    };
  }

  if (powerLevel >= 4) {
    return {
      ringClassName:
        "bg-linear-to-r from-orange-600 via-amber-400 to-yellow-300",
      glowClassName: "shadow-[0_0_16px_rgba(249,115,22,0.35)]",
      dotClassName:
        "bg-linear-to-r from-orange-400 via-amber-300 to-yellow-200",
      textClassName:
        "bg-linear-to-r from-orange-200 via-white to-yellow-200 bg-clip-text text-transparent",
    };
  }

  if (powerLevel >= 2) {
    return {
      ringClassName: "bg-linear-to-r from-emerald-500 via-lime-400 to-cyan-300",
      glowClassName: "shadow-[0_0_16px_rgba(16,185,129,0.35)]",
      dotClassName: "bg-linear-to-r from-emerald-300 via-lime-300 to-cyan-200",
      textClassName:
        "bg-linear-to-r from-emerald-200 via-white to-cyan-200 bg-clip-text text-transparent",
    };
  }

  return {
    ringClassName: "bg-linear-to-r from-slate-500 via-slate-400 to-slate-300",
    glowClassName: "shadow-[0_0_12px_rgba(148,163,184,0.25)]",
    dotClassName: "bg-linear-to-r from-slate-300 via-slate-200 to-slate-100",
    textClassName:
      "bg-linear-to-r from-slate-100 via-white to-slate-200 bg-clip-text text-transparent",
  };
}

type CreatureCardProps = {
  params: Promise<{ username: string }>;
};
export default async function CreatureCard({ params }: CreatureCardProps) {
  const { username } = await params;

  const usernameLower = username.toLowerCase();
  const githubProfileUrl = `https://github.com/${usernameLower}`;

  const creature = await getCreatureByGithubUsername(usernameLower);

  if (!creature) {
    return (
      <div className="grid w-full place-content-center gap-5 bg-background px-4 text-center">
        <Image
          alt="GitHub Creature 404"
          height={300}
          src={"/github-creature-logo.png"}
          width={300}
        />

        <h1 className="font-bold text-2xl tracking-tight sm:text-4xl">
          Creature not found
        </h1>

        <p className="text-gray-500">
          The creature you are looking for does not exist.
        </p>
        <Link
          href={serializeFormSearchParams("/", { username: usernameLower })}
        >
          <Button variant={"outline"}>Summon it</Button>
        </Link>
      </div>
    );
  }

  const theme = getPowerLevelTheme(creature.powerLevel);
  const emblemTheme = getEmblemTheme(creature.powerLevel);
  const toggleId = `stats-toggle-${usernameLower}`;
  const cardDomId = `creature-card-${usernameLower}`;

  return (
    <div className="flex flex-col items-center dark">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <input id={toggleId} type="checkbox" className="peer sr-only" />

        <div
          className={cn(
            "relative transition-transform duration-500 ease-out",
            "peer-checked:sm:-translate-x-1",
            "peer-checked:**:data-[state=reveal]:hidden",
            "peer-checked:**:data-[state=hide]:inline",
            "peer-checked:**:data-[slot=arrow]:rotate-180"
          )}
        >
          <div className="absolute -top-10 right-0 z-10 flex justify-end mr-6">
            <div className="lg:hidden w-full">
              <CreatureStatsDialog triggerText="View stats">
                <CreatureStats
                  creature={creature}
                  downloadTargetId={cardDomId}
                />
              </CreatureStatsDialog>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex"
              nativeButton={false}
              render={<label htmlFor={toggleId} />}
            >
              <span data-state="reveal">Reveal stats</span>
              <span data-state="hide" className="hidden">
                Hide stats
              </span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="transition-transform duration-300"
                data-slot="arrow"
              />
            </Button>
          </div>

          <ThreeDCard enableShadow={false} innerId={cardDomId} className="m-3">
            <Card
              className={cn(
                "p-0 w-96 relative rounded-xl",
                theme.cardClassName
              )}
            >
              <div className="absolute left-3 top-3 z-20">
                <Link
                  href={githubProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "group relative inline-flex rounded-full p-px",
                    emblemTheme.ringClassName,
                    emblemTheme.glowClassName
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none absolute -inset-1 rounded-full blur opacity-35 transition-opacity group-hover:opacity-60",
                      emblemTheme.ringClassName
                    )}
                  />
                  <span className="relative inline-flex items-center gap-2 rounded-full border border-white/10 bg-background/70 px-3 py-1 text-xs font-semibold backdrop-blur supports-backdrop-filter:bg-background/50">
                    <span
                      className={cn("font-mono", emblemTheme.textClassName)}
                    >
                      @{usernameLower}
                    </span>
                  </span>
                </Link>
              </div>
              <div
                className={cn(
                  "w-full absolute top-0 left-0 h-full border-3 rounded-xl",
                  theme.frameClassName
                )}
              >
                {theme.effects}
              </div>
              <CardHeader className="p-0 flex flex-col gap-3">
                <Image
                  src={creature.image}
                  alt={creature.name}
                  width={350}
                  height={350}
                  crossOrigin="anonymous"
                  className="w-full"
                />
                <CardTitle
                  data-export="title"
                  className="px-4 text-2xl sm:text-2xl font-bold tracking-normal leading-tight"
                >
                  <span className="bg-linear-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                    {creature.name}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="leading-relaxed text-balance text-foreground/80">
                  {creature.description}
                </p>
              </CardContent>
            </Card>
          </ThreeDCard>
        </div>

        {/* Desktop slide-in panel */}
        <div
          className={cn(
            "hidden lg:block overflow-hidden",
            "transition-[max-width,opacity,transform] duration-500 ease-out will-change-[max-width,opacity,transform]",
            "max-w-0 opacity-0 translate-x-2 pointer-events-none",
            "peer-checked:max-w-[24rem] peer-checked:opacity-100 peer-checked:translate-x-0 peer-checked:pointer-events-auto"
          )}
        >
          <div className="p-3">
            <CreatureStats creature={creature} downloadTargetId={cardDomId} />
          </div>
        </div>
      </div>
    </div>
  );
}
