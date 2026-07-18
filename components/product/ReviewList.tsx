"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

export type ReviewData = {
  id: string;
  authorName: string;
  rating: number;
  body: string;
  photos: string[];
  skinTone: string | null;
  concern: string | null;
  createdAt: string;
};

const SKIN_TONES = ["fair", "light", "medium", "tan", "deep"] as const;
const CONCERNS = ["dryness", "oiliness", "dullness", "acne", "ageing", "sensitivity"] as const;

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-gold-accent" aria-label={`${rating} out of 5 stars`}>
      {"★".repeat(rating)}
      <span className="text-rose-light">{"★".repeat(5 - rating)}</span>
    </span>
  );
}

export function ReviewList({ reviews }: { reviews: ReviewData[] }) {
  const [skinTone, setSkinTone] = useState<string | null>(null);
  const [concern, setConcern] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      reviews.filter(
        (r) => (!skinTone || r.skinTone === skinTone) && (!concern || r.concern === concern)
      ),
    [reviews, skinTone, concern]
  );

  const average = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Stars rating={Math.round(average)} />
          <span className="text-sm text-slate">
            {average.toFixed(1)} · {reviews.length} reviews
          </span>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <select
          value={skinTone ?? ""}
          onChange={(e) => setSkinTone(e.target.value || null)}
          className="rounded-full border border-rose-light bg-white px-3 py-1.5 text-xs capitalize"
        >
          <option value="">All skin tones</option>
          {SKIN_TONES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={concern ?? ""}
          onChange={(e) => setConcern(e.target.value || null)}
          className="rounded-full border border-rose-light bg-white px-3 py-1.5 text-xs capitalize"
        >
          <option value="">All concerns</option>
          {CONCERNS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate">No reviews match those filters yet.</p>
      ) : (
        <ul className="space-y-5">
          {filtered.map((review) => (
            <li key={review.id} className="rounded-2xl border border-rose-light/40 bg-white p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-ink">{review.authorName}</p>
                  <Stars rating={review.rating} />
                </div>
                <div className="flex gap-1 text-xs text-slate">
                  {review.skinTone && (
                    <span className="rounded-full bg-rose-light/30 px-2 py-0.5 capitalize">
                      {review.skinTone} skin
                    </span>
                  )}
                  {review.concern && (
                    <span className="rounded-full bg-rose-light/30 px-2 py-0.5 capitalize">
                      {review.concern}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate">{review.body}</p>
              {review.photos.length > 0 && (
                <div className="mt-3 flex gap-2">
                  {review.photos.map((photo) => (
                    <div key={photo} className="relative h-16 w-16 overflow-hidden rounded-lg">
                      <Image src={photo} alt="" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
