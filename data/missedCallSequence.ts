export type MissedCallEventType = "call" | "detect" | "sms-out" | "sms-in" | "check";

export interface MissedCallEvent {
  id: string;
  type: MissedCallEventType;
  text: string;
  timestamp: string;
}

import { DEFAULT_NICHE } from "@/lib/conversationEngine";

export function buildMissedCallSequence(niche: string = DEFAULT_NICHE): MissedCallEvent[] {
  const service = niche.trim() || DEFAULT_NICHE;

  return [
    { id: "1", type: "call", text: "Missed Call — Unknown Caller", timestamp: "10:42 AM" },
    { id: "2", type: "detect", text: "AI system detected missed call", timestamp: "10:42 AM" },
    {
      id: "3",
      type: "sms-out",
      text: "Hey! Sorry we missed your call. How can we help?",
      timestamp: "10:42 AM",
    },
    { id: "4", type: "sms-in", text: "I need an estimate.", timestamp: "10:44 AM" },
    {
      id: "5",
      type: "sms-out",
      text: "Absolutely. What service are you looking for?",
      timestamp: "10:44 AM",
    },
    { id: "6", type: "sms-in", text: `${service}.`, timestamp: "10:45 AM" },
    { id: "7", type: "check", text: "Lead captured", timestamp: "10:45 AM" },
    { id: "8", type: "check", text: "Lead qualified", timestamp: "10:45 AM" },
    { id: "9", type: "check", text: "CRM updated", timestamp: "10:46 AM" },
    { id: "10", type: "check", text: "Team notified", timestamp: "10:46 AM" },
    { id: "11", type: "check", text: "Appointment offered", timestamp: "10:46 AM" },
  ];
}
