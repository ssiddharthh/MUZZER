"use client";

import { useUser } from "@/app/hooks/use-user";
import { QueueExperience } from "@/app/components/streams/queue-experience";
import { Spinner } from "@/app/components/ui/spinner";

export default function DashboardPage() {
  const { isLoading: isUserLoading } = useUser();

  if (isUserLoading) {
    return <Spinner label="Loading dashboard..." />;
  }

  return (
    <div className="py-2">
      <QueueExperience
        title="Studio Dashboard"
        description="Search, manage, and monitor your session queue in a single view."
        showSubmitForm={true}
        emptyTitle="Your queue is empty"
        emptyDescription="Search for a track from YouTube or Spotify using the panel above to start the session."
      />
    </div>
  );
}
