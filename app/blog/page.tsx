import Link from "next/link";

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="eyebrow">Blog &amp; Tips</p>
      <h1 className="font-display mt-3 text-4xl font-semibold">Coming soon</h1>
      <p className="mt-4 text-slate">
        We&apos;re working on routine guides, shade-matching tips and skincare advice for Ghana&apos;s
        climate. Check back soon — in the meantime, try our shade quiz.
      </p>
      <Link
        href="/quiz"
        className="mt-8 inline-block rounded-full bg-rose-primary px-8 py-3 font-semibold text-white hover:bg-rose-primary/90"
      >
        Find Your Shade
      </Link>
    </div>
  );
}
