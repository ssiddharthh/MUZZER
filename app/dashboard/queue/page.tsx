"use client";

import { QueueExperience } from "@/app/components/streams/queue-experience";
import { useUser } from "@/app/hooks/use-user";

export default function DashboardQueuePage() {
  const { user } = useUser();

  return (
    <QueueExperience
      title="Queue management"
      description="Review and manage the tracks you have submitted to the active session."
      showSubmitForm
      filterByEmail={user?.email}
      emptyTitle="You have not submitted any tracks"
      emptyDescription="Add a YouTube or Spotify link to place your first request in the queue."
      emptyActionLabel="Add a track"
      emptyActionHref="/dashboard/streams/new"
    />
  );
}
