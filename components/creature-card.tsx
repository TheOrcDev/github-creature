import { getCreatureByGithubUsername } from "@/server/creatures";
import Image from "next/image";

type CreatureCardProps = {
  params: Promise<{ username: string }>;
};
export default async function CreatureCard({ params }: CreatureCardProps) {
  const { username } = await params;
  const creature = await getCreatureByGithubUsername(username.toLowerCase());

  if (!creature) {
    return <div>Creature not found</div>;
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
