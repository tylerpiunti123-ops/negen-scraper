"use client";

import { useEffect, useRef, useState, type DragEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, ImagePlus, Loader2, X } from "lucide-react";
import { quoteNeeds, quoteSteps, quoteVehicleTypes } from "@/data/detailing/quote";
import { CTAButton } from "./shared/CTAButton";
import { SectionHeading } from "./shared/DetailingSectionHeading";
import { cn } from "@/lib/utils";

interface PhotoItem {
  id: string;
  url: string;
  name: string;
  progress: number;
  uploaded: boolean;
}

interface VehicleInfo {
  type: string;
  year: string;
  make: string;
  model: string;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

const stepVariants = {
  enter: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? 48 : -48,
    rotateY: direction > 0 ? -8 : 8,
    scale: 0.97,
  }),
  center: { opacity: 1, x: 0, rotateY: 0, scale: 1 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction > 0 ? -48 : 48,
    rotateY: direction > 0 ? 8 : -8,
    scale: 0.97,
  }),
};

/**
 * 4-step quote form with 3D slide transitions between steps, multi-photo
 * upload with drag-reorder and a simulated progress/upload state (no backend
 * media storage is wired up — swap handlePhotoFiles + submit for a real
 * upload endpoint when one exists).
 */
export function QuoteFlow() {
  const reducedMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const currentStep = quoteSteps[stepIndex]!;

  const [vehicle, setVehicle] = useState<VehicleInfo>({ type: "", year: "", make: "", model: "" });
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [contact, setContact] = useState<ContactInfo>({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragIndexRef = useRef<number | null>(null);

  useEffect(() => {
    const incomplete = photos.some((p) => !p.uploaded);
    if (!incomplete) return;
    const interval = setInterval(() => {
      setPhotos((prev) =>
        prev.map((p) => {
          if (p.uploaded) return p;
          const next = Math.min(100, p.progress + 12 + Math.random() * 18);
          return { ...p, progress: next, uploaded: next >= 100 };
        }),
      );
    }, 160);
    return () => clearInterval(interval);
  }, [photos]);

  function goTo(nextIndex: number) {
    setDirection(nextIndex > stepIndex ? 1 : -1);
    setStepIndex(nextIndex);
  }

  function canAdvance() {
    if (stepIndex === 0) return vehicle.type.trim().length > 0;
    if (stepIndex === 1) return selectedNeeds.length > 0;
    return true;
  }

  function handlePhotoFiles(files: FileList | null) {
    if (!files) return;
    const items: PhotoItem[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
      url: URL.createObjectURL(file),
      name: file.name,
      progress: 0,
      uploaded: false,
    }));
    setPhotos((prev) => [...prev, ...items]);
  }

  function removePhoto(id: string) {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }

  function handleDragStart(index: number) {
    dragIndexRef.current = index;
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  function handleDrop(index: number) {
    const from = dragIndexRef.current;
    dragIndexRef.current = null;
    if (from === null || from === index) return;
    setPhotos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      if (!moved) return prev;
      next.splice(index, 0, moved);
      return next;
    });
  }

  async function handleSubmit() {
    setError(null);
    if (!contact.name.trim() || !contact.email.trim() || !contact.phone.trim()) {
      setError("Please fill in your name, email, and phone number.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vehicle,
          needs: selectedNeeds,
          photoCount: photos.length,
          contact,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong sending your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="quote" className="relative py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Get A Quote"
          title="Tell us about your vehicle."
          align="center"
          className="mx-auto"
        />

        <div className="mt-10 flex items-center justify-center gap-2">
          {quoteSteps.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div
                className={cn(
                  "relative flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                  i <= stepIndex
                    ? "border-moto-red text-white"
                    : "border-moto-line text-mist-500",
                )}
              >
                {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
                {i === stepIndex && (
                  <motion.span
                    layoutId="quote-step-ring"
                    className="absolute inset-0 rounded-full border-2 border-moto-red"
                    transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  />
                )}
              </div>
              {i < quoteSteps.length - 1 && (
                <div className={cn("h-px w-8", i < stepIndex ? "bg-moto-red" : "bg-moto-line")} />
              )}
            </div>
          ))}
        </div>

        <div style={{ perspective: 1200 }} className="relative mt-10 overflow-hidden">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center rounded-2xl border border-moto-line bg-moto-panel p-10 text-center"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-moto-red/15 text-moto-redlight">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-paper-50">Request received.</h3>
                <p className="mt-2 max-w-sm text-sm text-mist-400">
                  We&apos;ll review your vehicle details and photos and follow up with a quote shortly.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key={currentStep.id}
                custom={direction}
                variants={reducedMotion ? undefined : stepVariants}
                initial={reducedMotion ? undefined : "enter"}
                animate={reducedMotion ? undefined : "center"}
                exit={reducedMotion ? undefined : "exit"}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-moto-line bg-moto-panel p-6 sm:p-8"
                style={{ transformStyle: "preserve-3d" }}
              >
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-moto-redlight">
                  Step {stepIndex + 1} of {quoteSteps.length}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-paper-50">{currentStep.title}</h3>

                {stepIndex === 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {quoteVehicleTypes.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setVehicle((v) => ({ ...v, type: t.id }))}
                        className={cn(
                          "rounded-xl border px-4 py-3 text-sm font-medium transition-colors",
                          vehicle.type === t.id
                            ? "border-moto-red bg-moto-red/15 text-white"
                            : "border-moto-line text-mist-400 hover:border-moto-chromedim hover:text-paper-50",
                        )}
                      >
                        {t.label}
                      </button>
                    ))}
                    <div className="col-span-2 mt-2 grid grid-cols-3 gap-3 sm:col-span-3">
                      <input
                        value={vehicle.year}
                        onChange={(e) => setVehicle((v) => ({ ...v, year: e.target.value }))}
                        placeholder="Year"
                        className="rounded-lg border border-moto-line bg-moto-carbon px-3 py-2 text-sm text-paper-50 placeholder:text-mist-500 focus:border-moto-red focus:outline-none"
                      />
                      <input
                        value={vehicle.make}
                        onChange={(e) => setVehicle((v) => ({ ...v, make: e.target.value }))}
                        placeholder="Make"
                        className="rounded-lg border border-moto-line bg-moto-carbon px-3 py-2 text-sm text-paper-50 placeholder:text-mist-500 focus:border-moto-red focus:outline-none"
                      />
                      <input
                        value={vehicle.model}
                        onChange={(e) => setVehicle((v) => ({ ...v, model: e.target.value }))}
                        placeholder="Model"
                        className="rounded-lg border border-moto-line bg-moto-carbon px-3 py-2 text-sm text-paper-50 placeholder:text-mist-500 focus:border-moto-red focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {stepIndex === 1 && (
                  <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {quoteNeeds.map((need) => {
                      const active = selectedNeeds.includes(need.id);
                      return (
                        <button
                          key={need.id}
                          type="button"
                          onClick={() =>
                            setSelectedNeeds((prev) =>
                              active ? prev.filter((id) => id !== need.id) : [...prev, need.id],
                            )
                          }
                          className={cn(
                            "flex items-start gap-3 rounded-xl border p-4 text-left transition-colors",
                            active
                              ? "border-moto-red bg-moto-red/15"
                              : "border-moto-line hover:border-moto-chromedim",
                          )}
                        >
                          <span
                            className={cn(
                              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border",
                              active ? "border-moto-red bg-moto-red text-white" : "border-moto-chromedim",
                            )}
                          >
                            {active && <Check className="h-3 w-3" />}
                          </span>
                          <span>
                            <span className="block text-sm font-medium text-paper-50">{need.label}</span>
                            <span className="block text-xs text-mist-500">{need.description}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {stepIndex === 2 && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-moto-chromedim/60 bg-moto-carbon px-6 py-10 text-center transition-colors hover:border-moto-red"
                    >
                      <ImagePlus className="h-6 w-6 text-moto-redlight" />
                      <span className="text-sm font-medium text-paper-50">Add photos of your vehicle</span>
                      <span className="text-xs text-mist-500">Panels, wheels, interior — whatever shows the condition.</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handlePhotoFiles(e.target.files)}
                    />

                    {photos.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <AnimatePresence>
                          {photos.map((photo, i) => (
                            <motion.div
                              key={photo.id}
                              layout
                              initial={{ opacity: 0, scale: 0.85 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.85 }}
                              draggable
                              onDragStart={() => handleDragStart(i)}
                              onDragOver={handleDragOver}
                              onDrop={() => handleDrop(i)}
                              className="group relative aspect-square cursor-grab overflow-hidden rounded-lg border border-moto-line active:cursor-grabbing"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={photo.url} alt={photo.name} className="h-full w-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removePhoto(photo.id)}
                                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                                aria-label="Remove photo"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                              {!photo.uploaded ? (
                                <div className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1.5">
                                  <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                                    <div
                                      className="h-full rounded-full bg-moto-redlight transition-[width] duration-150"
                                      style={{ width: `${photo.progress}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-moto-red text-white">
                                  <Check className="h-3 w-3" />
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                )}

                {stepIndex === 3 && (
                  <div className="mt-6 space-y-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <input
                        value={contact.name}
                        onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
                        placeholder="Full name"
                        className="rounded-lg border border-moto-line bg-moto-carbon px-3 py-2.5 text-sm text-paper-50 placeholder:text-mist-500 focus:border-moto-red focus:outline-none"
                      />
                      <input
                        value={contact.phone}
                        onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
                        placeholder="Phone"
                        className="rounded-lg border border-moto-line bg-moto-carbon px-3 py-2.5 text-sm text-paper-50 placeholder:text-mist-500 focus:border-moto-red focus:outline-none"
                      />
                    </div>
                    <input
                      value={contact.email}
                      onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
                      placeholder="Email"
                      type="email"
                      className="w-full rounded-lg border border-moto-line bg-moto-carbon px-3 py-2.5 text-sm text-paper-50 placeholder:text-mist-500 focus:border-moto-red focus:outline-none"
                    />
                    <textarea
                      value={contact.notes}
                      onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value }))}
                      placeholder="Anything else we should know?"
                      rows={3}
                      className="w-full resize-none rounded-lg border border-moto-line bg-moto-carbon px-3 py-2.5 text-sm text-paper-50 placeholder:text-mist-500 focus:border-moto-red focus:outline-none"
                    />
                    {error && <p className="text-sm text-moto-redlight">{error}</p>}
                  </div>
                )}

                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => goTo(stepIndex - 1)}
                    disabled={stepIndex === 0}
                    className="text-sm font-medium text-mist-400 transition-colors hover:text-paper-50 disabled:pointer-events-none disabled:opacity-0"
                  >
                    Back
                  </button>

                  {stepIndex < quoteSteps.length - 1 ? (
                    <CTAButton
                      onClick={() => canAdvance() && goTo(stepIndex + 1)}
                      variant="primary"
                      className={cn(!canAdvance() && "pointer-events-none opacity-40")}
                    >
                      Continue
                    </CTAButton>
                  ) : (
                    <CTAButton onClick={handleSubmit} variant="primary" className={cn(submitting && "pointer-events-none opacity-70")}>
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" /> Sending
                        </span>
                      ) : (
                        "Get Your Quote"
                      )}
                    </CTAButton>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
