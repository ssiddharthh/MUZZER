"use client";

import { AdminShell } from "@/app/components/layout/dashboard-shell";
import { QueueExperience } from "@/app/components/streams/queue-experience";

export default function AdminStreamsPage() {
  return (
    <AdminShell>
      <QueueExperience
        title="Admin stream view"
        description="Operational view of every active stream in the queue, including vote totals and submitter details."
        showSubmitForm
        emptyTitle="No active streams"
        emptyDescription="When listeners or streamers submit tracks, they will appear here for moderation and monitoring."
      />
    </AdminShell>
  );
}
