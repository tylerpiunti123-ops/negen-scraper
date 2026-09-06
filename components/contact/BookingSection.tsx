"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { CalendarDays, CheckCircle2, Loader2 } from "lucide-react";
import { contactIndustryOptions } from "@/data/industriesFormOptions";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { CalendlyEmbed } from "@/components/contact/CalendlyEmbed";
import { CALENDLY_URL } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  business: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  automate: string;
}

const initialState: FormState = {
  name: "",
  business: "",
  email: "",
  phone: "",
  website: "",
  industry: "",
  automate: "",
};

type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Name is required.";
  if (!form.business.trim()) errors.business = "Business name is required.";
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (form.phone.replace(/\D/g, "").length < 10) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!form.industry) errors.industry = "Select an industry.";
  if (!form.automate.trim()) errors.automate = "Tell us what you'd like to automate.";
  return errors;
}

type Status = "idle" | "submitting" | "success" | "error";

export function BookingSection() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus("submitting");
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      setForm(initialState);
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <section id="contact" className="border-b border-ink-800 py-24 sm:py-28">
        <Container>
          <FadeIn className="mx-auto max-w-lg rounded-2xl border border-signal-on/30 bg-signal-on/[0.06] p-10 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-signal-on" />
            <h3 className="mt-4 text-xl font-semibold text-paper-50">Request received.</h3>
            <p className="mt-2 text-sm leading-relaxed text-mist-400">
              We&apos;ll review what you shared and follow up shortly to schedule your strategy
              call.
            </p>
            <Button variant="secondary" className="mt-6" onClick={() => setStatus("idle")}>
              Submit another request
            </Button>
          </FadeIn>
        </Container>
      </section>
    );
  }

  return (
    <section id="contact" className="border-b border-ink-800 py-24 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Book A Call"
          title="Tell us about your business."
          description="Share a few details and we'll come to the call already thinking about where automation fits for you."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <FadeIn>
            <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-2xl border border-ink-700 bg-ink-900/40 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Name"
                  id="name"
                  value={form.name}
                  onChange={(v) => update("name", v)}
                  error={errors.name}
                  autoComplete="name"
                />
                <Field
                  label="Business"
                  id="business"
                  value={form.business}
                  onChange={(v) => update("business", v)}
                  error={errors.business}
                  autoComplete="organization"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Email"
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(v) => update("email", v)}
                  error={errors.email}
                  autoComplete="email"
                />
                <Field
                  label="Phone"
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(v) => update("phone", v)}
                  error={errors.phone}
                  autoComplete="tel"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Website (optional)"
                  id="website"
                  value={form.website}
                  onChange={(v) => update("website", v)}
                  autoComplete="url"
                />
                <div>
                  <label htmlFor="industry" className="mb-1.5 block text-sm text-mist-400">
                    Industry
                  </label>
                  <select
                    id="industry"
                    value={form.industry}
                    onChange={(e) => update("industry", e.target.value)}
                    className={cn(
                      "w-full rounded-lg border bg-ink-950 px-3.5 py-2.5 text-sm text-paper-50 focus:outline-none",
                      errors.industry ? "border-red-500/60" : "border-ink-600 focus:border-accent",
                    )}
                    aria-invalid={!!errors.industry}
                  >
                    <option value="">Select one</option>
                    {contactIndustryOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  {errors.industry && <p className="mt-1 text-xs text-red-400">{errors.industry}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="automate" className="mb-1.5 block text-sm text-mist-400">
                  What would you like to automate?
                </label>
                <textarea
                  id="automate"
                  rows={4}
                  value={form.automate}
                  onChange={(e) => update("automate", e.target.value)}
                  className={cn(
                    "w-full resize-none rounded-lg border bg-ink-950 px-3.5 py-2.5 text-sm text-paper-50 placeholder:text-mist-500 focus:outline-none",
                    errors.automate ? "border-red-500/60" : "border-ink-600 focus:border-accent",
                  )}
                  placeholder="e.g. We miss too many calls after hours and lose the lead."
                  aria-invalid={!!errors.automate}
                />
                {errors.automate && <p className="mt-1 text-xs text-red-400">{errors.automate}</p>}
              </div>

              {serverError && <p className="text-sm text-red-400">{serverError}</p>}

              <Button
                type="submit"
                size="lg"
                disabled={status === "submitting"}
                icon={status === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : undefined}
                className="w-full sm:w-auto"
              >
                {status === "submitting" ? "Submitting…" : "Request Strategy Call"}
              </Button>
            </form>
          </FadeIn>

          <FadeIn delay={0.1} className="flex flex-col rounded-2xl border border-ink-700 bg-ink-900/40 p-6">
            <CalendarDays className="h-6 w-6 text-accent" />
            <p className="mt-3 text-sm font-medium text-paper-50">Prefer to pick a time directly?</p>
            <p className="mt-2 text-sm leading-relaxed text-mist-400">
              Book straight onto the calendar below — no need to wait for a reply.
            </p>
            <div className="mt-5 overflow-hidden rounded-xl border border-ink-700 bg-white">
              <CalendlyEmbed />
            </div>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-center text-xs text-mist-500 hover:text-paper-50"
            >
              Having trouble loading the calendar? Open it in a new tab →
            </a>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm text-mist-400">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        aria-invalid={!!error}
        className={cn(
          "w-full rounded-lg border bg-ink-950 px-3.5 py-2.5 text-sm text-paper-50 placeholder:text-mist-500 focus:outline-none",
          error ? "border-red-500/60" : "border-ink-600 focus:border-accent",
        )}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
