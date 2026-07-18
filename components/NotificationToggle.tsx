"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export function NotificationToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [saving, setSaving] = useState(false);

  async function toggle() {
    const next = !enabled;
    setSaving(true);
    const res = await fetch("/api/profile/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notificationsEnabled: next }),
    });
    setSaving(false);

    if (!res.ok) {
      toast.error("Could not update preference");
      return;
    }
    setEnabled(next);
    toast.success(next ? "Notifications enabled" : "Notifications disabled");
  }

  return (
    <label className="flex items-center justify-between gap-4 text-sm">
      <span>
        SMS &amp; email order updates
        <span className="block text-xs text-slate">
          Get notified when your order status changes
        </span>
      </span>
      <button
        role="switch"
        aria-checked={enabled}
        onClick={toggle}
        disabled={saving}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          enabled ? "bg-rose-primary" : "bg-slate/30"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
            enabled ? "left-5" : "left-0.5"
          }`}
        />
      </button>
    </label>
  );
}
