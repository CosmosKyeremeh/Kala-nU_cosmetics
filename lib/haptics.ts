// Real device haptic feedback via the Vibration API — supported on Android
// Chrome/Firefox. iOS Safari has no equivalent web API, so this silently
// no-ops there rather than faking it.
export function hapticTap(pattern: number | number[] = 10) {
  if (typeof window === "undefined") return;
  if ("vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // ignore — vibration is a nice-to-have, never block on it
    }
  }
}
