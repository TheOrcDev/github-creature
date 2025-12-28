import { getCreatureByGithubUsername } from "@/server/creatures";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LiquidEther from "./liquid-ether";
import { cn } from "@/lib/utils";
import Plasma from "./plasma";
import LiquidChrome from "./liquid-chrome";
import ThreeDCard from "./3d-card";
import Balatro from "./balatro";
import LightPillar from "./light-pillar";
import type { ReactNode } from "react";
import CreatureStats from "./creature-stats";
import CreatureStatsDialog from "@/components/creature-stats-dialog";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

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

type CreatureCardProps = {
  params: Promise<{ username: string }>;
};
export default async function CreatureCard({ params }: CreatureCardProps) {
  const { username } = await params;

  const creature = await getCreatureByGithubUsername(username.toLowerCase());

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
        <Link href={"/"}>
          <Button variant={"outline"}>Summon it</Button>
        </Link>
      </div>
    );
  }

  const theme = getPowerLevelTheme(creature.powerLevel);
  const toggleId = `stats-toggle-${username.toLowerCase()}`;
  const cardDomId = `creature-card-${username.toLowerCase()}`;

  return (
    <div className="flex flex-col items-center">
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
          <div className="absolute -top-10 right-0 z-10 flex justify-end">
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
              className="hidden lg:inline-flex mr-3"
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

          <ThreeDCard enableShadow={false} innerId={cardDomId}>
            <Card
              className={cn(
                "p-0 w-96 relative rounded-xl",
                theme.cardClassName
              )}
            >
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
