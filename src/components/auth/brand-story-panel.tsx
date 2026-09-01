import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

export function BrandStoryPanel({
  heading,
  subheading,
  steps,
  children,
}: {
  heading: ReactNode;
  subheading: string;
  steps?: string[];
  children?: ReactNode;
}) {
  return (
    <div className="relative hidden lg:flex flex-col justify-between text-ivory p-12 xl:p-16 overflow-hidden border-r border-gold/20">
      <Image
        src="/images/hero/mill-silhouette-bg.png"
        alt=""
        fill
        priority
        sizes="55vw"
        className="object-cover animate-fade-scale z-[1]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-maroon-dark/70 via-maroon-dark/55 to-maroon-dark/85 z-[1]" />

      <Link
        href="/"
        aria-label="Chennai Rice Industries — Home"
        className="relative z-[6] inline-flex items-center gap-4 group animate-slide-up"
      >
        <Image
          src="/images/chennai-rice-logo.png"
          alt="Chennai Rice Industries India (P) Ltd. logo"
          width={100}
          height={100}
          className="w-[90px] h-[90px] xl:w-[104px] xl:h-[104px] transition-transform duration-300 group-hover:scale-105"
          priority
        />
        <span className="flex flex-col leading-tight">
          <span className="font-serif-display text-2xl xl:text-[28px] text-ivory tracking-wide">Chennai Rice</span>
          <span className="text-xs xl:text-[13px] uppercase tracking-[0.14em] text-ivory/60 mb-1.5">
            Industries India (P) Ltd.
          </span>
          <span className="text-[11px] uppercase tracking-[0.2em] text-gold font-semibold">
            Mill Direct &middot; Since 1950
          </span>
        </span>
      </Link>

      <div className="relative z-[4]">
        <h1 className="font-serif-display text-4xl xl:text-5xl leading-[1.1] mb-6 max-w-lg animate-slide-up [animation-delay:0.1s] [animation-fill-mode:both]">
          {heading}
        </h1>
        <p className="text-ivory/65 leading-relaxed max-w-md mb-8 animate-slide-up [animation-delay:0.2s] [animation-fill-mode:both]">
          {subheading}
        </p>

        {steps && steps.length > 0 && (
          <ol className="flex flex-col gap-3.5 mb-2 stagger-in">
            {steps.map((step, i) => (
              <li key={step} className="flex items-center gap-3 text-sm text-ivory/85">
                <span className="flex-none w-6 h-6 rounded-full bg-gold text-maroon-dark text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        )}

        {children}
      </div>

      <div className="relative z-[4] max-w-[46%] pt-6 border-t border-ivory/10">
        <div className="flex items-center gap-3 text-xs text-ivory/40 flex-wrap">
          <span aria-hidden="true">&#10058;</span>
          <p>&copy; {new Date().getFullYear()} Chennai Rice Industries India (P) Ltd.</p>
          <span aria-hidden="true">|</span>
          <p>Chennai, Tamil Nadu, India</p>
          <span aria-hidden="true">|</span>
          <p>ESTD. 1950</p>
        </div>
      </div>
    </div>
  );
}
