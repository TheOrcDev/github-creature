import { getCreatureByGithubUsername } from "@/server/creatures";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LiquidEther from "./liquid-ether";
import { cn } from "@/lib/utils";
import Plasma from "./plasma";
import LiquidChrome from "./liquid-chrome";

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

  return (
    <Card
      className={cn(
        "p-0 w-96 relative shadow-2xl rounded-xl",
        creature.powerLevel > 9 && "border-purple-500 shadow-purple-500/40",
        creature.powerLevel > 5 &&
          creature.powerLevel <= 8 &&
          "border-gray-500 shadow-gray-500/40",
        creature.powerLevel > 2 &&
          creature.powerLevel <= 5 &&
          "border-orange-500 shadow-orange-500/40"
      )}
    >
      <div
        className={cn(
          "w-full absolute top-0 left-0 h-full border-2 rounded-xl",
          creature.powerLevel > 9 && "border-purple-500",
          creature.powerLevel > 5 &&
            creature.powerLevel <= 8 &&
            "border-gray-500",
          creature.powerLevel > 2 &&
            creature.powerLevel <= 5 &&
            "border-orange-500"
        )}
      >
        {creature.powerLevel > 9 && (
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
        )}
        {creature.powerLevel > 2 && creature.powerLevel <= 5 && (
          <Plasma
            color={"#ff6b35"}
            speed={0.6}
            direction="forward"
            scale={1.1}
            opacity={0.4}
            mouseInteractive={true}
          />
        )}
        {creature.powerLevel > 5 && creature.powerLevel <= 8 && (
          <LiquidChrome
            baseColor={[0.1, 0.1, 0.1]}
            speed={0.5}
            amplitude={0.6}
            interactive={true}
            opacity={0.5}
          />
        )}
      </div>
      <CardHeader className="p-0 flex flex-col gap-3">
        <Image
          src={creature.image}
          alt={creature.name}
          width={350}
          height={350}
          className="w-full"
        />
        <CardTitle className="px-4 text-lg font-bold">
          {creature.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-2">
        <p>{creature.description}</p>
      </CardContent>
    </Card>
  );
}
