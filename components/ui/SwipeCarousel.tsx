"use client";

import { useRef } from "react";

// Zero-dependency swipe/drag carousel: native touch scrolling + snap gives
// the phone-swipe feel for free; the pointer handlers add click-and-drag
// so a mouse or trackpad gets the same grab-to-swipe gesture.
export function SwipeCarousel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ isDown: false, startX: 0, scrollLeft: 0, moved: false });

  function onPointerDown(e: React.PointerEvent) {
    const track = trackRef.current;
    if (!track) return;
    drag.current = { isDown: true, startX: e.clientX, scrollLeft: track.scrollLeft, moved: false };
    track.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    const track = trackRef.current;
    const state = drag.current;
    if (!state.isDown || !track) return;
    const dx = e.clientX - state.startX;
    if (Math.abs(dx) > 4) state.moved = true;
    track.scrollLeft = state.scrollLeft - dx;
  }

  function onPointerUp(e: React.PointerEvent) {
    drag.current.isDown = false;
    trackRef.current?.releasePointerCapture(e.pointerId);
  }

  function onClickCapture(e: React.MouseEvent) {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  }

  return (
    <div
      ref={trackRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      onClickCapture={onClickCapture}
      className={`flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 cursor-grab select-none active:cursor-grabbing [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {children}
    </div>
  );
}
