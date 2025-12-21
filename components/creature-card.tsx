import { getCreatureByGithubUsername } from "@/server/creatures";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LiquidEther from "./liquid-ether";

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
    <Card className="p-0 w-96 relative shadow-2xl shadow-purple-500/40">
      <div className="w-full absolute top-0 left-0 h-full border-2 border-purple-500">
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
      </div>
      <CardHeader className="p-0 flex flex-col gap-3 items-center justify-center">
        <Image
          src={creature.image}
          alt={creature.name}
          width={350}
          height={350}
          className="w-full"
        />
        <CardTitle>{creature.name}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-2">
        <p>{creature.description}</p>
      </CardContent>
    </Card>
  );
}
