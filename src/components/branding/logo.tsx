import Image from "next/image";
import Link from "next/link";

export function Logo({ size = 44, showWordmark = true }: { size?: number; showWordmark?: boolean }) {
  return (
    <Link href="/" className="inline-flex items-center gap-3 group" aria-label="Chennai Rice Industries — Home">
      <Image
        src="/images/chennai-rice-logo.png"
        alt="Chennai Rice Industries India (P) Ltd. logo"
        width={size}
        height={size}
        className="transition-transform duration-300 group-hover:scale-105"
        priority
      />
      {showWordmark && (
        <span className="hidden sm:flex flex-col leading-tight">
          <span className="font-serif-display text-base text-maroon-dark tracking-wide">Chennai Rice</span>
          <span className="text-[10px] uppercase tracking-[0.18em] text-ink/50">Industries India (P) Ltd.</span>
        </span>
      )}
    </Link>
  );
}
