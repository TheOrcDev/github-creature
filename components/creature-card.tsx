import { getCreatureByGithubUsername } from "@/server/creatures";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

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
    <>
      <h1>
        {creature.githubProfileUrl.split("/").pop()} - {creature.name}
      </h1>
      <Image
        src={creature.image}
        alt={creature.name}
        width={350}
        height={350}
      />
      <p>{creature.description}</p>
    </>
  );
}
