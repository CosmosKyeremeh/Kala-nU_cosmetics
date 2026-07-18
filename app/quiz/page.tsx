"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  usePersonalizationStore,
  SKIN_TONES,
  UNDERTONES,
  CONCERNS,
  LIGHTING,
} from "@/lib/store/personalization";

type Step = 0 | 1 | 2 | 3 | 4;

const STEPS: { key: "skinTone" | "undertone" | "concern" | "lighting"; title: string; options: readonly string[] }[] = [
  { key: "skinTone", title: "Which best describes your skin tone?", options: SKIN_TONES },
  { key: "undertone", title: "What's your undertone?", options: UNDERTONES },
  { key: "concern", title: "What's your main skin concern?", options: CONCERNS },
  { key: "lighting", title: "Where do you usually check your makeup?", options: LIGHTING },
];

export default function QuizPage() {
  const [step, setStep] = useState<Step>(0);
  const { setAnswer, complete, skinTone, undertone, concern, lighting } = usePersonalizationStore();

  const answers = { skinTone, undertone, concern, lighting };
  const done = step === 4;

  function selectOption(value: string) {
    const current = STEPS[step];
    setAnswer(current.key, value as never);
    if (step < 3) {
      setTimeout(() => setStep((s) => (s + 1) as Step), 200);
    } else {
      complete();
      setTimeout(() => setStep(4), 200);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <div className="mb-10 flex gap-2">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition ${
              i <= step ? "bg-rose-primary" : "bg-rose-light/40"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {!done ? (
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
          >
            <p className="eyebrow">
              Step {step + 1} of {STEPS.length}
            </p>
            <h1 className="font-display text-display-lg mt-3 mb-8 font-semibold">
              {STEPS[step].title}
            </h1>
            <div className="grid gap-3">
              {STEPS[step].options.map((option) => {
                const currentValue = answers[STEPS[step].key];
                const active = currentValue === option;
                return (
                  <button
                    key={option}
                    onClick={() => selectOption(option)}
                    className={`rounded-xl border px-5 py-4 text-left capitalize transition ${
                      active
                        ? "border-rose-primary bg-rose-light/20"
                        : "border-rose-light/60 bg-white hover:border-rose-primary"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-primary text-2xl text-white">
              ✓
            </div>
            <h1 className="font-display text-display-lg mt-6 font-semibold">
              This is for you
            </h1>
            <p className="mt-3 text-slate">
              {skinTone} skin, {undertone} undertone, focused on {concern} — checked in{" "}
              {lighting}. We&apos;ve tailored recommendations to match.
            </p>
            <Link
              href="/#recommended"
              className="mt-8 inline-block rounded-full bg-rose-primary px-8 py-3 font-semibold text-white hover:bg-rose-primary/90"
            >
              See My Recommendations
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
