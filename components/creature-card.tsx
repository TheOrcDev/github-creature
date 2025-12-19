import { SelectCreature } from "@/db/schema";
import Image from "next/image";

type CreatureCardProps = {
  creature: SelectCreature;
};
export default function CreatureCard({ creature }: CreatureCardProps) {
  return (
    <main className="flex p-5 max-w-2xl mt-10 w-full mx-auto border flex-col items-center justify-center gap-5">
      <h1>{creature.githubProfileUrl.split("/").pop()}</h1>
      <Image
        src={creature.image}
        alt={creature.description}
        width={350}
        height={350}
      />
      <p>{creature.description}</p>
    </main>
  );
}
