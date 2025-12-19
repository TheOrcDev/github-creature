import CreatureCard from "@/components/creature-card";
import { getCreatureByGithubUsername } from "@/server/creatures";

type Params = Promise<{ username: string }>;

export default async function CreaturePage({ params }: { params: Params }) {
  const { username } = await params;
  const creature = await getCreatureByGithubUsername(username.toLowerCase());

  if (!creature) {
    return <div>Creature not found</div>;
  }

  return <CreatureCard creature={creature} />;
}
