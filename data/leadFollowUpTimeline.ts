export type PipelineStage = "NEW" | "CONTACTED" | "QUALIFIED" | "APPOINTMENT" | "WON";

export const pipelineStages: PipelineStage[] = ["NEW", "CONTACTED", "QUALIFIED", "APPOINTMENT", "WON"];

export interface FollowUpStep {
  id: string;
  timeLabel: string;
  title: string;
  stage: PipelineStage;
  message: string;
}

export const followUpTimeline: FollowUpStep[] = [
  {
    id: "t0",
    timeLabel: "0 minutes",
    title: "Lead captured",
    stage: "NEW",
    message: "New lead captured from website form — kitchen remodel inquiry, Jordan Ellis.",
  },
  {
    id: "t1",
    timeLabel: "2 minutes",
    title: "AI response sent",
    stage: "CONTACTED",
    message:
      "Hi Jordan! Thanks for reaching out about your kitchen remodel — what's the best time for a quick call today?",
  },
  {
    id: "t2",
    timeLabel: "15 minutes",
    title: "Follow-up",
    stage: "CONTACTED",
    message:
      "Just checking in — happy to answer any questions about pricing or timeline whenever works for you.",
  },
  {
    id: "t3",
    timeLabel: "1 day",
    title: "Follow-up",
    stage: "QUALIFIED",
    message:
      "Hi again! Wanted to follow up on your remodel project. Would tomorrow afternoon work for a quick estimate visit?",
  },
  {
    id: "t4",
    timeLabel: "3 days",
    title: "Follow-up",
    stage: "QUALIFIED",
    message:
      "No pressure at all — if now isn't the right time, just let me know and I'll follow up again later this month.",
  },
  {
    id: "t5",
    timeLabel: "7 days",
    title: "Final follow-up",
    stage: "APPOINTMENT",
    message:
      "Last check-in from me — if you'd still like an estimate, reply here anytime and we'll get it on the calendar.",
  },
];
