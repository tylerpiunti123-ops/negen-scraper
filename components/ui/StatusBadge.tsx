import { cn } from "@/lib/utils";

type Status = "online" | "processing" | "waiting" | "complete" | "idle";

const config: Record<Status, { label: string; dot: string; text: string }> = {
  online: { label: "Online", dot: "bg-signal-on", text: "text-signal-on" },
  processing: { label: "Processing", dot: "bg-accent", text: "text-accent" },
  waiting: { label: "Waiting", dot: "bg-signal-off", text: "text-mist-400" },
  complete: { label: "Complete", dot: "bg-signal-on", text: "text-signal-on" },
  idle: { label: "Idle", dot: "bg-signal-off", text: "text-mist-500" },
};

export function StatusBadge({
  status,
  label,
  pulse = false,
  className,
}: {
  status: Status;
  label?: string;
  pulse?: boolean;
  className?: string;
}) {
  const c = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider",
        c.text,
        className,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          c.dot,
          pulse && status === "online" && "animate-pulseDot",
        )}
      />
      {label ?? c.label}
    </span>
  );
}
