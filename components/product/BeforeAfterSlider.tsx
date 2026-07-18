"use client";

import { useRef, useState } from "react";

export function BeforeAfterSlider({
  beforeColor,
  afterColor,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  beforeColor: string;
  afterColor: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);

  function updateFromClientX(clientX: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl"
      onMouseMove={(e) => e.buttons === 1 && updateFromClientX(e.clientX)}
      onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
    >
      {/* "After" layer, full width */}
      <div
        className="absolute inset-0 flex items-end justify-start p-4"
        style={{ background: `linear-gradient(135deg, ${afterColor}, ${afterColor}aa)` }}
      >
        <span className="rounded-full bg-ink/60 px-3 py-1 text-xs font-medium text-cream">
          {afterLabel}
        </span>
      </div>

      {/* "Before" layer, clipped to slider position */}
      <div
        className="absolute inset-0 flex items-end justify-start overflow-hidden p-4"
        style={{
          width: `${position}%`,
          background: `linear-gradient(135deg, ${beforeColor}, ${beforeColor}aa)`,
        }}
      >
        <span className="rounded-full bg-ink/60 px-3 py-1 text-xs font-medium text-cream">
          {beforeLabel}
        </span>
      </div>

      {/* Divider handle */}
      <div
        className="absolute top-0 bottom-0 w-1 -translate-x-1/2 cursor-ew-resize bg-white shadow-lg"
        style={{ left: `${position}%` }}
        onMouseDown={(e) => {
          e.preventDefault();
          updateFromClientX(e.clientX);
        }}
      >
        <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-lg">
          ↔
        </div>
      </div>
    </div>
  );
}
