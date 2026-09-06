"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck2, Send } from "lucide-react";
import {
  extractName,
  extractPhone,
  getStep,
  receptionistSteps,
  type ReceptionistAnswers,
} from "@/lib/conversationEngine";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  text: string;
}

export function AIReceptionistDemo({ onComplete }: { onComplete?: () => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<ReceptionistAnswers>({});
  const [typing, setTyping] = useState(false);
  const [textValue, setTextValue] = useState("");
  const [done, setDone] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  function nextId() {
    idRef.current += 1;
    return `m-${idRef.current}`;
  }

  function pushAiMessage(text: string) {
    setTyping(true);
    const delay = 550 + Math.min(text.length * 8, 900);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setTyping(false);
        setMessages((prev) => [...prev, { id: nextId(), role: "ai", text }]);
        resolve();
      }, delay);
    });
  }

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const step = getStep(0);
    if (step) {
      void pushAiMessage(step.getMessage({}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function handleAnswer(value: string) {
    const step = getStep(stepIndex);
    if (!step) return;

    setMessages((prev) => [...prev, { id: nextId(), role: "user", text: value }]);
    const updatedAnswers = { ...answers, [step.id]: value };
    setAnswers(updatedAnswers);
    setTextValue("");

    const nextIndex = stepIndex + 1;
    const nextStep = getStep(nextIndex);

    if (nextStep) {
      setStepIndex(nextIndex);
      await pushAiMessage(nextStep.getMessage(updatedAnswers));
    } else {
      await pushAiMessage(
        "Perfect — you're all set. I've sent the details over and someone from our team will confirm shortly.",
      );
      setDone(true);
      onComplete?.();
    }
  }

  const currentStep = getStep(stepIndex);
  const progress = Math.min(stepIndex, receptionistSteps.length);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-ink-700 bg-ink-900/60 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="font-medium text-paper-50">AI Receptionist</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] text-mist-500">
            Step {Math.min(progress + 1, receptionistSteps.length)}/{receptionistSteps.length}
          </span>
          <StatusBadge status="online" pulse />
        </div>
      </div>

      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto bg-ink-950/40 px-5 py-5">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "rounded-br-sm bg-accent text-ink-950"
                    : "rounded-bl-sm border border-ink-700 bg-ink-900 text-paper-50",
                )}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {typing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm border border-ink-700 bg-ink-900 px-4 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-blink rounded-full bg-mist-400"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl border border-signal-on/30 bg-signal-on/[0.06] p-4"
          >
            <div className="mb-3 flex items-center gap-2 text-signal-on">
              <CalendarCheck2 className="h-4 w-4" />
              <p className="font-mono text-xs uppercase tracking-wider">Appointment Ready</p>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-xs text-mist-500">Name</dt>
                <dd className="text-paper-50">{extractName(answers.contact) || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-mist-500">Phone</dt>
                <dd className="text-paper-50">{extractPhone(answers.contact) || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-mist-500">Service</dt>
                <dd className="text-paper-50">{answers.service || "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-mist-500">Timeline</dt>
                <dd className="text-paper-50">{answers.timeline || "—"}</dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-mist-500">Appointment</dt>
                <dd className="text-paper-50">{answers.slot || "—"}</dd>
              </div>
            </dl>
            <Button href="#builder" size="sm" className="mt-4 w-full sm:w-auto">
              See How We&apos;d Build This For You
            </Button>
          </motion.div>
        )}
      </div>

      {!done && currentStep && (
        <div className="border-t border-ink-700 bg-ink-900/60 px-5 py-4">
          {currentStep.inputType === "choice" ? (
            <div className="flex flex-wrap gap-2">
              {currentStep.options?.map((option) => (
                <button
                  key={option}
                  disabled={typing}
                  onClick={() => handleAnswer(option)}
                  className="rounded-full border border-ink-600 bg-ink-950 px-3.5 py-2 text-sm text-paper-50 transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
                >
                  {option}
                </button>
              ))}
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (textValue.trim()) handleAnswer(textValue.trim());
              }}
              className="flex items-center gap-2"
            >
              <input
                value={textValue}
                onChange={(e) => setTextValue(e.target.value)}
                placeholder={currentStep.placeholder}
                disabled={typing}
                aria-label="Your response"
                className="flex-1 rounded-lg border border-ink-600 bg-ink-950 px-3.5 py-2.5 text-sm text-paper-50 placeholder:text-mist-500 focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={typing || !textValue.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent text-ink-950 transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
