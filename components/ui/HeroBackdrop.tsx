import Image from "next/image";

// Full-bleed hero images stretched with plain object-cover look sharp on a
// tall phone screen but get cropped into an extreme wide/short ratio on
// desktop, forcing an upscale of a portrait-oriented source photo — which
// reads as blurry. This renders the same photo twice: a blurred, oversized
// cover layer fills the frame edge-to-edge (hides any softness on purpose),
// while a crisp object-contain layer sits on top so the actual subject is
// never stretched or upscaled past its native resolution.
export function HeroBackdrop({
  src,
  alt,
  priority,
  opacity = 1,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  opacity?: number;
}) {
  return (
    <div className="absolute inset-0" style={{ opacity }}>
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes="100vw"
        aria-hidden
        className="scale-110 object-cover blur-2xl"
      />
      <div className="absolute inset-0 bg-charcoal/20" />
      <Image src={src} alt={alt} fill priority={priority} sizes="100vw" className="object-contain" />
    </div>
  );
}
