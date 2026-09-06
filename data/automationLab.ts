import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  Bot,
  Calendar,
  Database,
  Mail,
  MessageSquare,
  Star,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

export type NodeType =
  | "lead-source"
  | "ai-receptionist"
  | "ai-qualification"
  | "crm"
  | "sms"
  | "email"
  | "calendar"
  | "follow-up"
  | "sales-rep"
  | "review-request";

export interface NodeDefinition {
  id: NodeType;
  label: string;
  icon: LucideIcon;
}

export const nodeCatalog: NodeDefinition[] = [
  { id: "lead-source", label: "Lead Source", icon: UserPlus },
  { id: "ai-receptionist", label: "AI Receptionist", icon: Bot },
  { id: "ai-qualification", label: "AI Qualification", icon: UserCheck },
  { id: "crm", label: "CRM", icon: Database },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "email", label: "Email", icon: Mail },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "follow-up", label: "Follow-Up", icon: BellRing },
  { id: "sales-rep", label: "Sales Rep", icon: Users },
  { id: "review-request", label: "Review Request", icon: Star },
];

export const nodeMap: Record<NodeType, NodeDefinition> = nodeCatalog.reduce(
  (acc, node) => {
    acc[node.id] = node;
    return acc;
  },
  {} as Record<NodeType, NodeDefinition>,
);

export interface PresetWorkflow {
  id: string;
  name: string;
  nodes: NodeType[];
}

export const presetWorkflows: PresetWorkflow[] = [
  {
    id: "lead-capture",
    name: "Lead Capture",
    nodes: ["lead-source", "ai-qualification", "crm", "sms", "calendar"],
  },
  {
    id: "missed-call-recovery",
    name: "Missed Call Recovery",
    nodes: ["lead-source", "ai-receptionist", "crm", "follow-up"],
  },
  {
    id: "quote-followup",
    name: "Quote Follow-Up",
    nodes: ["crm", "follow-up", "sms", "sales-rep"],
  },
  {
    id: "appointment-booking",
    name: "Appointment Booking",
    nodes: ["ai-receptionist", "ai-qualification", "calendar", "email"],
  },
  {
    id: "customer-reactivation",
    name: "Customer Reactivation",
    nodes: ["crm", "sms", "follow-up", "review-request"],
  },
];
