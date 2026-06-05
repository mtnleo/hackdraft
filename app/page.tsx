import HackstarterApp from "@/components/HackstarterApp";
import { getAllIdeas } from "@/lib/data";
import { queryIdeas } from "@/lib/ideas";
import { ALL_TOPICS, DEFAULT_BUCKET } from "@/lib/topics";

// Random initial pick per request.
export const dynamic = "force-dynamic";

export default function Home() {
  const initial = queryIdeas(getAllIdeas(), ALL_TOPICS, DEFAULT_BUCKET, 3);
  return <HackstarterApp initial={initial} />;
}
