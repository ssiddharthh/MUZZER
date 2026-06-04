import { PageShell } from "@/app/components/layout/page-shell";
import { QueueExperience } from "@/app/components/streams/queue-experience";

export default function QueuePage() {
  return (
    <PageShell>
      <div className="container-app py-8 lg:py-10">
        <QueueExperience
          title="Live music queue"
          description="Browse the active session queue, preview the top track, and upvote your favorites."
          emptyTitle="No tracks in the queue yet"
          emptyDescription="Once someone adds a YouTube or Spotify link, it will appear here sorted by votes."
          emptyActionLabel="Sign in to add a track"
          emptyActionHref="/login"
        />
      </div>
    </PageShell>
  );
}
