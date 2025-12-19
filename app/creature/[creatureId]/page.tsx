import CreatureCard from "@/components/creature-card";
import { getCreature } from "@/server/creatures";

type Params = Promise<{ creatureId: string }>;

export default async function CreaturePage({ params }: { params: Params }) {
  const { creatureId } = await params;
  const creature = await getCreature(creatureId);

  if (!creature) {
    return <div>Creature not found</div>;
  }

  return <CreatureCard creature={creature} />;
}
