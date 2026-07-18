"use client";

import { useEffect, useRef, useState } from "react";
import { BrowserQRCodeReader, type IScannerControls } from "@zxing/browser";

// Continuous camera-based QR scanning. Note: this can only be verified in
// a real browser with camera access and a printed/displayed QR code — it
// hasn't been exercised end-to-end in this environment. The debounce below
// exists because ZXing's decode callback fires on every video frame while
// a code is in view, not once per physical scan.
const RESCAN_COOLDOWN_MS = 2500;

export function QrScanner({ onScan }: { onScan: (text: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScan = useRef<{ text: string; at: number } | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  async function startCamera() {
    setError(null);
    try {
      const reader = new BrowserQRCodeReader();
      const controls = await reader.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result) => {
          if (!result) return;
          const text = result.getText();
          const now = Date.now();
          const last = lastScan.current;
          if (last && last.text === text && now - last.at < RESCAN_COOLDOWN_MS) return;
          lastScan.current = { text, at: now };
          onScan(text);
        }
      );
      controlsRef.current = controls;
      setActive(true);
    } catch {
      setError("Could not access camera. Check permissions, or use manual search below.");
    }
  }

  function stopCamera() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setActive(false);
  }

  return (
    <div>
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-ink">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startCamera}
              className="rounded-full bg-rose-primary px-6 py-3 text-sm font-semibold text-white"
            >
              Start Camera
            </button>
          </div>
        )}
      </div>
      {active && (
        <button
          onClick={stopCamera}
          className="mt-2 text-sm text-slate underline hover:text-rose-primary"
        >
          Stop camera
        </button>
      )}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
