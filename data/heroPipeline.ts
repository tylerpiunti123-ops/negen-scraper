export interface PipelineNode {
  id: string;
  label: string;
}

export interface PipelineLogEntry {
  id: string;
  text: string;
}

export const pipelineNodes: PipelineNode[] = [
  { id: "lead", label: "New Lead" },
  { id: "qualify", label: "AI Qualification" },
  { id: "crm", label: "CRM" },
  { id: "followup", label: "Follow-Up" },
  { id: "appointment", label: "Appointment" },
];

export const pipelineLog: PipelineLogEntry[] = [
  { id: "lead", text: "Lead captured" },
  { id: "qualify", text: "AI analyzing…" },
  { id: "qualified", text: "Lead qualified" },
  { id: "crm", text: "CRM updated" },
  { id: "appointment", text: "Appointment booked" },
];
